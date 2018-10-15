'use strict'

const log = require('kth-node-log')
const { getClient } = require('./client')
const { handleError } = require('../utils/handleError')
const { _development } = require('../utils/development')

module.exports.wrap = model => {
  if (_development(process.env)) {
    return model
  }

  // const wrap = Object.assign(new model.constructor(), model)

  model.findOneAndUpdate = async function() {
    try {
      return await this.__proto__.findOneAndUpdate.apply(this, arguments)
    } catch (e) {
      const client = await getClient()
      return handleError(e, client, this, this.findOneAndUpdate, arguments)
    }
  }

  model.save = async function() {
    try {
      return await this.__proto__.save.apply(this, arguments)
    } catch (e) {
      const client = await getClient()
      return handleError(e, client, this, this.save, arguments)
    }
  }

  model.update = async function() {
    try {
      return await this.__proto__.update.apply(this, arguments)
    } catch (e) {
      const client = await getClient()
      return handleError(e, client, this, this.update, arguments)
    }
  }

  model.findOne = async function() {
    try {
      return await this.__proto__.findOne.apply(this, arguments)
    } catch (e) {
      const client = await getClient()
      return handleError(e, client, this, this.findOne, arguments)
    }
  }

  model.find = async function() {
    try {
      const client = await getClient()
      return await this.__proto__.find.apply(this, arguments).batchSize(client.batchSize)
    } catch (e) {
      const client = await getClient()
      return handleError(e, client, this, this.find, arguments)
    }
  }

  model.remove = async function () {
    try {
      return await this.__proto__.remove.apply(this, arguments)
    } catch (e) {
      const client = await getClient()
      return handleError(e, client, this, this.remove, arguments)
    }
  }

  return model
}