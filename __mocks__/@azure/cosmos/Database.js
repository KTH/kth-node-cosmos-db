/* eslint-disable max-classes-per-file */
/* eslint no-use-before-define: ["error", "nofunc"] */

/**
 * "Each Azure Cosmos DB account supports multiple
 *  independently named databases."
 * (https://docs.microsoft.com/en-us/rest/api/cosmos-db/databases)
 */

// @ts-check

const { v1: uuid } = require('uuid')
const assert = require('assert')

const { mockContainers, findMockedContainer } = require('./Container')
const { throwReducedMockupApiError } = require('./Error')

module.exports = {
  mockDatabase,
  findMockedDatabase,
  mockDatabases
}

const Global = {
  databasesPerClient: {}
}

class Database {
  constructor({ client, name, resourceId }) {
    this.client = client
    this.id = name
    this.__mock = { name, resourceId }

    this.containers = mockContainers({ client, database: this })
    this.container = containerName =>
      findMockedContainer({ client, database: this, name: containerName })
  }
}

function mockDatabase({ client, name }) {
  assert(client != null && typeof client === 'object', 'Mockup: Invalid client')
  assert(typeof name === 'string' && name !== '', 'Mockup: Invalid database name')

  const clientId = client.__mock.id

  if (Global.databasesPerClient[clientId] == null) {
    Global.databasesPerClient[clientId] = {}
  }

  if (Global.databasesPerClient[clientId][name] == null) {
    const newDatabase = new Database({ client, name, resourceId: uuid() })
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

class Databases {
  constructor({ client }) {
    this.client = client

    const clientId = client.__mock.id

    this.createIfNotExists = options => {
      const { id } = options
      const database = mockDatabase({ client, name: id })
      return Promise.resolve({ resource: database, database })
    }

    this.readAll = () => {
      const listOfAllDatabases = Object.values(Global.databasesPerClient[clientId] || {})
      const _feedResponse = { resources: listOfAllDatabases }
      const _queryIterator = { fetchAll: () => Promise.resolve(_feedResponse) }
      return _queryIterator
    }

    this.create = throwReducedMockupApiError
    this.query = throwReducedMockupApiError
  }
}

function mockDatabases({ client }) {
  assert(client != null && typeof client === 'object')

  return new Databases({ client })
}
