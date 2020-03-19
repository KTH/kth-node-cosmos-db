/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

const assert = require('assert')

// eslint-disable-next-line no-unused-vars
const { CosmosClient, Database, Container } = require('@azure/cosmos')

const log = require('kth-node-log')

module.exports = {
  createDatabase,
  createContainer,
  getContainerByClient,
  getContainerOfferByClient,
  increaseThroughputByName,
  increaseThroughputByOffer
}

/**
 * Please note: The database will only be created
 *              if it doesn't already exist in the client.
 *
 * @param {string} databaseName
 * @param {CosmosClient} client
 *
 * @returns {Promise<Database>}
 *    Database which is registered with the given client and name
 */
async function createDatabase(databaseName, client) {
  _ensureValidCosmosDatabaseName(databaseName)
  _ensureValidCosmosClient(client)

  const databaseRequest = { id: databaseName, throughput: undefined }

  const { database } = await client.databases.createIfNotExists(databaseRequest)

  log.info(`kth-node-cosmos-db: Created database '${databaseName}', if it did not already exist`)

  return database
}

/**
 * Please note: The container is only created
 *              if it doesn't already exist in the database.
 *
 * @param {object} database
 * @param {string} containerName
 * @param {number} throughput
 *
 * @returns {Promise<Container>}
 *    Container which is registered with the given database and name
 */
async function createContainer(database, containerName, throughput) {
  _ensureValidCosmosDatabase(database)
  _ensureValidCosmosContainerName(containerName)
  _ensureValidCosmosThroughput(throughput)

  const containerRequest = { id: containerName, throughput }

  const { container } = await database.containers.createIfNotExists(containerRequest)

  log.info(
    `kth-node-cosmos-db: Created container '${containerName}' with throughput '${throughput}', ` +
      'if it did not already exist'
  )

  return container
}

/**
 * Please note: If different databases of the client each have a container
 *              with the given name, it's not predictable which one of those
 *              containers will be returned
 *
 * @param {string} containerName
 * @param {CosmosClient} client
 *
 * @returns {Promise<object|null>}
 *    Container with the given name; or
 *    null iff no container with the given name was found
 * @throws
 */
async function getContainerByClient(containerName, client) {
  _ensureValidCosmosContainerName(containerName)
  _ensureValidCosmosClient(client)

  const queryResult = await client.databases.readAll().fetchAll()
  const { resources: allDatabaseDefinitions } = queryResult

  for (let i = 0; i < allDatabaseDefinitions.length; i++) {
    const { id: databaseId } = allDatabaseDefinitions[i]

    const database = client.database(databaseId)
    const container = database.container(containerName)

    if (container != null) {
      return container
    }
  }

  return null
}

/**
 * @param {string} containerName
 * @param {CosmosClient} client
 *
 * @returns {Promise<object|null>}
 *    Current offer definition of the given container; or
 *    null iff the container wasn't found
 */
async function getContainerOfferByClient(containerName, client) {
  _ensureValidCosmosContainerName(containerName)
  _ensureValidCosmosClient(client)

  const container = await getContainerByClient(containerName, client)
  if (container == null) {
    return null
  }

  return _getContainerOffer(container)
}

// /**
//  * Please note: An offer definition contains the current throughput
//  *
//  * @param {string} containerName
//  * @param {Database} database
//  *
//  * @returns {Promise<object|null>}
//  *    Current offer definition which belongs to the given container; or
//  *    null iff the container wasn't found
//  */
// async function _getContainerOfferByDatabase(containerName, database) {
//   _ensureValidCosmosContainerName(containerName)
//   _ensureValidCosmosDatabase(database)

//   const container = await _getContainerByDatabase(containerName, database)
//   if (container == null) {
//     return null
//   }

//   return _getContainerOffer(container)
// }

// /**
//  * @param {string} containerName
//  * @param {Database} database
//  *
//  * @returns {Promise<Container|null>}
//  *    Container with the given name; or
//  *    null iff no container with the given name was found
//  */
// async function _getContainerByDatabase(containerName, database) {
//   _ensureValidCosmosContainerName(containerName)
//   _ensureValidCosmosDatabase(database)

