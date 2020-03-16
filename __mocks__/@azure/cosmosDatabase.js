/* eslint no-use-before-define: ["error", "nofunc"] */

/**
 * "Each Azure Cosmos DB account supports multiple
 *  independently named databases."
 * (https://docs.microsoft.com/en-us/rest/api/cosmos-db/databases)
 */

// @ts-check

const { v1: uuid } = require('uuid')
const assert = require('assert')

const { mockContainers, findMockedContainer } = require('./cosmosContainer')
const { throwReducedMockupApiError } = require('./cosmosError')

module.exports = {
  mockDatabase,
  findMockedDatabase,
  mockDatabases
}

const Global = { databasesPerClient: {} }

function mockDatabase({ client, name }) {
  assert(client != null && typeof client === 'object', 'Mockup: Invalid client')
  assert(typeof name === 'string' && name !== '', 'Mockup: Invalid database name')

  const clientId = client.__mock.id

  if (Global.databasesPerClient[clientId] == null) {
    Global.databasesPerClient[clientId] = {}
  }

  if (Global.databasesPerClient[clientId][name] == null) {
    const resourceId = uuid()

    const newDatabase = {
      client,
      id: name,

      __mock: { name, resourceId }
    }

    newDatabase.containers = mockContainers({ client, database: newDatabase })
    newDatabase.container = containerName =>
      findMockedContainer({ client, database: newDatabase, name: containerName })

    Global.databasesPerClient[clientId][name] = newDatabase
  }

  return Global.databasesPerClient[clientId][name]
}

function findMockedDatabase({ client, name }) {
  assert(client != null && typeof client === 'object')
  assert(typeof name === 'string' && name !== '')

  const clientId = client.__mock.id

  if (Global.databasesPerClient[clientId] == null) {
    throwReducedMockupApiError()
  }

  const database = Global.databasesPerClient[clientId][name]

  if (database == null) {
    throwReducedMockupApiError()
  }

  return database
}

function mockDatabases({ client }) {
  assert(client != null && typeof client === 'object')

  const clientId = client.__mock.id

  const createIfNotExists = options => {
    const { id } = options
    const database = mockDatabase({ client, name: id })
    return Promise.resolve({ resource: database, database })
  }

  const readAll = () => {
    const listOfAllDatabases = Object.values(Global.databasesPerClient[clientId])
    const _feedResponse = { resources: listOfAllDatabases }
    const _queryIterator = { fetchAll: () => Promise.resolve(_feedResponse) }
    return _queryIterator
  }

  const databases = {
    client,
    createIfNotExists,
    readAll,

    create: throwReducedMockupApiError,
    query: throwReducedMockupApiError
  }

  return databases
}
