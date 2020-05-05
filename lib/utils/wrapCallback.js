/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

module.exports = {
  wrapCallbackWithRetryOnError,
}

const log = require('kth-node-log')

const ValidityUtils = require('./validity')
const StrategyUtils = require('./strategy')

/**
 * This function returns a wrapper which can later be used several time
 * to invoke a given action-callback and resolve with its result.
 *
 * - If the action-callback resolves, the wrapper resolves with the same value.
 * - If the action-callback fails, the given error-handler will be used to determine if
 *   - "stop": The wrapper will return null or the result of stopAction() if given; or
 *   - "retry": The action-callback will be invoked again after a small timeout; or
 *   - null: The wrapper rejects with the error from the action-callback.
 *
 * The given client will be used to determine the retry-strategy.
 *
 * @param {object} input
 * @param {object} input.client
 * @param {Function} input.errorHandler
 *    Asynchronous error-handler;
 *    Gets the error if action-callback rejects and shall return "stop", "retry" or null.
 * @param {Function} [input.stopAction]
 *    Callback which will be invoked if error-handler signals "stop"
 *
 * @returns {function}
 *    Asynchroneous wrapper function that delivers the result of action-callback
 *    which might be run several times in case of problems
 */
function wrapCallbackWithRetryOnError({ client, errorHandler, stopAction }) {
  const prefix = 'wrapCallbackWithRetryOnError'
  ValidityUtils.ensureValidClass({
    input: client,
    prefix,
    text: 'client',
    className: 'CosmosClientWrapper',
  })
  ValidityUtils.ensureValidPrimitive({
    input: errorHandler,
    prefix,
    text: 'error-handler',
    check: input => typeof input === 'function',
  })

  async function _runCallbackAndRetryOnHandledError(asyncAction) {
    ValidityUtils.ensureValidPrimitive({
      input: asyncAction,
      prefix,
      text: 'action-callback',
      check: input => typeof input === 'function',
    })

    const strategyName = client.getOption('retryStrategy')
    const config = StrategyUtils.getRetryStrategy(strategyName)
    const { timeoutPerAttempt, maxAttempts, lastTimeout } = config

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const timeout = attempt < timeoutPerAttempt.length ? timeoutPerAttempt[attempt] : lastTimeout
      await _wait(timeout)

      let callbackError = null
      try {
        const callbackResult = await asyncAction()
        return callbackResult
      } catch (error) {
        callbackError = error
      }

      let errorHandlerResult = null
      try {
        errorHandlerResult = await errorHandler(callbackError)
      } catch (handlerError) {
        log.error(
          'kth-node-cosmos-db - _runCallbackAndRetryOnHandledError(): Error-handler rejected',
          { callbackError, handlerError }
        )
        throw handlerError
      }

      if (errorHandlerResult === 'stop') {
        break
      }
      if (errorHandlerResult !== 'retry') {
        throw callbackError
      }
    }

    return typeof stopAction === 'function' ? stopAction() : null
  }

  return _runCallbackAndRetryOnHandledError
}

function _wait(timeoutMS) {
  return new Promise(resolve => {
    setTimeout(resolve, timeoutMS)
  })
}
