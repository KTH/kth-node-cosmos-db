/* eslint-disable no-use-before-define */

const { getClient } = require('./cosmosClientWrapper')
const { handleError, useMongoNative } = require('./utils')

const CACHE_ORIGINAL_MONGOOSE_METHODS = true

module.exports = {
  wrap
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

    if (CACHE_ORIGINAL_MONGOOSE_METHODS) {
      methodsBeforeWrapping[name] = callback
    }
  })

  const findCallback = model.__proto__.find
  model.find = _getMongooseMethodWrapperWithBatchsize(model, 'find')

  if (CACHE_ORIGINAL_MONGOOSE_METHODS) {
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

// 'use strict'

// const { getClient } = require('./cosmosClientWrapper')
// const { handleError } = require('./utils/handleError')
// const { useMongoNative } = require('./utils/environmentUtils')

// module.exports.wrap = model => {
//   if (useMongoNative()) {
//     return model
//   }

//   // const wrap = Object.assign(new model.constructor(), model)

//   model.findOneAndUpdate = async function() {
//     try {
//       return await this.__proto__.findOneAndUpdate.apply(this, arguments)
//     } catch (e) {
//       const client = await getClient()
//       return handleError(e, client, this, this.findOneAndUpdate, arguments)
//     }
//   }

//   model.findById = async function() {
//     try {
//       return await this.__proto__.findById.apply(this, arguments)
//     } catch (e) {
//       const client = await getClient()
//       return handleError(e, client, this, this.findById, arguments)
//     }
//   }

//   model.save = async function() {
//     try {
//       return await this.__proto__.save.apply(this, arguments)
//     } catch (e) {
//       const client = await getClient()
//       return handleError(e, client, this, this.save, arguments)
//     }
//   }

//   model.update = async function() {
//     try {
//       return await this.__proto__.update.apply(this, arguments)
//     } catch (e) {
//       const client = await getClient()
//       return handleError(e, client, this, this.update, arguments)
//     }
//   }

//   model.updateOne = async function() {
//     try {
//       return await this.__proto__.updateOne.apply(this, arguments)
//     } catch (e) {
//       const client = await getClient()
//       return handleError(e, client, this, this.updateOne, arguments)
//     }
//   }

//   model.updateMany = async function() {
//     try {
//       return await this.__proto__.updateMany.apply(this, arguments)
//     } catch (e) {
//       const client = await getClient()
//       return handleError(e, client, this, this.updateMany, arguments)
//     }
//   }

//   model.findOne = async function() {
//     try {
//       return await this.__proto__.findOne.apply(this, arguments)
//     } catch (e) {
//       const client = await getClient()
//       return handleError(e, client, this, this.findOne, arguments)
//     }
//   }

//   model.find = async function() {
//     try {
//       const client = await getClient()

//       if (client.batchSize) {
//         return await this.__proto__.find.apply(this, arguments).batchSize(client.batchSize)
//       }

//       return await this.__proto__.find.apply(this, arguments)
//     } catch (e) {
//       const client = await getClient()
//       return handleError(e, client, this, this.find, arguments)
//     }
//   }

//   model.remove = async function() {
//     try {
//       return await this.__proto__.remove.apply(this, arguments)
//     } catch (e) {
//       const client = await getClient()
//       return handleError(e, client, this, this.remove, arguments)
//     }
//   }

//   return model
// }
