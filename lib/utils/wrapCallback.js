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
 * - If the action-callback succeeds, the wrapper will resolve with the callback's return value.
 * - If the action-callback fails, the given error-handler will be used to determine if
 *   - "stop": The wrapper will return null or the result of stopAction() if given; or
 *   - "retry": The action-callback will be invoked again after a small timeout; or
 *   - null: The wrapper rejects with the error from the action-callback.
 *
 * The given client will be used to determine the correct retry-strategy.
 *
 * @param {object} input
 * @param {object} input.client
 * @param {Function} input.errorHandler
 *    Asynchronous error-handler;
 *    Gets the error if action-callback rejects and shall return "stop", "retry" or null.
 * @param {boolean} [input.runActionAsync]
 *    Set to true iff the action-callback returns a Promise
 *    and the wrapper should wait for it to resolve or reject
 * @param {Function} [input.transformResult]
 *    Callback which will be invoked with the result of the action-callback
 *    and might change the result before the wrapper returns it, e.g.
 *        query => { query.batchsize(5000); return query; }
 * @param {Function} [input.stopAction]
 *    Callback which will be invoked if error-handler signals "stop"
 *
 * @returns {function}
 *    Asynchroneous wrapper function that delivers the result of action-callback
 *    which might be run several times in case of problems
 */
function wrapCallbackWithRetryOnError(input) {
  const prefix = 'wrapCallbackWithRetryOnError()'

  ValidityUtils.ensureValidObject({ input, prefix, text: 'arguments' })
  const { client, errorHandler, runActionAsync, transformResult, stopAction } = input

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
    check: item => typeof item === 'function',
  })

  async function _runCallbackAndRetryOnHandledError(actionCallback, ...actionArgs) {
    ValidityUtils.ensureValidPrimitive({
      input: actionCallback,
      prefix,
      text: 'action-callback',
      check: item => typeof item === 'function',
    })

    const strategyName = client.getOption('retryStrategy')
    const config = StrategyUtils.getRetryStrategy(strategyName)
    const { timeoutPerAttempt, maxAttempts, lastTimeout } = config

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const timeout = attempt < timeoutPerAttempt.length ? timeoutPerAttempt[attempt] : lastTimeout
      await _wait(timeout)

      let callbackError = null
      try {
        let callbackResult =
          runActionAsync === true
            ? await actionCallback(...actionArgs)
            : actionCallback(...actionArgs)

        if (typeof transformResult === 'function') {
          callbackResult = transformResult(callbackResult)
        }

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
