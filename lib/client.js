const log = require('kth-node-log')
const cosmosdb = require('./utils/cosmosdb')
const { _development } = require('./utils/development')
const { DocumentClient } = require('documentdb')

let client

const validateOpts = opts => {
  const REQUIRED_OPTS = ['host', 'db', 'collections', 'password', 'username', 'maxThroughput']

  // Look for missing config
  const missing = REQUIRED_OPTS.map(key => {
    if (!Object.keys(opts).includes(key)) {
      return key
    }
  }).filter(key => key)

  if (missing.length > 0) {
    throw new Error(
      'kth-node-cosmos-db: One or more of the required config options is missing, please add these to the conf object: ' +
        missing.join(', ')
    )
  }
}

const validateCollections = collections => {
  collections.map(collection => {
    if (typeof collection !== 'object') {
      throw new Error(
        'kth-node-cosmos-db: The collections option are only allowed to contain objects'
      )
    }
    if (!collection.name) {
      throw new Error('kth-node-cosmos-db: One of the collection objects is missing a name')
    }
  })
}

class Azure {
  constructor(opts) {
    if (typeof opts !== 'object') {
      throw new Error('kth-node-cosmos-db: You need to pass a config object to the construct')
    }

    // Defaults
    this.throughputStepsize = 200
    this.batchSize = 10000
    this.defaultThroughput = 400
    this.maxThroughput = 4000

    // Validate
    validateOpts(opts)
    validateCollections(opts.collections)

    // Add opts to this
    Object.keys(opts).map(i => {
      this[i] = opts[i]
    })

    this.client = new DocumentClient(`https://${this.host.replace(/\:\d*/, '')}`, {
      masterKey: this.password
    })
  }

  async init() {
    try {
      log.info(`kth-node-cosmos-db: Intializing database...`)

      await cosmosdb.createDatabase(this.db, this.client)

      log.info('kth-node-cosmos-db: Initializing collections...')

      for (let i = 0; i < this.collections.length; i++) {
        const collection = this.collections[i]

        await cosmosdb.createCollection(
          this.db,
          this.client,
          collection,
          collection.throughput || this.defaultThroughput
        )
      }
      log.info(`kth-node-cosmos-db: Initialized all collections`)
    } catch (e) {
      log.error('kth-node-cosmos-db: Error in init', { err: e })
      throw e
    }
  }

  async increaseCollectionThroughput(name) {
    try {
      const offer = await this.getCollectionThroughput(name)
      const { offerThroughput } = offer.content

      if (this.maxThroughput > offerThroughput) {
        offer.content.offerThroughput += this.throughputStepsize

        await cosmosdb.increaseThroughput(name, offer, this.client)
      } else {
        log.info(
          `kth-node-cosmos-db: (${name}) Max throughput is reached (${this.maxThroughput})...`
        )
      }

      await new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, 200)
      })

      return offer.content.offerThroughput
    } catch (e) {
      log.error('kth-node-cosmos-db: Error in increaseCollectionThroughput', { err: e })
      throw e
    }
  }

  async updateCollectionThroughput(name, throughput) {
    try {
      const offer = await this.getCollectionThroughput(name)

      if (this.maxThroughput >= throughput) {
        offer.content.offerThroughput = throughput

        await cosmosdb.increaseThroughput(name, offer, this.client)
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
    try {
      const collection = await cosmosdb.getCollection(this.db, name, this.client)

      const query = {
        query: 'SELECT * FROM root r WHERE r.resource=@link',
        parameters: [
          {
            name: '@link',
            value: collection._self
          }
        ]
      }

      const offer = await cosmosdb.getThroughput(query, this.client)

      return offer
    } catch (e) {
      log.error('kth-node-cosmos-db: Error in getCollectionThroughput', { err: e })
      throw e
    }
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

function createClient(opts) {
  if (!_development(process.env)) {
    client = new Azure(opts)
    return client
  }

  log.info(`kth-node-cosmos-db: Your are in development mode. There will be no client returned`)
}

function getClient() {
  if (_development(process.env)) {
    log.debug(
      `kth-node-cosmos-db: You are accessing the kth-node-cosmos-db: client in development (Please add process.env.USE_COSMOS_DB='true' if you want to use any of its functions)`
    )

    const devDefaults = {
      increaseCollectionThroughput: () =>
        log.debug(
          `kth-node-cosmos-db: increaseCollectionThroughput is not implemented in development`
        ),
      updateCollectionThroughput: () =>
        log.debug(
          `kth-node-cosmos-db: updateCollectionThroughput is not implemented in development`
        ),
      updateAllCollectionsThroughput: () =>
        log.debug(
          `kth-node-cosmos-db: updateAllCollectionsThroughput is not implemented in development`
        ),
      listCollectionsWithThroughput: () =>
        log.debug(
          `kth-node-cosmos-db: listCollectionsWithThroughput is not implemented in development`
        ),
      getCollectionThroughput: () =>
        log.debug(`kth-node-cosmos-db: getCollectionThroughput is not implemented in development`),
      resetThroughput: () =>
        log.debug(`kth-node-cosmos-db: resetThroughput is not implemented in development`)
    }

    return devDefaults
  }

  return client
}

module.exports = {
  createClient,
  getClient
}
