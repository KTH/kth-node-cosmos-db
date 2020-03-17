/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

const { getClient } = require('./client')
const { handleError, useMongoNative } = require('./utils')

const MEMORIZE_ORIGINAL_MONGOOSE_METHODS = true

module.exports = wrap

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
 * @param {object} model
 *    Mongoose model, e.g. created with mongoose.model(schema)
 * @returns {object}
 *    Same mongoose model where some of the methods may be wrapped
 *    so that errors like "Request rate is large" are handled properly
 *    during later usage of the model
 */
function wrap(model) {
  const dontChangeInput = useMongoNative() || typeof model !== 'function'

  if (dontChangeInput) {
    return model
  }

  const methodNames = Object.keys(METHODS_THAT_WILL_BE_WRAPPED)

  if (MEMORIZE_ORIGINAL_MONGOOSE_METHODS) {
    const methodsBeforeWrapping = {}

    methodNames.forEach(name => {
      const type = METHODS_THAT_WILL_BE_WRAPPED[name]
      const prototype =
        type === WRAP_TYPE.IN_INSTANCE_ONLY ? undefined : Object.getPrototypeOf(model)[name]

      methodsBeforeWrapping[name] = prototype
    })

    model._getMethodsBeforeWrapping = () => methodsBeforeWrapping
  }

  methodNames.forEach(name => {
    const type = METHODS_THAT_WILL_BE_WRAPPED[name]
    if (type === WRAP_TYPE.WITH_BATCHSIZE) {
      model[name] = _getMongooseMethodWrapperWithBatchsize(name)
    } else {
      model[name] = _getMongooseMethodWrapper(name)
    }
  })

  return model
}

function _getMongooseMethodWrapper(name) {
  async function wrapper(...args) {
    let result

    const methodPrototype = Object.getPrototypeOf(this)[name]
    const client = await getClient()
    const method = this[name]

    try {
      const query = methodPrototype.apply(this, args)

      result = await query
    } catch (error) {
      result = handleError(error, client, this, method, args)
    }

    return result
  }

  return wrapper
}

function _getMongooseMethodWrapperWithBatchsize(name) {
  async function wrapper(...args) {
    let result

    const methodPrototype = Object.getPrototypeOf(this)[name]
    const client = await getClient()
    const method = this[name]

    try {
      const query = methodPrototype.apply(this, args)

      if (client != null && client.batchSize) {
        query.batchSize(client.batchSize)
      }

      result = await query
    } catch (error) {
      result = handleError(error, client, this, method, args)
    }

    return result
  }

  return wrapper
}
