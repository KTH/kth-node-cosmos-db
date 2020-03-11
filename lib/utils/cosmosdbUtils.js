const log = require('kth-node-log')

/**
 * Creates and returnes a new database with a name. Creates it, if it  does not already exist.
 * @param {*} name
 * @param {CosmosClient} client
 */
async function createDatabase(name, client) {
  const databaseDefinition = { id: name }
  const { database } = await client.databases.createIfNotExists(databaseDefinition)
  log.info(`kth-node-cosmos-db: Created database '${name}', if it did not already exist`)
  return database
}

/**
 * Creates and returnes a new collection with a name. Creates it, if it  does not already exist.
 * @param {*} name
 * @param {CosmosClient} client
 */
async function createCollection(database, name, throughput) {
  const collectionDefinition = { id: name, throughput }
  const { collection } = await database.containers.createIfNotExists(collectionDefinition)
  log.info(
    `kth-node-cosmos-db: Created collection '${name}' with throughput '${throughput}', if it did not already exist`
  )
  return collection
}

async function increaseThroughput(name, newThroughput, client) {
  // To update an existing container or databases throughput, you need to user the offers API
  // Get all the offers
  const { resources: offers } = await client.offers.readAll().fetchAll()

  // Find the offer associated with your container or the database
  const updatedOffer = offers.find(_offer => _offer.offerResourceId === name)

  // Change the throughput value
  updatedOffer.content.offerThroughput = newThroughput

  // Replace the offer.
  await client.offer(updatedOffer.id).replace(updatedOffer)
}

/**
 * Gets a collection by name.
 * @param {*} name
 * @param {*} client
 */
async function getCollection(name, client) {
  return client.databases.container(name)
}

/**
 * Gets collections Offer (An offer contains the current throughput).
 * @param {G} query
 * @param {*} client
 */
async function getCollectionOffer(name, client) {
  const { resources: offers } = await client.offers.readAll().fetchAll()
  return offers.find(_offer => _offer.offerResourceId === name)
}

module.exports = {
  createDatabase,
  createCollection,
  increaseThroughput,
  getCollection,
  getCollectionOffer
}
