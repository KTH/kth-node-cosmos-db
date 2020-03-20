/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

const { CosmosClient } = require('@azure/cosmos')
const log = require('kth-node-log')

const Utils = require('./utils')

const CosmosClientWrapper = _hoistClassDeclaration()

module.exports = CosmosClientWrapper

/**
 * CosmosClientWrapper wraps the Offer (throughput handling) in Azure CosmosDB.
 * The actual database stuff is done in utils/cosmosDb.js
 */
function _hoistClassDeclaration() {
  // eslint-disable-next-line no-shadow
  return class CosmosClientWrapper {
    constructor(options) {
      Utils.options.validate(options)

      this._setDefaults()
      this._addAllOptionsToThis(options)

      const cosmosOptions = this._getCosmosClientOptions()
      this.cosmosClient = new CosmosClient(cosmosOptions)
    }

    _setDefaults() {
      this.db = undefined
      this.host = undefined
      this.password = undefined
      this.collections = []

      this.defaultThroughput = 400
      this.throughputStepsize = 200
      this.maxThroughput = 4000

      this.batchSize = 10000
    }

    _addAllOptionsToThis(options) {
      Object.keys(options).map(i => {
        this[i] = options[i]
      })
    }

    _getCosmosClientOptions() {
      const endpoint = Utils.url.useTls(this.host)

      return { endpoint, key: this.password }
    }

    static getListOfPublicMethods() {
      return [
        'init',
        'increaseCollectionThroughput',
        'updateCollectionThroughput',
        'getCollectionThroughput',
        'listCollectionsWithThroughput',
        'updateAllCollectionsThroughput',
        'resetThroughput'
      ]
    }

    /**
     * Creates the database and collections if they do not exists.
     *
     * @returns {Promise}
     * @throws
     */
    async init() {
      try {
        const database = await Utils.cosmosDb.createDatabase(this.cosmosClient, this.db)

        await Promise.all(
          this.collections.map(collection =>
            Utils.cosmosDb.createContainer(
              database,
              collection,
              collection.throughput || this.defaultThroughput
            )
          )
        )
      } catch (error) {
        log.error('kth-node-cosmos-db: Could not init database and/or collections.', { error })
        throw error
      }
    }

    /**
     * @param {string} collectionName
     *
     * @returns {Promise<number>}
     *    Throughput after update
     */
    async increaseCollectionThroughput(collectionName) {
      const collection = await Utils.cosmosDb.getOneContainerByClient(
        collectionName,
        this.cosmosClient
      )

      const formerThroughput = await Utils.cosmosDb.getContainerThroughput(collection)

      const canIncreaseThroughput = formerThroughput < this.maxThroughput

      if (canIncreaseThroughput) {
        const newThroughput = Math.min(
          formerThroughput + this.throughputStepsize,
          this.maxThroughput
        )

        await Utils.cosmosDb.setContainerThroughput(collection, newThroughput)

        return newThroughput
      }

      log.warn(
        `kth-node-cosmos-db: Collection '${collectionName}' is already using it´s max throughput '${this.maxThroughput}'.`
      )

      return formerThroughput
    }

    /**
     * @param {string} collectionName
     * @param {number} newThroughput
     *
     * @returns {Promise<number>}
     *    Throughput after update
     * @throws
     */
    async updateCollectionThroughput(collectionName, newThroughput) {
      try {
        const collection = await Utils.cosmosDb.getOneContainerByClient(
          collectionName,
          this.cosmosClient
        )

        const formerThroughput = await Utils.cosmosDb.getContainerThroughput(collection)

        const canUpdateThroughput = newThroughput > 0 && newThroughput <= this.maxThroughput

        if (canUpdateThroughput) {
          await Utils.cosmosDb.setContainerThroughput(collection, newThroughput)

          return newThroughput
        }

        log.info(
          `kth-node-cosmos-db: (${collectionName}) the given throughput is higher than maxThroughput (${this.maxThroughput})...`
        )

        return formerThroughput
      } catch (error) {
        log.error('kth-node-cosmos-db: Error in updateCollectionThroughput', { error })
        throw error
      }
    }

    /**
     * @param {string} collectionName
     *
     * @returns {Promise<number|null>}
     */
    async getCollectionThroughput(collectionName) {
      const offer = Utils.cosmosDb.getCollectionOffer(collectionName, this.cosmosClient)

      const foundOffer = offer != null && typeof offer === 'object'
      if (!foundOffer) {
        return null
      }

      // @ts-ignore
      const { content } = offer

      const foundThroughput =
        content != null && typeof content === 'object' && content.offerThroughput > 0
      if (!foundThroughput) {
        return null
      }

      return content.offerThroughput
    }

    /**
     * @param {number} newThroughput
     *
     * @returns {Promise}
     */
    async updateAllCollectionsThroughput(newThroughput) {
      try {
        await Promise.all(
          this.collections.map(collection =>
            this.updateCollectionThroughput(collection.name, newThroughput)
          )
        )

        log.info(`kth-node-cosmos-db: All collections throughput updated to ${newThroughput}`)
      } catch (error) {
        log.error('kth-node-cosmos-db: Error in updateAllCollectionsThroughput', { error })
        throw error
      }
    }

    /**
     * @returns {Promise<object[]>}
     */
    async listCollectionsWithThroughput() {
      try {
        const allCollectionsWithThroughput = await Promise.all(
          this.collections.map(async collection => {
            const offer = await this.getCollectionThroughput(collection.name)
            const throughputFound =
              offer != null &&
              typeof offer === 'object' &&
              offer.content != null &&
              typeof offer.content === 'object'

            return {
              collection: collection.name,
              throughput: throughputFound ? offer.content.offerThroughput : null
            }
          })
        )

        return allCollectionsWithThroughput
      } catch (error) {
        log.info('kth-node-cosmos-db: Could not list collections with throughput', { error })
        throw error
      }
    }

    /**
     * @returns {Promise}
     * @throws
     */
    async resetThroughput() {
      try {
        await Promise.all(
          this.collections.map(collection => {
            const throughput = collection.throughput || this.defaultThroughput
            log.info(
              `kth-node-cosmos-db: Resetting throughput to ${throughput} for collection ${collection.name}`
            )
            return this.updateCollectionThroughput(collection.name, throughput)
          })
        )
      } catch (error) {
        log.info('kth-node-cosmos-db: Error in resetThroughput', { error })
        throw error
      }
    }
  }
}
