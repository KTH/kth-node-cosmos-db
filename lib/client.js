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
  clientInstances: [],
  dummyClient: null
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

  const newClient = new CosmosClientWrapper(options)
  Global.clientInstances.unshift(newClient)

  return newClient
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

  const latestClient = Global.clientInstances[0]

  return latestClient
}

/**
 * In local development we use MongoDB, which does not support setting/changing Azure Cosmos specific throughput.
 * The following object is returned when envirnoment NODE_ENV=development is set, instead of a CosmosClientWrapper.
 */
function getClientWithInactiveMethods() {
  if (Global.dummyClient == null) {
    const notAvailable = `Not available in native MongoDB.`

    Global.dummyClient = {}

    const publicMethods = CosmosClientWrapper.getListOfPublicMethods()
    publicMethods.forEach(name => {
      Global.dummyClient[name] = () => log.info(notAvailable)
    })
  }

  return Global.dummyClient
}
