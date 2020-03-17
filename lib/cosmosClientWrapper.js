/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

const { CosmosClient } = require('@azure/cosmos')
const log = require('kth-node-log')

const Utils = require('./utils')

module.exports = _hoistClassDeclaration()

/**
 * CosmosClientWrapper wraps the Offer (throughput handling) in Azure CosmosDB.
 * The actual database stuff is done in utils/cosmosDb.js
 */
function _hoistClassDeclaration() {
  return class CosmosClientWrapper {
    constructor(options) {
      this._setDefaults()

      Utils.options.validate(options)
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
      return {
        endpoint: Utils.url.useTls(this.host),
        key: this.password
      }
    }

    /**
     * Creates the database and collections if they do not exists.
     *
     * @returns {Promise}
     * @throws
     */
    async init() {
      try {
        const database = await Utils.cosmosDb.createDatabase(this.db, this.cosmosClient)

        await Promise.all(
          this.collections.map(collection =>
            Utils.cosmosDb.createCollection(
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
     *    Throughput before update
     */
    async increaseCollectionThroughput(collectionName) {
      const offer = await Utils.cosmosDb.getCollectionOffer(collectionName, this.cosmosClient)
      const canIncreaseThroughput = offer.content.offerThroughput < this.maxThroughput

      if (canIncreaseThroughput) {
        const newThroughput = Math.min(
          offer.content.offerThroughput + this.throughputStepsize,
          this.maxThroughput
        )
        await Utils.cosmosDb.increaseThroughput(collectionName, newThroughput, this.cosmosClient)
      } else {
        log.warn(
          `kth-node-cosmos-db: Collection '${collectionName}' is already using it´s max throughput '${this.maxThroughput}'.`
        )
      }

      return offer.content.offerThroughput
    }

    /**
     * @param {string} collectionName
     * @param {number} throughput
     *
     * @returns {Promise<number>}
     *    Throughput before update
     * @throws
     */
    async updateCollectionThroughput(collectionName, throughput) {
      try {
        const offer = await Utils.cosmosDb.getCollectionOffer(collectionName, this.cosmosClient)

        if (throughput <= this.maxThroughput) {
          offer.content.offerThroughput = throughput
          await Utils.cosmosDb.increaseThroughput(collectionName, offer, this.cosmosClient)
        } else {
          log.info(
            `kth-node-cosmos-db: (${collectionName}) the given throughput is higher than maxThroughput (${this.maxThroughput})...`
          )
        }

        return offer.content.offerThroughput
      } catch (error) {
        log.error('kth-node-cosmos-db: Error in updateCollectionThroughput', { error })
        throw error
      }
    }

    /**
     * @param {*} collectionName
     *
     * @returns {Promise}
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
     * Alias to setAllCollectionsThroughput (backward compatibility)
     *
     * @param {number} newThroughput
     *
     * @returns {Promise}
     */
    async updateAllCollectionsThroughput(newThroughput) {
      await this.setAllCollectionsThroughput(newThroughput)
    }

    /**
     * @param {number} newThroughput
     *
     * @returns {Promise}
     */
    async setAllCollectionsThroughput(newThroughput) {
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
