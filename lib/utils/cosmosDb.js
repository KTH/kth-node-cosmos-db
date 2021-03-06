/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

module.exports = {
  createDatabase,
  getDatabase,
  createContainer,
  getOneContainerByClient,
  getContainerByDatabase,
  getContainerThroughput,
  setContainerThroughput,
  getContainerPartitionKey,
}

// eslint-disable-next-line no-unused-vars
const { CosmosClient, Database, Container } = require('@azure/cosmos')
const log = require('kth-node-log')

const ValidityUtils = require('./validity')

/**
 * Please note: The database will only be created
 *              if it doesn't already exist in the client.
 *
 * @param {CosmosClient} client
 * @param {string} databaseName
 *
 * @returns {Promise<Database>}
 *    Resolves with database which is registered
 *    with the given client and name
 * @throws
 *    e.g. in case of invalid arguments
 */
async function createDatabase(client, databaseName) {
  _ensureValidCosmosClient(client)
  _ensureValidCosmosDatabaseName(databaseName)

  const databaseRequest = { id: databaseName, throughput: undefined }

  const { database } = await client.databases.createIfNotExists(databaseRequest)

  log.info(`kth-node-cosmos-db: Created database '${databaseName}', if it did not already exist`)

  return database
}

/**
 * @param {object} input
 * @param {CosmosClient} input.client
 * @param {string} input.databaseName
 * @param {boolean} [input.ignoreCase]
 *
 * @returns {Promise<Database|null>}
 *    Resolves with database matching given name; or
 *    Resolves with null if database can't be found
 * @throws
 *    e.g. in case of invalid arguments
 */
async function getDatabase({ client, databaseName, ignoreCase = false }) {
  _ensureValidCosmosClient(client)
  _ensureValidCosmosDatabaseName(databaseName)

  const queryResult = await client.databases.readAll().fetchAll()
  const { resources: allDatabaseDefinitions } = queryResult
  const knownDatabaseNames = allDatabaseDefinitions.map(item => item.id)

  const matchingDatabaseNames = knownDatabaseNames.filter(name => {
    return ignoreCase ? name.toLowerCase() === databaseName.toLowerCase() : name === databaseName
  })
  if (matchingDatabaseNames.length === 0) {
    return null
  }

  const database = client.database(databaseName)
  return database
}

/**
 * Please note: The container is only created and the given throughput is used
 *              if the container doesn't already exist in the database.
 *
 * @param {object} input
 * @param {object} input.database
 * @param {string} input.containerName
 * @param {number} [input.throughput]
 * @param {string[]} [input.partitionKey]
 *
 * @returns {Promise<Container>}
 *    Resolves with container which is registered
 *    with the given database and name
 * @throws
 *    e.g. in case of invalid arguments
 */
async function createContainer({ database, containerName, throughput, partitionKey }) {
  _ensureValidCosmosDatabase(database)
  _ensureValidCosmosContainerName(containerName)
  if (throughput != null) {
    _ensureValidCosmosThroughput(throughput)
  }
  if (partitionKey != null) {
    _ensureValidCosmosPartitionKey(partitionKey)
  }

  const _prepareValidPartitionKey = input => {
    const paths = Array.isArray(input)
      ? input.map(key => (/^\/\w+$/.test(key) ? `/'$v'${key}/'$v'` : key))
      : ["/'$v'/_partitionKey/'$v'"]
    return { paths }
  }

  const containerRequest = {
    id: containerName,
    throughput,
    partitionKey: _prepareValidPartitionKey(partitionKey),
  }

  const { container } = await database.containers.createIfNotExists(containerRequest)

  log.info(
    `kth-node-cosmos-db: Created container '${containerName}' with throughput '${throughput}', ` +
      'if it did not already exist'
  )

  return container
}

/**
 * Please note: If possible, use getContainerByDatabase() instead.
 *              (If different databases of the client each have a container
 *               with the given name, it's not predictable which one of those
 *               containers will be returned.)
 *
 * @param {string} containerName
 * @param {CosmosClient} client
 *
 * @returns {Promise<object|null>}
 *    Resolves with container matching the given name
 *    (if existing in at least one database); or
 *    Resolves with null iff no matching container was found
 * @throws
 *    e.g. in case of invalid arguments
 */
async function getOneContainerByClient(containerName, client) {
  _ensureValidCosmosContainerName(containerName)
  _ensureValidCosmosClient(client)

  const queryResult = await client.databases.readAll().fetchAll()
  const { resources: allDatabaseDefinitions } = queryResult
  const knownDatabaseNames = allDatabaseDefinitions.map(item => item.id)

  for (let i = 0; i < knownDatabaseNames.length; i++) {
    const database = client.database(knownDatabaseNames[i])
    const container = await getContainerByDatabase(containerName, database)
    if (container != null) {
      return container
    }
  }

  return null
}

/**
 * @param {string} containerName
 * @param {Database} database
 *
 * @returns {Promise<Container|null>}
 *    Resolves with container matching the given name (if existing); or
 *    Resolves with null iff no matching container was found
 * @throws
 *    e.g. in case of invalid arguments
 */
