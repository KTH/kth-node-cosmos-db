/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

module.exports = { createClient, getClient }

const log = require('kth-node-log')

const CosmosClientWrapper = require('./utils/CosmosClientWrapper')
const useMongoNative = require('./utils/useMongoNative')

const Global = {
  clientInstances: [],
  dummyClient: null,
}

/**
 * @param {object} options
 * @param {string} options.host
 * @param {string} options.username
 * @param {string} options.password
 * @param {string} options.db
 * @param {object[]} options.collections
 * @param {number|string} options.maxThroughput
 * @param {number|string} [options.defaultThroughput]
 * @param {number|string} [options.throughputStepsize]
 * @param {number} [options.batchSize]
 * @param {number|string} [options.port]
 * @param {boolean} [options.disableSslRejection]
 * @param {boolean} [options.createCollectionsWithMongoose]
 * @param {string} [options.retryStrategy]
 *
 * @returns {CosmosClientWrapper}
 *    * new client instance; or
 *    * (in mode "Mongo native") dummy client which only logs function accesses
 */
function createClient(options) {
  if (useMongoNative()) {
    log.info(`kth-node-cosmos-db: Your are in development mode. There will be no client returned`)
    return getClientWithInactiveMethods()
  }

  const newClient = new CosmosClientWrapper(options)
  Global.clientInstances.unshift(newClient)

  return newClient
}

/**
 * @returns {CosmosClientWrapper}
 *    * client instance which was prepared with createClient() before; or
 *    * undefined if you forgot to call createClient() first; or
 *    * (in mode "Mongo native") dummy client which only logs function accesses
 */
function getClient() {
  if (useMongoNative()) {
    log.warn(
      'kth-node-cosmos-db: You are accessing the client in development (Please add USE_COSMOS_DB="true" if you want to use any of its functions)'
    )
    return getClientWithInactiveMethods()
  }

  const latestClient = Global.clientInstances[0]

  return latestClient
}

/**
 * In local development we use MongoDB, which does not support setting/changing Azure Cosmos specific throughput.
 * The following object is returned when envirnoment NODE_ENV=development is set, instead of a CosmosClientWrapper.
 *
 * @private
 */
function getClientWithInactiveMethods() {
  if (Global.dummyClient == null) {
    const notAvailable = `Not available in native MongoDB.`

    Global.dummyClient = {}

    const publicMethods = CosmosClientWrapper.getListOfPublicMethods()
    publicMethods.forEach(name => {
      if (name === 'createMongooseModel') {
        Global.dummyClient.createMongooseModel = (methodName, mongooseSchema, mongoose) => {
          return mongoose.model(methodName, mongooseSchema)
        }
      } else {
        Global.dummyClient[name] = () => log.info(notAvailable)
      }
    })
  }

  return Global.dummyClient
}
