/* eslint-disable max-classes-per-file */
/* eslint no-use-before-define: ["error", "nofunc"] */

/**
 * "A collection is a container of JSON documents and associated JavaScript
 *  application logic ... A collection maps to a container in Azure Cosmos DB."
 * (https://docs.microsoft.com/en-us/rest/api/cosmos-db/collections)
 */

// @ts-check

const { v1: uuid } = require('uuid')
const assert = require('assert')

const { mockOffer } = require('./cosmosOffer')
const { throwReducedMockupApiError } = require('./cosmosError')

module.exports = {
  mockContainer,
  findMockedContainer,
  mockContainers
}

const Global = { containersPerClientAndDatabase: {} }

class Container {
  constructor({ database, name, client, throughput, offer, resourceId }) {
    this.database = database
    this.id = name

    this.__mock = { client, throughput, offer, resourceId }

    this.conflict = throwReducedMockupApiError
    this.conflicts = throwReducedMockupApiError
    this.delete = throwReducedMockupApiError
    this.getQueryPlan = throwReducedMockupApiError
    this.item = throwReducedMockupApiError
    this.items = throwReducedMockupApiError
    this.read = throwReducedMockupApiError
    this.readPartitionKeyDefinition = throwReducedMockupApiError
    this.readPartitionKeyRanges = throwReducedMockupApiError
    this.replace = throwReducedMockupApiError
    this.scripts = throwReducedMockupApiError
    this.url = throwReducedMockupApiError
  }
}

function mockContainer({ client, database, name, throughput }) {
  assert(client != null && typeof client === 'object', 'Mockup: Invalid client')
  assert(database != null && typeof database === 'object', 'Mockup: Invalid database')
  assert(typeof name === 'string' && name !== '', 'Mockup: Invalid container name')
  assert(typeof throughput === 'number' && throughput > 0, 'Mockup: Invalid throughput')

  const clientId = client.__mock.id
  const databaseId = database.id

  if (Global.containersPerClientAndDatabase[clientId] == null) {
    Global.containersPerClientAndDatabase[clientId] = {}
  }
  if (Global.containersPerClientAndDatabase[clientId][databaseId] == null) {
    Global.containersPerClientAndDatabase[clientId][databaseId] = {}
  }

  if (Global.containersPerClientAndDatabase[clientId][databaseId][name] == null) {
    const resourceId = uuid()
    const offer = mockOffer({ client, containerResourceId: resourceId, throughput })

    const newContainer = new Container({ database, name, client, throughput, offer, resourceId })

    Global.containersPerClientAndDatabase[clientId][databaseId][name] = newContainer
  }

  return Global.containersPerClientAndDatabase[clientId][databaseId][name]
}

function findMockedContainer({ client, database, name }) {
  assert(client != null && typeof client === 'object', 'Mockup: Invalid client')
  assert(database != null && typeof database === 'object', 'Mockup: Invalid database')
  assert(typeof name === 'string' && name !== '', 'Mockup: Invalid container name')

  const clientId = client.__mock.id
  const databaseId = database.id

  if (
    Global.containersPerClientAndDatabase[clientId] == null ||
    Global.containersPerClientAndDatabase[clientId][databaseId] == null
  ) {
    throwReducedMockupApiError()
  }

  const container = Global.containersPerClientAndDatabase[clientId][databaseId][name]

  if (container == null) {
    throwReducedMockupApiError()
  }

  return container
}

class Containers {
  constructor({ client, database }) {
    const clientId = client.__mock.id
    const databaseId = database.id

    this.database = database

    this.createIfNotExists = options => {
      const { id, throughput } = options
      const container = mockContainer({ client, database, name: id, throughput })
      return Promise.resolve({ resource: container, container })
    }

    this.readAll = () => {
      const listOfAllContainers = Object.values(
        Global.containersPerClientAndDatabase[clientId][databaseId]
      )
      const listOfAllContainerDefinitions = listOfAllContainers.map(
        getContainerDefinitionAndResource
      )
      const _feedResponse = { resources: listOfAllContainerDefinitions }
      const _queryIterator = { fetchAll: () => Promise.resolve(_feedResponse) }
      return _queryIterator
    }

    this.create = throwReducedMockupApiError
    this.query = throwReducedMockupApiError
  }
}

function mockContainers({ client, database }) {
  assert(client != null && typeof client === 'object')
  assert(database != null && typeof database === 'object')

  return new Containers({ client, database })
}

function getContainerDefinitionAndResource(container) {
  return {
    id: container.id,
    _rid: container.__mock.resourceId
  }
}
