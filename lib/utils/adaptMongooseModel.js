/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

module.exports = adaptMongooseModel

const assert = require('assert')
const log = require('kth-node-log')

const useMongoNative = require('./useMongoNative')
const MongooseUtils = require('./mongoose')

const MEMORIZE_ORIGINAL_MONGOOSE_METHODS = true

const WRAP_TYPE = {
  NORMAL: 'normal',
  WITH_BATCHSIZE: 'batchsize',
  IN_INSTANCE_ONLY: 'instance'
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

  save: WRAP_TYPE.IN_INSTANCE_ONLY
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
  assert(input != null, 'adaptMongooseModel(): Missing input')
  assert(typeof input === 'object', 'adaptMongooseModel(): Invalid input')
  const { cosmosClientWrapper, mongooseModel } = input

  const dontChangeInput = useMongoNative() // || !['function', 'object'].includes(typeof mongooseModel)
  if (dontChangeInput) {
    return mongooseModel
  }

  // @TODO
  // _ensureValidCosmosClientWrapper(clientWrapper)
  // _ensureValidMongooseModel(mongooseModel)

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

  return mongooseModel
}

/**
 * @param {object} input
 * @param {string} input.methodName
 * @param {boolean} input.supportBatchsize
 */
function _getMongooseMethodWrapper({ client, methodName, supportBatchsize }) {
  async function wrapper(...methodArgs) {
    const model = this

    let mongooseError = new Error(
      `kth-node-cosmos-db: Internal error - Failed to call Mongoose method "${methodName}"`
    )
    let errorHandlerResult = {}

    const timeoutsPerAttempt = MongooseUtils.getRetryStrategy()

    for (let attempt = 0, timeout = 0; attempt < 50; attempt++) {
      const newTimeout = timeoutsPerAttempt[attempt]
      if (newTimeout == null || newTimeout === MongooseUtils.CONTINUE_WITH_LAST_TIMEOUT) {
        const runMethodWithPreviousTimeout =
          attempt === 0 ||
          (timeoutsPerAttempt.length > 0 &&
            timeoutsPerAttempt[timeoutsPerAttempt.length - 1] ===
              MongooseUtils.CONTINUE_WITH_LAST_TIMEOUT)
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
          timeout
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
          internalError
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
  timeout
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
