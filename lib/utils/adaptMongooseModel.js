/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

module.exports = adaptMongooseModel

const log = require('kth-node-log')

const useMongoNative = require('./useMongoNative')
const StrategyUtils = require('./strategy')
const ValidityUtils = require('./validity')

const MEMORIZE_ORIGINAL_MONGOOSE_METHODS = true

const WRAP_TYPE = {
  NORMAL: 'normal',
  WITH_BATCHSIZE: 'batchsize',
  IN_INSTANCE_ONLY: 'instance',
}

const METHODS_THAT_WILL_BE_WRAPPED = {
  findOneAndUpdate: WRAP_TYPE.NORMAL,
  findById: WRAP_TYPE.NORMAL,
  update: WRAP_TYPE.NORMAL,
  updateOne: WRAP_TYPE.NORMAL,
  updateMany: WRAP_TYPE.NORMAL,
  findOne: WRAP_TYPE.NORMAL,
  remove: WRAP_TYPE.NORMAL,

  find: WRAP_TYPE.WITH_BATCHSIZE,

  // save: WRAP_TYPE.IN_INSTANCE_ONLY,
  save: WRAP_TYPE.NORMAL,
}

/**
 * Please note: The given model is not copied but changed in place.
 *
 * @param {object} input
 * @param {object} input.cosmosClientWrapper
 * @param {object} input.mongooseModel
 *
 * @returns {object}
 *    Same mongoose model from input
 *    where some of the methods may be wrapped so that errors like "Request rate is large"
 *    are handled properly during later usage of the model
 */
function adaptMongooseModel(input) {
  const prefix = 'adaptMongooseModel()'

  ValidityUtils.ensureValidObject({ input, prefix, text: 'input' })
  const { cosmosClientWrapper, mongooseModel } = input

  const dontChangeInput = useMongoNative()
  if (dontChangeInput) {
    return mongooseModel
  }

  ValidityUtils.ensureValidClass({
    input: cosmosClientWrapper,
    prefix,
    text: 'client',
    className: 'CosmosClientWrapper',
  })
  ValidityUtils.ensureValidClass({
    input: mongooseModel,
    prefix,
    text: 'Mongoose model',
    check: _input =>
      _input.schema != null &&
      typeof _input.schema === 'object' &&
      _input.schema.constructor.name === 'Schema',
  })

  // _addAzureFunctions({ model: mongooseModel, client: cosmosClientWrapper })

  const methodNames = Object.keys(METHODS_THAT_WILL_BE_WRAPPED)

  if (MEMORIZE_ORIGINAL_MONGOOSE_METHODS) {
    const methodsBeforeWrapping = {}

    methodNames.forEach(name => {
      const type = METHODS_THAT_WILL_BE_WRAPPED[name]
      const prototype =
        type === WRAP_TYPE.IN_INSTANCE_ONLY ? undefined : Object.getPrototypeOf(mongooseModel)[name]

      methodsBeforeWrapping[name] = prototype
    })

    mongooseModel._getMethodsBeforeWrapping = () => methodsBeforeWrapping
  }

  methodNames.forEach(name => {
    const type = METHODS_THAT_WILL_BE_WRAPPED[name]
    const supportBatchsize = type === WRAP_TYPE.WITH_BATCHSIZE
    const wrapperData = { client: cosmosClientWrapper, methodName: name, supportBatchsize }
    mongooseModel[name] = _getMongooseMethodWrapper(wrapperData)
  })

  // mongooseModel.events.on('error', catchModelError)

  return mongooseModel
}

// function catchModelError(error) {
//   if (
//     error.message === 'disabled error by lexa' ||
//     error.message.includes('Azure limited this save action')
//   ) {
//     throw new Error("I'm trying to ignore an error")
//   }
//   throw error
// }

/**
 * @param {object} input
 * @param {object} input.client
 * @param {string} input.methodName
 * @param {boolean} input.supportBatchsize
 *
 * @returns {Function}
 */
