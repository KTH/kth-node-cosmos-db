'use strict'

const log = require('kth-node-log')
const { getClient } = require('./client')
const { _development } = require('../utils/development')

module.exports.wrap = model => {
  if (_development(process.env)) {
    return model
  }

  const wrap = Object.assign({}, model)

  wrap.findOneAndUpdate = async function() {
    try {
      return await this.__proto__.findOneAndUpdate.apply(this, arguments)
    } catch (e) {
      const client = await getClient()
      return handleError(e, client, this, this.findOneAndUpdate, arguments)
    }
  }

  wrap.save = async function() {
    try {
      return await this.__proto__.save.apply(this, arguments)
    } catch (e) {
      const client = await getClient()
      return handleError(e, client, this, this.save, arguments)
    }
  }

  wrap.update = async function() {
    try {
      return await this.__proto__.update.apply(this, arguments)
    } catch (e) {
      const client = await getClient()
      return handleError(e, client, this, this.update, arguments)
    }
  }

  wrap.findOne = async function() {
    try {
      return await this.__proto__.findOne.apply(this, arguments)
    } catch (e) {
      const client = await getClient()
      return handleError(e, client, this, this.findOne, arguments)
    }
  }

  wrap.find = async function() {
    try {
      const client = await getClient()
      return await this.__proto__.find.apply(this, arguments).batchSize(client.batchSize)
    } catch (e) {
      const client = await getClient()
      return handleError(e, client, this, this.find, arguments)
    }
  }

  wrap.remove = async function () {
    try {
      return await this.__proto__.remove.apply(this, arguments)
    } catch (e) {
      const client = await getClient()
      return handleError(e, client, this, this.remove, arguments)
    }
  }

  return wrap
}

const handleError = async (e, client, model, cb, arg) => {
  if (e.code === 16500 || e.message.includes('Request rate is large')) {
    log.info('Retrying write due to high RU')

    await client.increaseCollectionThroughput(model.collection.collectionName)

    return cb.apply(model, arg)
  } else {
    log.error(e)
    throw e
  }
}