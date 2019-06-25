'use strict'

const { _development } = require('../utils/development')
const DocumentClient = require('documentdb').DocumentClient

const REQUIRED_OPTS = ['host', 'db', 'collections', 'password', 'username', 'maxThroughput']

let client
let log

// Safe load logger
try {
  log = require('kth-node-log')
} catch (e) {
  log = console
}

/*
opts: {
  host: String
  db: String
  collections: [Object]
  defaultThroughput: Number
  password: String,
  username: String,
  maxThroughput: Number,
  throughputStepsize: Number,
  batchSize: Number
  logger: Object
}
*/
var Azure = function(opts) {
  if (typeof opts !== 'object') {
    throw {
      message: '[COSMOS DB] You need to pass a config object to the construct'
    }
  }

  const self = this

  // Look for missing config
  const missing = REQUIRED_OPTS.map(key => {
    if (!Object.keys(opts).includes(key)) {
      return key
    }
  }).filter(key => key)

  if (missing.length > 0) {
    throw {
      message: '[COSMOS DB] One or more of the required config options is missing, please add these to the conf object',
      fields: missing.join(', ')
    }
  }

  // Check that collections array only contains objects
  opts.collections.map(collection => {
    if (typeof collection !== 'object') {
      throw {
        message: '[COSMOS DB] The collections option are only allowed to contain objects'
      }
    }
    if (!collection.name) {
      throw {
        message: '[COSMOS DB] One of the collection objects is missing a name'
      }
    }
  })

  Object.keys(opts).map(i => {
    self[i] = opts[i]
  })
  
  this.log = opts.logger ? opts.logger : log

  this.throughputStepsize = this.throughputStepsize ? this.throughputStepsize : 200
  this.batchSize = this.batchSize ? this.batchSize : 10000
  this.defaultThroughput = this.defaultThroughput ? this.defaultThroughput : 400
  this.maxThroughput = this.maxThroughput ? this.maxThroughput : 4000

  this.client = new DocumentClient(`https://${this.host.replace(/\:\d*/, '')}`, {
    masterKey: this.password
  })

  this.log.info('[COSMOS DB] Initializing db...')
  new Promise((resolve, reject) => {
    try {
      this.client.readDatabase(`dbs/${this.db}`, (err, db) => {
        if (err && err.code === 404) {
          self.client.createDatabase({ id: self.db }, (err, db) => {
            if (err) {
              reject(err)
            } else {
              this.log.info(`[COSMOS DB] Created database ${self.db}`)
              resolve()
            }
          })
        } else {
          this.log.info(`[COSMOS DB] Db ${self.db} does allready exist...`)
          resolve()
        }
      })
    } catch (e) {
      this.log.error('[COSMOS DB] Could not initialize database')
      reject(e)
    }
  }).then(async () => {
    this.log.info('[COSMOS DB] Initializing collections...')
    const url = `dbs/${this.db}`
    try {
      for (let collection of this.collections) {
        await new Promise((resolve, reject) => {
          self.client.readCollection(`dbs/${self.db}/colls/${collection.name}`, (err, result) => {
            if (err && err.code === 404) {
              const throughput = collection.throughput ? collection.throughput : self.defaultThroughput

              self.client.createCollection(`dbs/${self.db}`, { id: collection.name }, { offerThroughput: throughput }, (err, created) => {
                if (err) {
                  return reject(err)
                }

                this.log.info(`[COSMOS DB] Created collection ${collection.name} with throughput: ${throughput}`)
                resolve()
              })
            } else {
              this.log.info(`[COSMOS DB] Collection ${collection.name} does allready exist.`)
              resolve()
            }
          })
        })
      }
    } catch (e) {
      this.log.error('[COSMOS DB] Error in initializing Cosmos db collections', { err: e })
    }
  })
}

Azure.prototype.increaseCollectionThroughput = async function(name) {
  try {
    const offer = await this.getCollectionThroughput(name)

    if (this.maxThroughput && this.maxThroughput > offer.content.offerThroughput) {
      offer.content.offerThroughput = offer.content.offerThroughput + this.throughputStepsize

      await new Promise((resolve, reject) => {
        this.client.replaceOffer(`offers/${offer.d}`, offer, (err, res) => {
          if (err) {
            this.log.error(`[COSMOS DB] (${name}) Error while updating throughput...`)
            reject(err)
          } else if (res.content.offerThroughput !== offer.content.offerThroughput) {
            this.log.error(`[COSMOS DB] (${name}) Throughput could not be updated`)
          } else {
            this.log.debug(`[COSMOS DB] (${name}) Throughput updated to: `, offer.content.offerThroughput)
            resolve()
          }
        })
      })
    } else {
      this.log.info(`[COSMOS DB] (${name}) Max throughput is reached (${this.maxThroughput})...`)
    }

    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, 200)
    })
  } catch (e) {
    this.log.error('[COSMOS DB] Error in increaseCollectionThroughput', { err: e })
  }
}

