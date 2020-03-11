class CosmosClient {
  constructor() {
    this.database = {
      createIfNotExists: function create(id) {
        return { id, name: 'a mock database' }
      },
      read: function read(id) {
        return { id, name: 'a mock database' }
      },
      containers: {
        createIfNotExists: function create(id) {
          return { id, name: 'a mock collection' }
        },
        read: function read(id) {
          return { id, name: 'a mock collection' }
        }
      },
      items: {
        create: function create(document) {
          return { id: 1, document }
        },
        read: function read(id) {
          if (id === undefined) {
            throw Error('No document id passed to look for.')
          }
          return { id, name: `a mock document ${id}` }
        }
      }
    }

    this.offers = {
      readAll: () => {
        return {
          fetchAll: () => {
            return {
              ressources: []
            }
          }
        }
      }
    }
  }
}

/*
TODO implement test in Jest:
CosmosClient.prototype.queryOffers = () => {
  return {
    toArray: cb => cb(undefined, [{ content: { offerThroughput: 400 } }])
  }
}
*/
module.exports = {
  CosmosClient
}
