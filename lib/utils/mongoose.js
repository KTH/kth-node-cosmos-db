/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

const CONTINUE_WITH_LAST_TIMEOUT = -1

module.exports = {
  getRetryStrategy,
  listRetryStrategies,
  CONTINUE_WITH_LAST_TIMEOUT
}

const Global = {
  strategy: null,
  knownStrategies: {
    fastest: [0, 50, CONTINUE_WITH_LAST_TIMEOUT],
    fast: [0, 100, 200, CONTINUE_WITH_LAST_TIMEOUT],
    good: [0, 100, 200, 300, CONTINUE_WITH_LAST_TIMEOUT],
    cheapest: [0, 100, 200, 1000, CONTINUE_WITH_LAST_TIMEOUT]
  }
}

/**
 * @returns {number[]}
 *    List of breaks in milliseconds which shall be used
 *    when trying to handle errors during wrapped Mongoose operations
 */
function getRetryStrategy() {
  if (Global.strategy == null) {
    Global.strategy = _determineStrategy()
  }
  return Global.strategy
}

function listRetryStrategies() {
  return Object.keys(Global.knownStrategies)
}

function _determineStrategy() {
  const env = process.env.NODE_COSMOS_RETRY_STRATEGY || ''
  const mode = typeof env === 'string' && env !== '' ? env : 'good'

  if (Global.knownStrategies[mode] == null) {
    throw new Error(`kth-node-cosmos-db: Invalid value of NODE_COSMOS_RETRY_STRATEGY ("${mode}")`)
  }

  return Global.knownStrategies[mode]
}
