/* eslint-disable no-use-before-define */

// @ts-check

const { CosmosClient } = require('@azure/cosmos') // eslint-disable-line no-unused-vars

const log = require('kth-node-log')

module.exports = {
  createDatabase,
  createCollection,
  getCollection,
  getCollectionOffer,
  increaseThroughput
}

/**
 * Please note: If the client doesn't have a database with the given name,
 * the database will be created.
 *
 * @param {string} databaseName
 * @param {CosmosClient} client
 *
 * @returns {Promise<object>}
 *    Database which is registered with the given client and name
 */
async function createDatabase(databaseName, client) {
  const databaseDefinition = { id: databaseName }

  const { database } = await client.databases.createIfNotExists(databaseDefinition)

  log.info(`kth-node-cosmos-db: Created database '${databaseName}', if it did not already exist`)
  return database
}

/**
 * Creates and returnes a new collection with a name. Creates it, if it  does not already exist.
 * @param {object} database
 * @param {string} collectionName
 * @param {number} throughput
 *
 * @returns {Promise<object>}
 */
async function createCollection(database, collectionName, throughput) {
  const collectionDefinition = { id: collectionName, throughput }
  const { container } = await database.containers.createIfNotExists(collectionDefinition)

  log.info(
    `kth-node-cosmos-db: Created collection '${collectionName}' with throughput '${throughput}', ` +
      'if it did not already exist'
  )
  return container
}

/**
 * @param {string} collectionName
 * @param {CosmosClient} client
 *
 * @returns {Promise<object|null>}
 *    Collection with the given name (if present in one of the client's databases)
 */
async function getCollection(collectionName, client) {
  const queryResult = await client.databases.readAll().fetchAll()
  const { resources: databaseDefinitionList } = queryResult

  for (let i = 0; i < databaseDefinitionList.length; i++) {
    const databaseId = databaseDefinitionList[i].id
    const database = client.database(databaseId)
    const container = database.container(collectionName)
    if (container != null) {
      return container
    }
  }

  return null
}

/**
 * Please note: An offer contains the current throughput
 *
 * @param {string} collectionName
 * @param {CosmosClient} client
 *
 * @returns {Promise<object|null>}
 *    Offer which belongs to the collection with the given name (if present)
 */
async function getCollectionOffer(collectionName, client) {
  const collection = await getCollection(collectionName, client)
  if (collection == null) {
    return null
  }

  const queryResult = await client.offers.readAll().fetchAll()
  const { resources: clientOfferList } = queryResult

  const offerBelongsToCollection = offer => offer.offerResourceId === collection._rid
  const collectionOffer = clientOfferList.find(offerBelongsToCollection)

  return collectionOffer
}

/**
 * @param {string} collectionName
 * @param {number} newThroughput
 * @param {CosmosClient} client
 *
 * @returns {Promise<object>}
 */
async function increaseThroughput(collectionName, newThroughput, client) {
  const collectionOffer = await getCollectionOffer(collectionName, client)

  collectionOffer.content.offerThroughput = newThroughput

  const formerOffer = client.offer(collectionOffer.id)
  await formerOffer.replace(collectionOffer)
}
