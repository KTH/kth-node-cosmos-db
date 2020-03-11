const log = require('kth-node-log')

const validateCollections = collections => {
  log.info(`Validating the collections in the database.`)
  collections.map(collection => {
    if (typeof collection !== 'object') {
      throw new Error(
        'kth-node-cosmos-db: The collections option are only allowed to contain objects'
      )
    }
    if (!collection.name) {
      throw new Error(
        `kth-node-cosmos-db: One or more of the collection objects misses a name in collection ${collection}.`
      )
    }
  })
}
/**
 * Exports
 */
module.exports = {
  validateCollections
}
