/* eslint-disable no-use-before-define */

/**
 * Structural information about CosmosClient was taken from "API report" at
 * https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/cosmosdb/cosmos/review/cosmos.api.md
 */

class CosmosClient {
  constructor(options) {
    const client = this

    this._options = options

    this.database = id => mockDatabase({ client, id })
    this.databases = mockDatabases({ client })
    this.offer = id => mockOffer({ client, id })
    this.offers = mockOffers({ client })

    this.getDatabaseAccount = jest.fn()
    this.getReadEndpoint = jest.fn()
    this.getWriteEndpoint = jest.fn()
  }
}

module.exports = {
  CosmosClient
}

const Global = {
  databases: {},
  containers: {},
  offers: {}
}

function mockDatabases({ client }) {
  const databases = {
    client
  }

  databases.createIfNotExists = options => {
    const { id } = options
    const database = mockDatabase({ client, id })
    return Promise.resolve({ resource: database, database })
  }

  return databases
}

function mockDatabase({ client, id }) {
  if (Global.databases[id] == null) {
    Global.databases[id] = {
      client,
      id
    }

    Global.databases[id].container = id2 => mockContainer({ client, id: id2 })
    Global.databases[id].containers = mockContainers({ client, database: Global.databases[id] })
  }

  return Global.databases[id]
}

function mockContainers({ client, database }) {
  const containers = {
    client,
    database
  }

  containers.createIfNotExists = options => {
    const { id, throughput } = options
    const container = mockContainer({ client, database, id, throughput })
    return Promise.resolve({ resource: container, container })
  }

  return containers
}

function mockContainer({ client, database, id, throughput }) {
  if (Global.containers[database] == null) {
    Global.containers[database] = {}
  }

  if (Global.containers[database][id] == null) {
    Global.containers[database][id] = {
      database,
      id,

      _client: client,
      _throughput: throughput,

      conflict: jest.fn(),
      conflicts: jest.fn(),
      delete: jest.fn(),
      getQueryPlan: jest.fn(),
      item: jest.fn(),
      items: jest.fn(),
      read: jest.fn(),
      readPartitionKeyDefinition: jest.fn(),
      readPartitionKeyRanges: jest.fn(),
      replace: jest.fn(),
      scripts: jest.fn(),
      url: jest.fn()
    }
  }

  return Global.containers[database][id]
}

function mockOffers({ client }) {
  const offers = {
    client,
    query: jest.fn()
  }

  const _offerDefinition = mockOfferDefinition({ client, id: 'dummy' })
  const _feedResponse = {
    resources: [_offerDefinition]
  }
  const _queryIterator = {
    fetchAll: () => Promise.resolve(_feedResponse)
  }
  offers.readAll = () => _queryIterator

  return offers
}

function mockOffer({ client, id }) {
  if (Global.offers[id] == null) {
    Global.offers[id] = {
      client,
      id,
      read: jest.fn(),
      replace: jest.fn(),
      url: jest.fn()
    }
  }

  return Global.offers[id]
}

function mockOfferDefinition({ client, id }) {
  const offerDefinition = {
    _client: client,
    id,
    content: {
      offerThroughput: 79,
      offerIsRUPerMinuteThroughputEnabled: false
    }
  }

  return offerDefinition
}

// class CosmosClient {
//   constructor() {
//     this.database = {
//       createIfNotExists: function create(id) {
//         return { id, name: 'a mock database' }
//       },
//       read: function read(id) {
//         return { id, name: 'a mock database' }
//       },
//       containers: {
//         createIfNotExists: function create(id) {
//           return { id, name: 'a mock collection' }
//         },
//         read: function read(id) {
//           return { id, name: 'a mock collection' }
//         }
//       },
//       items: {
//         create: function create(document) {
//           return { id: 1, document }
//         },
//         read: function read(id) {
//           if (id === undefined) {
//             throw Error('No document id passed to look for.')
//           }
//           return { id, name: `a mock document ${id}` }
//         }
//       }
//     }

//     this.offers = {
//       readAll: () => {
//         return {
//           fetchAll: () => {
//             return {
//               ressources: []
//             }
//           }
//         }
//       }
//     }
//   }
// }
