'use strict'

const DocumentClient = require('documentdb').DocumentClient

const REQUIRED_OPTS = ['host', 'db', 'collections', 'password', 'username', 'maxThroughput']

let client

/*
opts: {
  host: String
  db: String
  collections: [String]
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
      message: 'You need to pass a config object to the construct'
    }
  }

  const self = this

  REQUIRED_OPTS.map(key => {
    if (!Object.keys(opts).includes(key)) {
      throw {
        message: 'Azure: One of the required config options is missing, please add this to the conf object',
        data: key
      }
    }
  })

  Object.keys(opts).map(i => {
    self[i] = opts[i]
  })

  this.log = opts.logger ? opts.logger : require('kth-node-log')

  this.throughputStepsize = this.throughputStepsize ? this.throughputStepsize : 200
  this.batchSize = this.batchSize ? this.batchSize : 10000
  this.defaultThroughput = this.defaultThroughput ? this.defaultThroughput : 400
  this.maxThroughput = this.maxThroughput ? this.maxThroughput : 4000

  this.client = new DocumentClient(`https://${this.host.replace(/\:\d*/, '')}`, {
    masterKey: this.password
  })

  this.log.info('Initializing db...')
  new Promise((resolve, reject) => {
    try {
      this.client.readDatabase(`dbs/${this.db}`, (err, db) => {
        if (err && err.code === 404) {
          self.client.createDatabase({ id: self.db }, (err, db) => {
            if (err) {
              reject(err)
            } else {
              this.log.info(`Created database ${self.db}`)
              resolve()
            }
          })
        } else {
          this.log.info(`Db ${self.db} does allready exist...`)
          resolve()
        }
      })
    } catch (e) {
      this.log.error('Could not initialize database')
      reject(e)
    }
  }).then(async () => {
    this.log.info('Initializing collections...')
    const url = `dbs/${this.db}`
    try {
      for (let i = 0; i < this.collections.length; i++) {
        await new Promise ((resolve, reject) => {
          self.client.readCollection(`dbs/${self.db}/colls/${self.collections[i]}`, (err, result) => {
            if (err && err.code === 404) {
              self.client.createCollection(`dbs/${self.db}`, { id: self.collections[i] }, { offerThroughput: self.defaultThroughput }, (err, created) => {
                if (err) {
                  reject(err)
                } else {
                  this.log.info(`Created collection ${self.collections[i]} with throughput: ${self.defaultThroughput}`)
                  resolve()
                }
              })
            } else {
              this.log.info(`Collection ${self.collections[i]} does allready exist.`)
              resolve()
            }
          })
        })
      }
    } catch (e) {
      this.log.error('Error in initializing Cosmos db collections', { err: e })
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
            this.log.error(`(${name}) Error while updating throughput...`)
            reject(err)
          } else if (res.content.offerThroughput !== offer.content.offerThroughput) {
            this.log.error(`(${name}) Throughput could not be updated`)
          } else {
            this.log.debug(`(${name}) Throughput updated to: `, offer.content.offerThroughput)
            resolve()
          }
        })
      })
    } else {
      this.log.info(`(${name}) Max throughput is reached (${this.maxThroughput})...`)
    }

    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, 200)
    })
  } catch (e) {
    this.log.error('Error in increaseCollectionThroughput', { err: e })
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
            this.log.error(`(${name}) Error while updating throughput...`)
            reject(err)
          } else if (res.content.offerThroughput !== offer.content.offerThroughput) {
            this.log.error(`(${name}) Throughput could not be updated`)
          } else {
            this.log.debug(`(${name}) Throughput updated to: `, offer.content.offerThroughput)
            resolve()
          }
        })
      })
    } else {
      this.log.info(`(${name}) the given throughput is higher than maxThroughput (${this.maxThroughput})...`)
    }
  } catch (e) {
    this.log.error('Error in updateCollectionThroughout', { err: e })
  }
}

Azure.prototype.updateAllCollectionsThroughput = async function(throughput) {
  for (let i = 0; i < this.collections.length; i++) {
    await this.updateCollectionThroughput(this.collections[i], throughput)
  }
  this.log.info(`All collections throughput changed to ${throughput}`)
}

Azure.prototype.listCollectionsWithThroughput = async function() {
  const colls = []
  try {
    for (let i = 0; i < this.collections.length; i++) {
      const collection = await new Promise((resolve, reject) => {
        this.client.readCollection(`/dbs/${this.db}/colls/${this.collections[i]}`, (err, result) => {
          if (err) {
            this.log.error('Error while fetching collection...')
            reject(err)
          } else {
            resolve(result)
          }
        })
      })

      const offer = await this.getCollectionThroughput(this.collections[i])

      colls.push({
        collection: collection.id,
        throughput: offer.content.offerThroughput
      })
    }
    return colls
  } catch (e) {
    this.log.info('Could not list collections with throughput')
  }
}

Azure.prototype.getCollectionThroughput = async function(name) {
  try {
    const url = `/dbs/${this.db}/colls/${name}`

    const collection = await new Promise((resolve, reject) => {
      this.client.readCollection(url, (err, result) => {
        if (err) {
          this.log.error('Error while fetching collection...')
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
          this.log.error('Error while fetching current throughput...')
          reject(err)
        } else if (offers.length === 0) {
          this.log.info('No offer found for collection')
        } else {
          resolve(offers[0])
        }
      })
    })

    return offer
  } catch (e) {
    this.log.error('Error in getCollectionThroughput', { err: e })
  }
}

module.exports.initClient = opts => {
  return new Promise((resolve, reject) => {
    client = new Azure(opts)
    resolve(client)
  })
}

module.exports.getClient = () => {
  return Promise.resolve(client)
}
