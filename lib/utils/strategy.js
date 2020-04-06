/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

const CONTINUE_WITH_LAST_TIMEOUT = -1

module.exports = {
  getRetryStrategy,
  listRetryStrategyNames,
  CONTINUE_WITH_LAST_TIMEOUT
}

const log = require('kth-node-log')

const DEFAULT_STRATEGY = 'good'

const KNOWN_RETRY_STRATEGIES = {
  fastest: {
    timeoutPerAttempt: [0, 50, CONTINUE_WITH_LAST_TIMEOUT],
    maxAttempts: 100
  },
  fast: {
    timeoutPerAttempt: [0, 100, 200, CONTINUE_WITH_LAST_TIMEOUT],
    maxAttempts: 50
  },
  good: {
    timeoutPerAttempt: [0, 100, 200, 300, CONTINUE_WITH_LAST_TIMEOUT],
    maxAttempts: 30
  },
  cheapest: {
    timeoutPerAttempt: [0, 100, 200, 1000, CONTINUE_WITH_LAST_TIMEOUT],
    maxAttempts: 10
  },
  fourAttemptsOnly: {
    timeoutPerAttempt: [0, 100, 200, 800]
  }
}

const Global = {
  strategy: null
}

/**
 * A retry strategy contains a list of breaks in milliseconds
 * which shall be used when trying to handle errors
 * during wrapped Mongoose operations.
 *
 * @param {string} [name]
 *    Name of retry strategy, e.g. "fast";
 *    omit to get default strategy
 *
 * @returns {object[]}
 *    Configuration of retry strategy, e.g.
 *      { name: 'fast',
 *        timeoutPerAttempt: [0, 100, 200, CONTINUE_WITH_LAST_TIMEOUT],
 *        maxAttempts: 50 }
 */
function getRetryStrategy(name) {
  const _name = typeof name === 'string' && name !== '' ? name : DEFAULT_STRATEGY

  if (Global.strategy == null) {
    Global.strategy = _determineStrategy(_name)
    log.info(
      `kth-node-cosmos-db: Mongoose operations will use retry strategy "${_name}" in case of throughput problems.`
    )
  } else if (Global.strategy.name !== _name) {
    Global.strategy = _determineStrategy(_name)
    log.info(`kth-node-cosmos-db: Switched retry strategy to "${_name}".`)
  }

  return Global.strategy
}

/**
 * @returns {string[]}
 *    Names of all available retry strategies
 */
function listRetryStrategyNames() {
  return Object.keys(KNOWN_RETRY_STRATEGIES)
}

function _determineStrategy(name) {
  if (KNOWN_RETRY_STRATEGIES[name] == null) {
    throw new Error(`kth-node-cosmos-db: Unknown retry strategy given ("${name}")`)
  }

  const strategy = KNOWN_RETRY_STRATEGIES[name]
  strategy.name = name
  return strategy
}