async function getContainerByDatabase(containerName, database) {
  _ensureValidCosmosContainerName(containerName)
  _ensureValidCosmosDatabase(database)

  const queryResult = await database.containers.readAll().fetchAll()
  const { resources: allContainerDefinitions } = queryResult
  const knownContainerNames = allContainerDefinitions.map(item => item.id)

  if (knownContainerNames.includes(containerName)) {
    const container = database.container(containerName)

    return container
  }

  return null
}

/**
 * @param {Container} container
 *
 * @returns {Promise<number|null>}
 *    Resolves with current throughput of the given container; or
 *    Resolves with null iff the throughput couldn't be determined
 * @throws
 *    e.g. in case of invalid arguments
 */
async function getContainerThroughput(container) {
  _ensureValidCosmosContainer(container)

  const offerDefinition = await _getContainerOfferDefinition(container)
  if (offerDefinition == null) {
    return null
  }

  const { offerThroughput } = offerDefinition.content

  return offerThroughput
}

/**
 * @param {Container} container
 * @param {number} newThroughput
 *
 * @returns {Promise<boolean>}
 *    Resolves with true
 *    iff the container's throughput was successfully updated
 * @throws
 *    e.g. in case of invalid arguments
 */
async function setContainerThroughput(container, newThroughput) {
  _ensureValidCosmosContainer(container)
  _ensureValidCosmosThroughput(newThroughput)

  const { client } = container.database

  const offerDefinition = await _getContainerOfferDefinition(container)
  if (offerDefinition == null) {
    return false
  }

  const newOfferDefinition = { ...offerDefinition, content: { ...offerDefinition.content } }
  newOfferDefinition.content.offerThroughput = newThroughput

  const formerOffer = client.offer(offerDefinition.id)
  const offerResponse = await formerOffer.replace(newOfferDefinition)

  return offerResponse.statusCode === 200
}

/**
 * @param {Container} container
 *
 * @returns {Promise<string[]>}
 *    Partition key of the given container
 * @throws
 *    e.g. in case of invalid arguments
 */
async function getContainerPartitionKey(container) {
  _ensureValidCosmosContainer(container)

  const containerResponse = await container.read()
  const { resource: containerDefinition } = containerResponse

  const { paths: partitionKey } = containerDefinition.partitionKey

  return partitionKey
}

/**
 * @private
 * @param {Container} container
 * @returns {Promise<>}
 */
async function _getContainerOfferDefinition(container) {
  _ensureValidCosmosContainer(container)

  const { id: containerName, database } = container

  const resourceId = await _getContainerResourceId(container)

  const queryResult = await database.client.offers.readAll().fetchAll()
  const { resources: allOfferDefinitions } = queryResult

  const offerBelongsToContainer = offer => offer.offerResourceId === resourceId
  const offerDefinition = allOfferDefinitions.find(offerBelongsToContainer)

  if (offerDefinition != null) {
    return offerDefinition
  }

  throw new Error(`Failed to query internal offer definition of container "${containerName}"`)
}

/**
 * @private
 * @param {Container} container
 * @returns {Promise<string>}
 * @throws
 */
async function _getContainerResourceId(container) {
  _ensureValidCosmosContainer(container)

  const { id: containerName, database } = container
  const lcContainerName = containerName.toLowerCase()

  const queryResult = await database.containers.readAll().fetchAll()
  const { resources: containerDefinitionList } = queryResult

  for (let i = 0; i < containerDefinitionList.length; i++) {
    const { id, _rid } = containerDefinitionList[i]
    if (id.toLowerCase() === lcContainerName) {
      return _rid
    }
  }

  throw new Error(`Failed to query internal resource-ID of container "${containerName}"`)
}

function _ensureValidCosmosClient(input) {
  ValidityUtils.ensureValidClass({ input, text: 'CosmosDB client', className: 'CosmosClient' })
}

function _ensureValidCosmosDatabase(input) {
  ValidityUtils.ensureValidClass({ input, text: 'CosmosDB database', className: 'Database' })
}

function _ensureValidCosmosContainer(input) {
  ValidityUtils.ensureValidClass({ input, text: 'CosmosDB container', className: 'Container' })
}

function _ensureValidCosmosDatabaseName(input) {
  ValidityUtils.ensureValidPrimitive({
    input,
    text: 'CosmosDB database name',
    check: typeof input === 'string' && /^[^/\\#?]{1,255}$/.test(input),
  })
}

function _ensureValidCosmosContainerName(input) {
  ValidityUtils.ensureValidPrimitive({
    input,
    text: 'CosmosDB container name',
    check: typeof input === 'string' && /^[^/\\#?]{1,255}$/.test(input),
  })
}

function _ensureValidCosmosThroughput(input) {
  ValidityUtils.ensureValidPrimitive({
    input,
    text: 'CosmosDB throughput',
    check: typeof input === 'number' && input >= 100,
  })
}

function _ensureValidCosmosPartitionKey(input) {
  ValidityUtils.ensureValidArray({
    input,
    text: 'Cosmos DB partition key',
    check: input.every(item => typeof item === 'string' && item !== ''),
  })
}
