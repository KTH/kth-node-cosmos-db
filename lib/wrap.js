/* eslint no-use-before-define: ["error", "nofunc"] */

const { getClient } = require('./client')
const { handleError, useMongoNative } = require('./utils')

const MEMORIZE_ORIGINAL_MONGOOSE_METHODS = true

module.exports = wrap

/**
 * Please note: The given model is not copied but changed in place.
 *
 * @param {object} model
 *    Mongoose model, e.g. created with mongoose.model(schema)
 * @returns {object}
 *    Same mongoose model where some of the methods may be wrapped
 *    so that errors like "Request rate is large" are handled properly
 *    during later usage of the model
 */
function wrap(model) {
  const modelCanBeWrapped = typeof model === 'function' && !useMongoNative()
  if (!modelCanBeWrapped) {
    return model
  }

  const methodsBeforeWrapping = {}

  const methodsThatWillBeWrappedSimilarly = [
    'findOneAndUpdate',
    'findById',
    'save',
    'update',
    'updateOne',
    'updateMany',
    'findOne',
    'remove'
  ]

  methodsThatWillBeWrappedSimilarly.forEach(name => {
    const callback = model.__proto__[name]
    model[name] = _getMongooseMethodWrapper(model, name)

    if (MEMORIZE_ORIGINAL_MONGOOSE_METHODS) {
      methodsBeforeWrapping[name] = callback
    }
  })

  const findCallback = model.__proto__.find
  model.find = _getMongooseMethodWrapperWithBatchsize(model, 'find')

  if (MEMORIZE_ORIGINAL_MONGOOSE_METHODS) {
    methodsBeforeWrapping.find = findCallback
    model._getMethodsBeforeWrapping = () => methodsBeforeWrapping
  }

  return model
}

function _getMongooseMethodWrapper(model, name) {
  async function wrapper(...args) {
    let result

    try {
      result = await this.__proto__[name].apply(this, args)
    } catch (error) {
      const client = await getClient()

      result = handleError(error, client, this, this[name], args)
    }

    return result
  }
  return wrapper
}

function _getMongooseMethodWrapperWithBatchsize(model, name) {
  async function wrapper(...args) {
    let result

    const client = await getClient()

    try {
      result = await this.__proto__[name].apply(this, args)

      if (client.batchSize) {
        result = result.batchSize(client.batchSize)
      }
    } catch (error) {
      result = handleError(error, client, this, this[name], args)
    }

    return result
  }
  return wrapper
}
