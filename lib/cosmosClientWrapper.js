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
      Utils.options.validate(options)

      this.setDefaults()
      this.addAllOptionsToThis(options)

      const cosmosOptions = this.getCosmosClientOptions()
      this.cosmosClient = new CosmosClient(cosmosOptions)
    }

    setDefaults() {
      this.throughputStepsize = 200
      this.batchSize = 10000
      this.defaultThroughput = 400
      this.maxThroughput = 4000
    }

    addAllOptionsToThis(options) {
      Object.keys(options).map(i => {
        this[i] = options[i]
      })
    }

    getCosmosClientOptions() {
      return {
        endpoint: Utils.url.useTls(this.host),
        key: this.password
      }
    }

    /**
     * Creates the database and collections if they do not exists.
     */
    async init() {
      try {
        const database = await Utils.cosmosDb.createDatabase(this.db, this.cosmosClient)
        for (let i = 0; i < this.collections.length; i++) {
          const collection = this.collections[i]

          await Utils.cosmosDb.createCollection(
            database,
            this.cosmosClient,
            collection,
            collection.throughput || this.defaultThroughput
          )
        }
      } catch (e) {
        log.error('kth-node-cosmos-db: Could not init database and/or collections.', { err: e })
        throw e
      }
    }

    canIncreaseThroughput(offer) {
      if (this.maxThroughput > offer.content.offerThroughput) {
        return true
      }
      return false
    }

    async increaseCollectionThroughput(name) {
      const offer = await Utils.cosmosDb.getCollectionOffer(name, this.cosmosClient)

      if (this.canIncreaseThroughput(offer)) {
        const newThroughput = offer.content.offerThroughput + this.throughputStepsize
        await Utils.cosmosDb.increaseThroughput(name, newThroughput, this.cosmosClient)
      } else {
        log.warn(
          `kth-node-cosmos-db: Collection '${name}' is already using it´s max throughput '${this.maxThroughput}'.`
        )
      }
      return offer.content.offerThroughput
    }

    async updateCollectionThroughput(name, throughput) {
      try {
        const offer = await Utils.cosmosDb.getCollectionOffer(name, this.cosmosClient)

        if (this.maxThroughput >= throughput) {
          offer.content.offerThroughput = throughput
          await Utils.cosmosDb.increaseThroughput(name, offer, this.cosmosClient)
        } else {
          log.info(
            `kth-node-cosmos-db: (${name}) the given throughput is higher than maxThroughput (${this.maxThroughput})...`
          )
        }

        return offer.content.offerThroughput
      } catch (e) {
        log.error('kth-node-cosmos-db: Error in updateCollectionThroughout', { err: e })
        throw e
      }
    }

    async getCollectionThroughput(name) {
      return Utils.cosmosDb.getCollectionThroughput(name, this.cosmosClient)
    }

    async updateAllCollectionsThroughput(throughput) {
      try {
        for (let i = 0; i < this.collections.length; i++) {
          const collection = this.collections[i]

          await this.updateCollectionThroughput(collection.name, throughput)
        }

        log.info(`kth-node-cosmos-db: All collections throughput updated to ${throughput}`)
      } catch (e) {
        log.error('kth-node-cosmos-db: Error in updateAllCollectionsThroughput', { err: e })
        throw e
      }
    }

    async listCollectionsWithThroughput() {
      const collections = []

      try {
        for (let i = 0; i < this.collections.length; i++) {
          const collection = this.collections[i]

          const offer = await this.getCollectionThroughput(collection.name)

          collections.push({
            collection: collection.name,
            throughput: offer.content.offerThroughput
          })
        }

        return collections
      } catch (e) {
        log.info('kth-node-cosmos-db: Could not list collections with throughput', { err: e })
        throw e
      }
    }

    async resetThroughput() {
      try {
        for (let i = 0; i < this.collections.length; i++) {
          const collection = this.collections[i]

          const throughput = collection.throughput || this.defaultThroughput

          await this.updateCollectionThroughput(collection.name, throughput)

          log.info(
            `kth-node-cosmos-db: Resetting throughput to ${throughput} for collection ${collection.name}`
          )
        }
      } catch (e) {
        log.info('kth-node-cosmos-db: Error in resetThroughput', { err: e })
        throw e
      }
    }
  }
}
