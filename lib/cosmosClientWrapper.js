const log = require('kth-node-log')
const { CosmosClient } = require('@azure/cosmos')
const { useMongoNative } = require('./utils/environmentUtils')
const cosmosdbUtils = require('./utils/cosmosdbUtils')
const urlUtils = require('./utils/urlUtils')
const optionsUtils = require('./utils/optionsUtils')

let cosmosClientWrapper

/**
 * In local development we use MongoDB, which does not support setting/changing Azure Cosmos specific throughput.
 * The following object is returned when envirnoment NODE_ENV=development is set, instead of a cosmosClientWrapper.
 */
const COSMOS_DB_ONLY = {
  increaseCollectionThroughput: () => log.info(`Not availible in native MongoDB.`),
  updateCollectionThroughput: () => log.info(`Not availible in native MongoDB.`),
  updateAllCollectionsThroughput: () => log.info(`Not availible in native MongoDB.`),
  listCollectionsWithThroughput: () => log.info(`Not availible in native MongoDB.`),
  getCollectionThroughput: () => log.info(`Not availible in native MongoDB.`),
  resetThroughput: () => log.info(`Not availible in native MongoDB.`),
  init: () => log.info(`Not availible in native MongoDB.`)
}

/**
 * Class that wraps the Offer (throughput handling) in Azure CosmosDB.
 * The acual db stuff is done in cosmosdbUtils.js
 */

class CosmosClientWrapper {
  constructor(options) {
    optionsUtils.validate(options)
    this.setDefaults()
    this.addAllOptionsToThis(options)
    this.cosmosClient = new CosmosClient(this.getCosmosClientOptions())
  }

  setDefaults() {
    this.throughputStepsize = 200
    this.batchSize = 10000
    this.defaultThroughput = 400
    this.maxThroughput = 4000
  }

  addAllOptionsToThis(options) {
    // Add all passed options to this
    Object.keys(options).map(i => {
      this[i] = options[i]
    })
  }

  getCosmosClientOptions() {
    return {
      endpoint: urlUtils.useTls(this.host),
      key: this.password
    }
  }

  /**
   * Creates the database and collections if they do not exists.
   */
  async init() {
    try {
      const database = await cosmosdbUtils.createDatabase(this.db, this.cosmosClient)
      for (let i = 0; i < this.collections.length; i++) {
        const collection = this.collections[i]

        await cosmosdbUtils.createCollection(
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
    const offer = await cosmosdbUtils.getCollectionOffer(name, this.cosmosClient)

    if (this.canIncreaseThroughput(offer)) {
      const newThroughput = offer.content.offerThroughput + this.throughputStepsize
      await cosmosdbUtils.increaseThroughput(name, newThroughput, this.cosmosClient)
    } else {
      log.warn(
        `kth-node-cosmos-db: Collection '${name}' is already using it´s max throughput '${this.maxThroughput}'.`
      )
    }
    return offer.content.offerThroughput
  }

  async updateCollectionThroughput(name, throughput) {
    try {
      const offer = await cosmosdbUtils.getCollectionOffer(name, this.cosmosClient)

      if (this.maxThroughput >= throughput) {
        offer.content.offerThroughput = throughput
        await cosmosdbUtils.increaseThroughput(name, offer, this.cosmosClient)
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
    return cosmosdbUtils.getCollectionThroughput(name, this.cosmosClient)
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

function createClient(options) {
  if (useMongoNative()) {
    log.info(`kth-node-cosmos-db: Your are in development mode. There will be no client returned`)
    return COSMOS_DB_ONLY
  }

  cosmosClientWrapper = new CosmosClientWrapper(options)
  return cosmosClientWrapper
}

function getClient() {
  if (useMongoNative()) {
    log.warn(
      `kth-node-cosmos-db: You are accessing the kth-node-cosmos-db: client in development (Please add process.env.USE_COSMOS_DB='true' if you want to use any of its functions)`
    )
    return COSMOS_DB_ONLY
  }

  return cosmosClientWrapper
}

/**
 * Exports
 */
module.exports = {
  createClient,
  getClient
}