//   return database.container(containerName) || null
// }

/**
 * @param {Container} container
 *
 * @returns {Promise<object|null>}
 */
async function _getContainerOffer(container) {
  _ensureValidCosmosContainer(container)

  const { id: containerId, database } = container
  const { client } = database

  const resourceId = await _getResourceIdOfContainer(containerId, database)

  const queryResult = await client.offers.readAll().fetchAll()
  const { resources: allOfferDefinitions } = queryResult

  const offerBelongsToContainer = offer => offer.offerResourceId === resourceId
  const offerDefinition = allOfferDefinitions.find(offerBelongsToContainer)

  return offerDefinition || null
}

/**
 * @param {string} containerName
 * @param {Database} database
 *
 * @returns {Promise<string|null>}
 *    Azure's internal resource ID of the given container; or
 *    null iff container wasn't found
 */
async function _getResourceIdOfContainer(containerName, database) {
  _ensureValidCosmosContainerName(containerName)
  _ensureValidCosmosDatabase(database)

  const queryResult = await database.containers.readAll().fetchAll()
  const { resources: containerDefinitionList } = queryResult

  for (let i = 0; i < containerDefinitionList.length; i++) {
    const { id, _rid } = containerDefinitionList[i]
    if (id === containerName) {
      return _rid
    }
  }

  return null
}

/**
 * @param {string} containerName
 * @param {number} newThroughput
 * @param {CosmosClient} client
 *
 * @returns {Promise<object>}
 */
async function increaseThroughputByName(containerName, newThroughput, client) {
  _ensureValidCosmosThroughput(newThroughput)

  const containerOffer = await getContainerOfferByClient(containerName, client)

  await increaseThroughputByOffer(containerOffer, newThroughput, client)
}

/**
 * @param {object} offer
 * @param {number} newThroughput
 * @param {CosmosClient} client
 *
 * @returns {Promise<object>}
 */
async function increaseThroughputByOffer(offer, newThroughput, client) {
  _ensureValidCosmosOfferDefinition(offer)
  _ensureValidCosmosThroughput(newThroughput)
  _ensureValidCosmosClient(client)

  const newOffer = { ...offer, content: { ...offer.content } }
  newOffer.content.offerThroughput = newThroughput

  const formerOffer = client.offer(offer.id)
  await formerOffer.replace(newOffer)
}

function _ensureValidCosmosClient(input) {
  assert(
    input != null && typeof input === 'object' && input.constructor.name === 'CosmosClient',
    'Invalid CosmosDB client'
  )
}

function _ensureValidCosmosDatabase(input) {
  assert(
    input != null && typeof input === 'object' && input.constructor.name === 'Database',
    'Invalid CosmosDB database'
  )
}

function _ensureValidCosmosContainer(input) {
  assert(
    input != null && typeof input === 'object' && input.constructor.name === 'Container',
    'Invalid CosmosDB container'
  )
}

function _ensureValidCosmosOfferDefinition(input) {
  assert(
    input != null &&
      typeof input === 'object' &&
      input.content != null &&
      typeof input.content === 'object' &&
      typeof input.content.offerThroughput === 'number' &&
      input.content.offerThroughput >= 100,
    `Invalid CosmosDB offer definition`
  )
}

function _ensureValidCosmosDatabaseName(input) {
  assert(
    typeof input === 'string' && /^[^/\\#?]{1,255}$/.test(input),
    `Invalid CosmosDB database name (${input})`
  )
}

function _ensureValidCosmosContainerName(input) {
  assert(
    typeof input === 'string' && /^[^/\\#?]{1,255}$/.test(input),
    `Invalid CosmosDB container name (${input})`
  )
}

function _ensureValidCosmosThroughput(input) {
  assert(typeof input === 'number' && input >= 100, `Invalid CosmosDB throughput (${input})`)
}