function _getMongooseMethodWrapper({ client, methodName, supportBatchsize }) {
  async function wrapper(...methodArgs) {
    const model = this

    let mongooseError = new Error(
      `kth-node-cosmos-db: Internal error - Failed to call Mongoose method "${methodName}"`
    )
    let errorHandlerResult = {}

    const { timeoutPerAttempt, maxAttempts } = _getRetryStrategyConfiguration(client)

    for (let attempt = 0, timeout = 0; attempt < maxAttempts; attempt++) {
      const newTimeout = timeoutPerAttempt[attempt]
      if (newTimeout == null || newTimeout === StrategyUtils.CONTINUE_WITH_LAST_TIMEOUT) {
        const runMethodWithPreviousTimeout =
          attempt === 0 ||
          (timeoutPerAttempt.length > 0 &&
            timeoutPerAttempt[timeoutPerAttempt.length - 1] ===
              StrategyUtils.CONTINUE_WITH_LAST_TIMEOUT)
        if (!runMethodWithPreviousTimeout) {
          break
        }
      } else {
        timeout = newTimeout
      }

      mongooseError = null
      try {
        const methodData = {
          model,
          methodName,
          methodArgs,
          supportBatchsize,
          client,
          timeout,
        }
        const result = await _callMongooseMethodAsync(methodData)
        return result
      } catch (error) {
        mongooseError = error
      }

      errorHandlerResult = {}
      try {
        const errorHandlerData = { model, error: mongooseError, client }
        errorHandlerResult = await _tryToHandleThroughputError(errorHandlerData)
      } catch (internalError) {
        log.error('kth-node-cosmos-db: Increasing throughput during Mongoose operation failed', {
          mongooseError,
          internalError,
        })
        throw internalError
      }

      if (!errorHandlerResult.isThroughputError) {
        throw mongooseError
      }
      if (errorHandlerResult.throughputMaximal) {
        break
      }
    }

    throw new Error(
      `kth-node-cosmos-db: Failed during Mongoose method "${methodName}" - Maybe there is generally too little throughput available`
    )
  }

  return wrapper
}

/**
 * @param {object} data
 * @param {object} data.model
 * @param {string} data.methodName
 * @param {Array} data.methodArgs
 * @param {object} data.client
 * @param {boolean} data.supportBatchsize
 * @param {number} data.timeout
 */
async function _callMongooseMethodAsync({
  model,
  methodName,
  methodArgs,
  supportBatchsize,
  client,
  timeout,
}) {
  const methodPrototype = Object.getPrototypeOf(model)[methodName]

  const asyncQuery = methodPrototype.apply(model, methodArgs)
  if (supportBatchsize && client != null && client.batchSize) {
    asyncQuery.batchSize(client.batchSize)
  }

  let result

  if (timeout > 0) {
    result = await new Promise((resolve, reject) => {
      setTimeout(() => asyncQuery.then(resolve).catch(reject), timeout)
    })
  } else {
    result = await asyncQuery
  }

  return result
}

/**
 * @param {object} data
 * @param {object} data.model
 * @param {object} data.error
 * @param {object} data.client
 *
 * @returns {Promise<object>}
 *    Resolves with information object
 *    - output.isThroughputError: true iff the given error is throughput-related
 *    - output.throughputIncreased: true iff the throughput was successfully increased
 *    - output.throughputMaximal: true iff the throughput is already at the maximum
 * @throws
 *    in case of internal problems
 */
async function _tryToHandleThroughputError({ model, error, client }) {
  const { name: collectionName } = model.collection

  const result = { isThroughputError: false, throughputIncreased: false, throughputMaximal: false }

  result.isThroughputError =
    error.code === 16500 || error.toString().includes('Request rate is large')

  if (result.isThroughputError) {
    const difference = await client.increaseCollectionThroughput(collectionName)
    if (difference == null) {
      result.throughputMaximal = true
    } else {
      result.throughputIncreased = difference > 0
    }
  }

  return result
}

