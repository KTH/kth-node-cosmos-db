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
    static getListOfPublicMethods() {
      return [
        'init',
        'getCollectionThroughput',
        'listCollectionsWithThroughput',
        'increaseCollectionThroughput',
        'updateCollectionThroughput',
        'updateAllCollectionsThroughput',
        'resetThroughput'
      ]
    }

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
              collection.name,
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
     * @returns {Promise<number|null>}
     */
    async getCollectionThroughput(collectionName) {
      const collection = await Utils.cosmosDb.getOneContainerByClient(
        collectionName,
        this.cosmosClient
      )
      if (collection == null) {
        return null
      }

      const throughput = Utils.cosmosDb.getContainerThroughput(collection)
      return throughput
    }

    /**
     * @returns {Promise<object[]|null>}
     *    Resolves with list of collection names and related throughputs, e.g.
     *        [ { name: 'Collection1', throughput: 300 }, ... ]; or
     *    Resolves with null iff no collection and related throughput could be determined
     */
    async listCollectionsWithThroughput() {
      try {
        const _queryCollectionNameWithThroughput = async collection => {
          const { name: collectionName } = collection

          const container = await Utils.cosmosDb.getOneContainerByClient(
            collectionName,
            this.cosmosClient
          )
          if (container == null) {
            return null
          }

          const throughput = await Utils.cosmosDb.getContainerThroughput(container)
          if (throughput == null) {
            return null
          }

          return {
            collection: collectionName,
            throughput
          }
        }

        const queryResult = await Promise.all(
          this.collections.map(_queryCollectionNameWithThroughput)
        )

        const allCollectionNamesWithThroughput = queryResult.filter(item => item != null)

        return allCollectionNamesWithThroughput.length === 0
          ? null
          : allCollectionNamesWithThroughput
      } catch (error) {
        log.info('kth-node-cosmos-db: Could not list collections with throughput', { error })
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
     * @param {number} newThroughput
     *
     * @returns {Promise}
     */
    async updateAllCollectionsThroughput(newThroughput) {
      try {
        const results = await Promise.all(
          this.collections.map(collection =>
            this.updateCollectionThroughput(collection.name, newThroughput)
          )
        )

        log.info(`kth-node-cosmos-db: All collections throughput updated to ${newThroughput}`)

        return results
      } catch (error) {
        log.error('kth-node-cosmos-db: Error in updateAllCollectionsThroughput', { error })
        throw error
      }
    }

    /**
     * @returns {Promise}
     * @throws
     */
    async resetThroughput() {
      try {
        const _resetThroughputOfOneCollection = async collection => {
          const { name: collectionName } = collection
          const newThroughput = collection.throughput || this.defaultThroughput

          log.info(
            `kth-node-cosmos-db: Resetting collection throughput (${collectionName}: ${newThroughput})`
          )

          return this.updateCollectionThroughput(collectionName, newThroughput)
        }

        const newThroughputList = await Promise.all(
          this.collections.map(_resetThroughputOfOneCollection)
        )

        return newThroughputList
      } catch (error) {
        log.info('kth-node-cosmos-db: Error in resetThroughput', { error })
        throw error
      }
    }
  }
}