Azure.prototype.updateCollectionThroughput = async function(name, throughput) {
  try {
    const offer = await this.getCollectionThroughput(name)

    if (this.maxThroughput && this.maxThroughput >= throughput) {
      offer.content.offerThroughput = throughput

      await new Promise((resolve, reject) => {
        this.client.replaceOffer(`offers/${offer.d}`, offer, (err, res) => {
          if (err) {
            this.log.error(`[COSMOS DB] (${name}) Error while updating throughput...`)
            reject(err)
          } else if (res.content.offerThroughput !== offer.content.offerThroughput) {
            this.log.error(`[COSMOS DB] (${name}) Throughput could not be updated`)
          } else {
            this.log.debug(`[COSMOS DB] (${name}) Throughput updated to: `, offer.content.offerThroughput)
            resolve()
          }
        })
      })
    } else {
      this.log.info(`[COSMOS DB] (${name}) the given throughput is higher than maxThroughput (${this.maxThroughput})...`)
    }
  } catch (e) {
    this.log.error('[COSMOS DB] Error in updateCollectionThroughout', { err: e })
  }
}

Azure.prototype.updateAllCollectionsThroughput = async function(throughput) {
  for (let collection of this.collections) {
    await this.updateCollectionThroughput(collection.name, throughput)
  }
  this.log.info(`[COSMOS DB] All collections throughput changed to ${throughput}`)
}

Azure.prototype.resetThroughput = async function () {
  for (let collection of this.collections) {
    const throughput = collection.throughput ? collection.throughput : this.defaultThroughput

    await this.updateCollectionThroughput(collection.name, throughput)

    this.log.info(`[COSMOS DB] Resetting throughput to ${throughput} for collection ${collection.name}`)
  }
}

Azure.prototype.listCollectionsWithThroughput = async function() {
  const colls = []

  try {
    for (let collection of this.collections) {
      await new Promise((resolve, reject) => {
        this.client.readCollection(`/dbs/${this.db}/colls/${collection.name}`, (err, result) => {
          if (err) {
            this.log.error('[COSMOS DB] Error while fetching collection...')
            reject(err)
          } else {
            resolve(result)
          }
        })
      })

      const offer = await this.getCollectionThroughput(collection.name)

      colls.push({
        collection: collection.name,
        throughput: offer.content.offerThroughput
      })
    }

    return colls
  } catch (e) {
    this.log.info('[COSMOS DB] Could not list collections with throughput')
  }
}

Azure.prototype.getCollectionThroughput = async function(name) {
  try {
    const url = `/dbs/${this.db}/colls/${name}`

    const collection = await new Promise((resolve, reject) => {
      this.client.readCollection(url, (err, result) => {
        if (err) {
          this.log.error('[COSMOS DB] Error while fetching collection...')
          reject(err)
        } else {
          resolve(result)
        }
      })
    })

    const queryObj = {
      query: 'SELECT * FROM root r WHERE r.resource=@link',
      parameters: [
        {
          name: '@link',
          value: collection._self
        }
      ]
    }

    const offer = await new Promise((resolve, reject) => {
      this.client.queryOffers(queryObj).toArray((err, offers) => {
        if (err) {
          this.log.error('[COSMOS DB] Error while fetching current throughput...')
          reject(err)
        } else if (offers.length === 0) {
          this.log.info('[COSMOS DB] No offer found for collection')
        } else {
          resolve(offers[0])
        }
      })
    })

    return offer
  } catch (e) {
    this.log.error('[COSMOS DB] Error in getCollectionThroughput', { err: e })
  }
}

module.exports.initClient = opts => {
  if (_development(process.env)) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    client = new Azure(opts)
    resolve(client)
  })
}

module.exports.getClient = () => {
  if (_development(process.env)) {
    log.debug(`[COSMOS DB] You are accessing the kth-node-cosmos-db client in development (Please add process.env.USE_COSMOS_DB='true' if you want to use any of its functions)`)
    return Promise.resolve({
      increaseCollectionThroughput: () => log.debug(`[COSMOS DB] increaseCollectionThroughput is not implemented in development`),
      updateCollectionThroughput: () => log.debug(`[COSMOS DB] updateCollectionThroughput is not implemented in development`),
      updateAllCollectionsThroughput: () => log.debug(`[COSMOS DB] updateAllCollectionsThroughput is not implemented in development`),
      listCollectionsWithThroughput: () => log.debug(`[COSMOS DB] listCollectionsWithThroughput is not implemented in development`),
      getCollectionThroughput: () => log.debug(`[COSMOS DB] getCollectionThroughput is not implemented in development`),
      resetThroughput: () => log.debug(`[COSMOS DB] resetThroughput is not implemented in development`)
    })
  }

  return Promise.resolve(client)
}