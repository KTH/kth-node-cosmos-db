/* eslint-disable no-use-before-define */

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

function mockContainer({ client, database, name, throughput }) {
  assert(client != null && typeof client === 'object')
  assert(database != null && typeof database === 'object')
  assert(typeof name === 'string' && name !== '')
  assert(typeof throughput === 'number' && throughput > 0)

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

    const newContainer = {
      database,
      id: name,

      _rid: resourceId,

      __mock: { client, throughput, offer, resourceId },

      conflict: throwReducedMockupApiError,
      conflicts: throwReducedMockupApiError,
      delete: throwReducedMockupApiError,
      getQueryPlan: throwReducedMockupApiError,
      item: throwReducedMockupApiError,
      items: throwReducedMockupApiError,
      read: throwReducedMockupApiError,
      readPartitionKeyDefinition: throwReducedMockupApiError,
      readPartitionKeyRanges: throwReducedMockupApiError,
      replace: throwReducedMockupApiError,
      scripts: throwReducedMockupApiError,
      url: throwReducedMockupApiError
    }

    Global.containersPerClientAndDatabase[clientId][databaseId][name] = newContainer
  }

  return Global.containersPerClientAndDatabase[clientId][databaseId][name]
}

function findMockedContainer({ client, database, name }) {
  assert(client != null && typeof client === 'object')
  assert(database != null && typeof database === 'object')
  assert(typeof name === 'string' && name !== '', `Invalid argument (type "${typeof name}")`)

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

function mockContainers({ client, database }) {
  assert(client != null && typeof client === 'object')
  assert(database != null && typeof database === 'object')

  const createIfNotExists = options => {
    const { id, throughput } = options
    const container = mockContainer({ client, database, name: id, throughput })
    return Promise.resolve({ resource: container, container })
  }

  const containers = {
    client,
    database,

    createIfNotExists
  }

  return containers
}