function _addAzureFunctions({ model, client }) {
  const wrapCallback = _getThroughputSafeCallbackWrapper({ model, client })

  model._azureBackup = {}
  model.azureWrapCallback = wrapCallback

  const simpleWrappings = [
    'findOne',
    'findOneAndUpdate',
    'findById',
    'update',
    'updateOne',
    'updateMany',
    'remove',
  ]

  simpleWrappings.forEach(funcName => {
    model._azureBackup[funcName] = model[funcName].bind(model)
    const azureFuncName = `azure${_firstLetterUpperCase(funcName)}`
    model[azureFuncName] = (...args) => wrapCallback(() => model._azureBackup[funcName](...args))
  })

  model.azureFind = (...args) =>
    wrapCallback(async () => {
      const asyncQuery = model.find(...args)
      if (client != null && client.batchSize) {
        asyncQuery.batchSize(client.batchSize)
      }
      const result = await asyncQuery
      return result
    })

  model.azureSaveDocument = (document, ...args) => wrapCallback(() => document.save(...args))
  // model.azureSaveDocument = document => {
  //   ValidityUtils.ensureValidClass({
  //     input: document,
  //     text: 'Mongoose document',
  //     className: 'Document',
  //   })
  //   if (document.schema !== model.schema) {
  //     throw new Error(
  //       'kth-node-cosmos-db: azureSaveDocument() failed - Schema mismatch between document and model'
  //     )
  //   }
  //   return wrapCallback(() => document.save())
  // }
}

function _getThroughputSafeCallbackWrapper({ model, client }) {
  return async function _runCallbackAndHandleThroughputErrors(callback) {
    const config = _getRetryStrategyConfiguration(client)
    const { timeoutPerAttempt, maxAttempts, repeatLastTimeout, lastTimeout } = config

    for (
      let attempt = 0;
      attempt < maxAttempts && (timeoutPerAttempt[attempt] != null || repeatLastTimeout);
      attempt++
    ) {
      const timeout = timeoutPerAttempt[attempt] || lastTimeout
      await _wait(timeout)

      let callbackError = null
      try {
        const callbackResult = await callback()
        return callbackResult
      } catch (error) {
        callbackError = error
      }

      let errorHandlerResult = {}
      try {
        errorHandlerResult = await _tryToHandleThroughputError({
          model,
          client,
          error: callbackError,
        })
      } catch (internalError) {
        log.error(
          'kth-node-cosmos-db - _runCallbackAndHandleThroughputErrors(): Increasing throughput during Mongoose operation failed',
          {
            callbackError,
            internalError,
          }
        )
        throw internalError
      }

      if (!errorHandlerResult.isThroughputError) {
        throw callbackError
      }
      if (errorHandlerResult.throughputMaximal) {
        break
      }
    }

    throw new Error(
      'kth-node-cosmos-db ' +
        '- _runCallbackAndHandleThroughputErrors(): Failed during Mongoose operation ' +
        '- Maybe there is generally too little throughput available'
    )
  }
}

function _getRetryStrategyConfiguration(client) {
  let repeatLastTimeout = false
  let lastTimeout = null

  const name = client.getOption('retryStrategy')
  // @ts-ignore
  const { maxAttempts, timeoutPerAttempt } = StrategyUtils.getRetryStrategy(name)

  const _maxAttempts = maxAttempts > 0 ? maxAttempts : 20

  const _timeoutPerAttempt = timeoutPerAttempt
    .map(timeout => {
      if (timeout === StrategyUtils.CONTINUE_WITH_LAST_TIMEOUT) {
        if (lastTimeout != null) {
          repeatLastTimeout = true
        }
        return null
      }
      if (timeout >= 0) {
        lastTimeout = timeout
        return timeout
      }
      return null
    })
    .filter(timeout => timeout != null)

  return {
    name,
    maxAttempts: _maxAttempts,
    timeoutPerAttempt: _timeoutPerAttempt,
    repeatLastTimeout,
    lastTimeout,
  }
}

function _firstLetterUpperCase(input) {
  return input.replace(/^(\w)(.*)$/, (...match) => match[1].toUpperCase() + match[2])
}

async function _wait(timeoutMS) {
  await new Promise(resolve => {
    setTimeout(resolve, timeoutMS)
  })
}
