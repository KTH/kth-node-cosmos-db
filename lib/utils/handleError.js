/* eslint no-use-before-define: ["error", "nofunc"] */

const log = require('kth-node-log')

module.exports = handleError

async function handleError(error, client, model, callback, arg) {
  try {
    if (error.code === 16500 || error.toString().includes('Request rate is large')) {
      log.info('Retrying write due to high RU')

      await client.increaseCollectionThroughput(model.collection.collectionName)

      return callback.apply(model, arg)
    }
  } catch (err) {
    log.error('kth-node-cosmos-db: Could not execute toString on error', { err })
  }

  log.error(error)
  throw error
}
