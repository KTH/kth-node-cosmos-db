const log = require('kth-node-log')

const REQUIRED_OPTION_KEYS = ['host', 'db', 'collections', 'password', 'username', 'maxThroughput']

const validateKeys = options => {
  log.info(
    `Validating the options passed to the client to verify that it contains mandatory keys: ${REQUIRED_OPTION_KEYS} .`
  )
  const missing = REQUIRED_OPTION_KEYS.map(key => {
    if (!options[key]) {
      log.error(`This required CosmosDB client key ${options[key]} is missing.`)
      return key
    }
  }).filter(key => key)

  if (missing.length > 0) {
    throw new Error(
      `kth-node-cosmos-db: One or more of the required config options are missing to create a client: '${missing}'.`
    )
  }
}

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
        `kth-node-cosmos-db: Collections needs atlease a name. i.e collections: [{ name: 'users', throughput: 1500 }, { name: 'publications' }...].`
      )
    }
  })
}

const validate = options => {
  if (typeof options !== 'object') {
    throw new Error(
      `kth-node-cosmos-db: You need to pass a config object that contains ${REQUIRED_OPTION_KEYS}`
    )
  }
  validateKeys(options)
  validateCollections(options.collections)
}
/**
 * Exports
 */
module.exports = {
  validate,
  REQUIRED_OPTION_KEYS
}
