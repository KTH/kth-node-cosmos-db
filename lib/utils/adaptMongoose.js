/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

module.exports = { adaptMongooseSchema, adaptMongooseModel }

const ValidityUtils = require('./validity')

const { wrapCallbackWithRetryOnError } = require('./wrapCallback')

const Global = {}

const WRAP_TYPE = {
  SYNCHRONOUS: 'sync',
  SYNCHRONOUS_WITH_BATCHSIZE: 'sync-batchsize',
  ASYNCHRONOUS: 'async',
}

const MONGOOSE_METHODS_THAT_ARE_WRAPPED = {
  IN_FETCHED_DOCUMENTS: {
    [WRAP_TYPE.ASYNCHRONOUS]: ['save', 'remove', 'deleteOne'],
  },
  TO_ADAPT_QUERY_EXEC: {
    [WRAP_TYPE.SYNCHRONOUS]: [
      'count',
      'countDocuments',
      'deleteMany',
      'deleteOne',
      'estimatedDocumentCount',
      'findById',
      'findByIdAndDelete',
      'findByIdAndRemove',
      'findByIdAndUpdate',
      'findOne',
      'findOneAndDelete',
      'findOneAndRemove',
      'findOneAndReplace',
      'findOneAndUpdate',
      'remove',
      'replaceOne',
      'update',
      'updateMany',
      'updateOne',
    ],
    [WRAP_TYPE.SYNCHRONOUS_WITH_BATCHSIZE]: ['find', 'where'],
  },
  IN_NEW_MODEL_CONSTRUCTOR: {
    [WRAP_TYPE.ASYNCHRONOUS]: ['save', 'remove', 'deleteOne'],
  },
}

/**
 * @param {object} input
 * @param {object} input.cosmosClientWrapper
 * @param {object} input.mongooseSchema
 * @param {string} input.collectionName
 *
 * @returns {object}
 *    Mongoose schema from input
 */
function adaptMongooseSchema(input) {
  const prefix = 'adaptMongooseSchema()'

  ValidityUtils.ensureValidObject({ input, prefix, text: 'input' })
  const { cosmosClientWrapper: client, mongooseSchema: schema, collectionName } = input

  ValidityUtils.ensureValidClass({
    input: client,
    prefix,
    text: 'client',
    className: 'CosmosClientWrapper',
  })
  ValidityUtils.ensureValidClass({
    input: schema,
    prefix,
    text: 'Mongoose schema',
    className: 'Schema',
  })
  ValidityUtils.ensureValidPrimitive({
    input: collectionName,
    prefix,
    text: 'collection name',
    check: item => /^\w+$/.test(item),
  })

  _adaptMongooseMethodsInFetchedDocuments({ client, collectionName, schema })

  return schema
}

/**
 * @param {object} input
 * @param {object} input.cosmosClientWrapper
 * @param {object} input.mongooseModel
 *
 * @returns {object}
 *    Reference to a new Mongoose model object
 *    which should be used afterwards instead of the given model
 */
function adaptMongooseModel(input) {
  const prefix = 'adaptMongooseModel()'

  ValidityUtils.ensureValidObject({ input, prefix, text: 'input' })
  const { cosmosClientWrapper: client, mongooseModel } = input

  ValidityUtils.ensureValidClass({
    input: mongooseModel,
    prefix,
    text: 'Mongoose model',
    check: _input =>
      _input.schema != null &&
      typeof _input.schema === 'object' &&
      _input.schema.constructor.name === 'Schema',
  })
  ValidityUtils.ensureValidClass({
    input: client,
    prefix,
    text: 'client',
    className: 'CosmosClientWrapper',
  })

  const { name: collectionName } = mongooseModel.collection

  class AdaptedModel extends mongooseModel {
    constructor(...args) {
      super(...args)
      // _logOnce('overloaded model-constructor called', collectionName)
      _adaptMongooseMethodsInConstructor({ client, collectionName, document: this })
    }
  }

  _adaptMongooseMethodsWhichReturnQuery({ client, collectionName, model: AdaptedModel })

  return AdaptedModel
}

function _adaptMongooseMethodsInFetchedDocuments({ client, collectionName, schema }) {
  const { IN_FETCHED_DOCUMENTS } = MONGOOSE_METHODS_THAT_ARE_WRAPPED

  Object.keys(IN_FETCHED_DOCUMENTS).forEach(type => {
    const methodsToWrap = IN_FETCHED_DOCUMENTS[type]
    if (methodsToWrap.length > 0) {
      schema.post(
        'init',
        _createMongooseInitPostHook({ client, collectionName, methodsToWrap, type })
      )
    }
  })

  return schema
}

