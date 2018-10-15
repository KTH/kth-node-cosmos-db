'use strict'

const log = require('kth-node-log')

module.exports.handleError = async (e, client, model, cb, arg) => {
  if (e.code === 16500 || JSON.stringify(e).includes('Request rate is large')) {
    log.info('Retrying write due to high RU')

    await client.increaseCollectionThroughput(model.collection.collectionName)

    return cb.apply(model, arg)
  } else {
    log.error(e)
    throw e
  }
}