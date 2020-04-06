/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

module.exports = createModel

const assert = require('assert')

const mongoose = require('mongoose')
const log = require('kth-node-log')

// eslint-disable-next-line import/newline-after-import
const {
  //  mongooseMiddleware: MongooseUtils,
  useMongoNative
} = require('./utils')

// eslint-disable-next-line no-unused-vars
const CosmosClientWrapper = require('./utils/CosmosClientWrapper')
const { getClient } = require('./client')

/**
 * This function internally calls Mongoose.prototype.model() and
 * has the same signature, only that it doesn't expect a class as first parameter.
 *
 * Before the model is created, the schema is adapted.
 * Some middleware hooks are added to the schema which handle errors
 * in connection with the throughput management of CosmosDB.
 *
 * @param {string} name
 * @param {mongoose.Schema} schema
 * @param {string} collection
 * @param {boolean} skipInit
 *
 * @returns {mongoose.Model}
 *    new or existing Mongoose model associated with "name"
 */
function createModel(name, schema, collection = null, skipInit = false) {
  try {
    _ensureValidModelName(name)
    _ensureValidSchema(schema)
    if (collection != null) {
      _ensureValidCollectionName(collection)
    }
    assert(typeof skipInit === 'boolean', 'createModel(): Invalid argument "skipInit"')

    const doAdaptMiddleware = useMongoNative() === false
    if (doAdaptMiddleware) {
      const cosmosClient = getClient()
      const collectionName = collection || name

      if (cosmosClient == null) {
        throw new Error('Missing CosmosDB client - ensure that you call createClient(), first')
      }
      _adaptMongooseSchemaForThroughputHandling({ schema, cosmosClient, collectionName })
    }

    const NewModel = mongoose.model(name, schema, collection, skipInit)
    return NewModel
  } catch (error) {
    throw new Error(`kth-node-cosmos-db - createModel(): ${error.message}`)
  }
}

function _adaptMongooseSchemaForThroughputHandling({ schema, cosmosClient, collectionName }) {
  const accessibleFunctionsWithTypes = _listSupportedMongooseFunctions()
  const functionNames = Object.keys(accessibleFunctionsWithTypes)

  functionNames.forEach(methodName => {
    const type = accessibleFunctionsWithTypes[methodName]

    let middlewareOptions = {}
    switch (type) {
      case 'document,query':
        middlewareOptions = { document: true, query: true }
      // eslint-disable-next-line no-fallthrough
      case 'document':
      case 'query':
      case 'aggregate':
      case 'model':
        _addThroughputErrorHandler({
          schema,
          methodName,
          cosmosClient,
          middlewareOptions,
          collectionName
        })
        break
      default:
        throw new Error(`Unknown middleware type (${type})`)
    }
  })
}

/**
 * @param {object} options
 * @param {object} options.cosmosClient
 * @param {object} options.schema
 * @param {string} options.methodName
 * @param {object} options.middlewareOptions
 * @param {string} options.collectionName
 */
function _addThroughputErrorHandler({
  schema,
  methodName,
  middlewareOptions = {},
  cosmosClient,
  collectionName
}) {
  const errorHandler = async function handleThroughputError(error, _, next) {
    const isThroughputError = error.name === 'MongoError' && error.code === 16500
    if (!isThroughputError) {
      next(error)
      return
    }

    log.info(
      `CosmosDB throughput limit reached during mongoose operation "${methodName}" - increasing throughput and retrying...`
    )

    try {
      await cosmosClient.increaseCollectionThroughput()
    } catch (errorFromThroughputUpdate) {}
  }

  schema.post(methodName, middlewareOptions, errorHandler)
}

/**
 * @returns {object}
 */
function _listSupportedMongooseFunctions() {
  const accessibleFunctionsWithTypes = {}

  const documentFunctions = ['save']
  const queryFunctions = [
    'count',
    'deleteMany',
    'deleteOne',
    'find',
    'findOne',
    'findOneAndDelete',
    'findOneAndRemove',
    'findOneAndUpdate',
    'remove',
    'update',
    'updateOne',
    'updateMany'
  ]
  const documentAndQueryFunctions = ['remove', 'updateOne', 'deleteOne']
  const aggregateFunctions = ['aggregate']
  const modelFunctions = ['insertMany']

  documentFunctions.forEach(key => {
    accessibleFunctionsWithTypes[key] = 'document'
  })
  queryFunctions.forEach(key => {
    accessibleFunctionsWithTypes[key] = 'query'
  })
  documentAndQueryFunctions.forEach(key => {
    accessibleFunctionsWithTypes[key] = 'document,query'
  })
  aggregateFunctions.forEach(key => {
    accessibleFunctionsWithTypes[key] = 'aggregate'
  })
  modelFunctions.forEach(key => {
    accessibleFunctionsWithTypes[key] = 'model'
  })

  return accessibleFunctionsWithTypes
}

/**
 * @param {string} input
 * @throws in case of invalid input
 */
function _ensureValidModelName(input) {
  assert(input != null, 'Missing Mongoose method name')
  assert(
    typeof input === 'string' && /^\w+$/.test(input),
    `Invalid Mongoose method name "${input}"`
  )
}

/**
 * @param {object} input
 * @throws in case of invalid input
 */
function _ensureValidSchema(input) {
  assert(input != null, 'Missing Mongoose schema')
  assert(typeof input === 'object', `Invalid Mongoose schema (type ${typeof input})`)
  assert(input.constructor.name === 'Schema', 'Invalid Mongoose schema (')
}

/**
 * @param {string} input
 * @throws in case of invalid input
 */
function _ensureValidCollectionName(input) {
  assert(input != null, 'Missing Mongoose collection name')
  assert(
    typeof input === 'string' && /^\w+$/.test(input),
    `Invalid Mongoose collection name "${input}"`
  )
}