function _createMongooseInitPostHook({ client, collectionName, methodsToWrap, type }) {
  const runActionAsync = type === WRAP_TYPE.ASYNCHRONOUS

  const wrapper = _getAzureWrapper({ client, collectionName, runActionAsync })

  return function initPostHook(document) {
    if (document._azureAddons == null) {
      document._azureAddons = { backup: {} }
    }
    const { backup } = document._azureAddons

    methodsToWrap.forEach(methodName => {
      if (backup[methodName] != null) {
        return
      }
      backup[methodName] = document[methodName].bind(document)
      document[methodName] = (...args) => {
        // _logOnce(`init-action ${methodName}()`)
        return wrapper(backup[methodName], ...args)
      }
    })

    // _logOnce('initPostHook', {
    //   addons: document._azureAddons,
    //   findOne: document.findOne,
    //   save: document.save.toString(),
    // })
  }
}

function _adaptMongooseMethodsInConstructor({ client, collectionName, document }) {
  const { IN_NEW_MODEL_CONSTRUCTOR } = MONGOOSE_METHODS_THAT_ARE_WRAPPED

  if (document._azureAddons == null) {
    document._azureAddons = { backup: {} }
  }
  const { backup } = document._azureAddons

  Object.keys(IN_NEW_MODEL_CONSTRUCTOR).forEach(type => {
    const methodsToWrap = IN_NEW_MODEL_CONSTRUCTOR[type]
    if (methodsToWrap.length === 0) {
      return
    }

    const runActionAsync = type === WRAP_TYPE.ASYNCHRONOUS
    const wrapper = _getAzureWrapper({ client, collectionName, runActionAsync })

    methodsToWrap.forEach(methodName => {
      if (backup[methodName] != null) {
        return
      }
      if (typeof document[methodName] !== 'function') {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.log(
            'kth-node-cosmos-db: _adaptMongooseMethodsInConstructor() ' +
              `- Internal warning: There is no method named "${methodName}"`
          )
        }
        return
      }
      backup[methodName] = document[methodName].bind(document)
      document[methodName] = (...args) => {
        // _logOnce(`adapted constructor action ${methodName}()`)
        return wrapper(backup[methodName], ...args)
      }
    })
  })
}

function _adaptMongooseMethodsWhichReturnQuery({ client, collectionName, model }) {
  const { TO_ADAPT_QUERY_EXEC } = MONGOOSE_METHODS_THAT_ARE_WRAPPED

  if (model._azureAddons == null) {
    model._azureAddons = { backup: {} }
  }
  const { backup } = model._azureAddons

  Object.keys(TO_ADAPT_QUERY_EXEC).forEach(type => {
    const methodsToWrap = TO_ADAPT_QUERY_EXEC[type]
    if (methodsToWrap.length === 0) {
      return
    }

    if (type === WRAP_TYPE.ASYNCHRONOUS) {
      throw new Error(
        'kth-node-cosmos-db: Internal error - query functions must be wrapped synchronously'
      )
    }
    const includeBatchsize = type === WRAP_TYPE.SYNCHRONOUS_WITH_BATCHSIZE

    const execWrapper = _getAzureWrapper({ client, collectionName, runActionAsync: true })

    methodsToWrap.forEach(methodName => {
      if (backup[methodName] != null) {
        return
      }
      if (typeof model[methodName] !== 'function') {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.log(
            'kth-node-cosmos-db: _adaptMongooseMethodsWhichReturnQuery() ' +
              `- Internal warning: There is no method named "${methodName}"`
          )
        }
        return
      }
      backup[methodName] = model[methodName].bind(model)
      model[methodName] = (...args) => {
        const query = backup[methodName](...args)
        // _logOnce(`adapted model action ${methodName}()`)
        if (includeBatchsize && client.batchSize) {
          query.batchSize(client.batchSize)
        }
        query._azureAddons = { backup: { exec: query.exec.bind(query) } }
        query.exec = (...execArgs) => {
          // _logOnce(`adapted query.exec() after model action ${methodName}()`)
          return execWrapper(query._azureAddons.backup.exec, ...execArgs)
        }
        return query
      }
    })
  })
}

function _getAzureWrapper({ client, collectionName, runActionAsync }) {
  const wrapperData = {
    client,
    errorHandler: _createThroughputErrorHandler({ client, collectionName }),
    runActionAsync,
    stopAction: () => {
      throw new Error(
        'kth-node-cosmos-db ' +
          '- Azure wrapper aborted during Mongoose operation ' +
          '- Maybe there is generally too little throughput available'
      )
    },
  }

  return wrapCallbackWithRetryOnError(wrapperData)
}

function _createThroughputErrorHandler({ client, collectionName }) {
  return async function errorHandler(error) {
    const isThroughputError =
      error.code === 16500 || error.toString().includes('Request rate is large')
    if (!isThroughputError) {
      return null
    }

    const difference = await client.increaseCollectionThroughput(collectionName)
    return difference == null ? 'stop' : 'retry'
  }
}

function _logOnce(id, ...data) {
  if (Global.loggingAlreadyDoneOnce == null) {
    Global.loggingAlreadyDoneOnce = []
  }
  if (Global.loggingAlreadyDoneOnce.includes(id)) {
    return false
  }
  // eslint-disable-next-line no-console
  console.log('DEBUGGING', `${id} -`, ...data)
  Global.loggingAlreadyDoneOnce.push(id)
  return true
}
