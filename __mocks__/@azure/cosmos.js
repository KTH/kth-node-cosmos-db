/* eslint-disable no-use-before-define */

/**
 * Structural information about CosmosClient taken from API report at
 * https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/cosmosdb/cosmos/review/cosmos.api.md
 */

class CosmosClient {
  constructor() {
    const client = this
    this.database = id => mockDatabase({ client, id })
    this.databases = mockDatabases({ client })
    this.offer = id => mockOffer({ client, id })
    this.offers = mockOffers({ client })
  }
}

module.exports = {
  CosmosClient
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
  const database = {
    client,
    id
  }

  database.container = id2 => mockContainer({ client, id: id2 })
  database.containers = mockContainers({ client, database })

  return database
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
  const container = {
    _client: client,
    database,
    id,
    _throughput: throughput
  }

  return container
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
  const offer = {
    client,
    id,
    read: jest.fn(),
    replace: jest.fn(),
    url: jest.fn()
  }

  return offer
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

// /*
// TODO implement test in Jest:
// CosmosClient.prototype.queryOffers = () => {
//   return {
//     toArray: cb => cb(undefined, [{ content: { offerThroughput: 400 } }])
//   }
// }
// */
// module.exports = {
//   CosmosClient
// }
