/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

const log = require('kth-node-log')

const Utils = require('./utils')

const CosmosClientWrapper = require('./CosmosClientWrapper')

module.exports = {
  createClient,
  getClient
}

const Global = {
  clientInstances: []
}

/**
 * @param {object} options
 *
 * @returns {CosmosClientWrapper|object}
 */
function createClient(options) {
  if (Utils.useMongoNative()) {
    log.info(`kth-node-cosmos-db: Your are in development mode. There will be no client returned`)
    return getClientWithInactiveMethods()
  }

  Global.clientInstances.unshift(new CosmosClientWrapper(options))

  return Global.clientInstances[0]
}

/**
 * @returns {CosmosClientWrapper|object}
 */
function getClient() {
  if (Utils.useMongoNative()) {
    log.warn(
      "kth-node-cosmos-db: You are accessing the kth-node-cosmos-db: client in development (Please add process.env.USE_COSMOS_DB='true' if you want to use any of its functions)"
    )
    return getClientWithInactiveMethods()
  }

  return Global.clientInstances[0]
}

/**
 * In local development we use MongoDB, which does not support setting/changing Azure Cosmos specific throughput.
 * The following object is returned when envirnoment NODE_ENV=development is set, instead of a cosmosClientWrapper.
 */
function getClientWithInactiveMethods() {
  const notAvailable = `Not available in native MongoDB.`

  return {
    increaseCollectionThroughput: () => log.info(notAvailable),
    updateCollectionThroughput: () => log.info(notAvailable),
    updateAllCollectionsThroughput: () => log.info(notAvailable),
    listCollectionsWithThroughput: () => log.info(notAvailable),
    getCollectionThroughput: () => log.info(notAvailable),
    resetThroughput: () => log.info(notAvailable),
    init: () => log.info(notAvailable)
  }
}
