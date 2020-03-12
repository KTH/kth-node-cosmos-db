/* eslint-disable no-use-before-define */

/**
 * Structural information about CosmosClient was taken from "API report" at
 * https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/cosmosdb/cosmos/review/cosmos.api.md
 * as well as
 * https://docs.microsoft.com/en-us/rest/api/cosmos-db/
 */

// @ts-check

const { v1: uuid } = require('uuid')
const assert = require('assert')

const { mockDatabases, findMockedDatabase } = require('./cosmosDatabase')
const { mockOffers, findMockedOffer } = require('./cosmosOffer')
const { throwReducedMockupApiError } = require('./cosmosError')

class CosmosClient {
  constructor(options) {
    assert(options != null && typeof options === 'object')

    const client = this
    this.__mock = { options, id: uuid() }

    this.database = databaseName => findMockedDatabase({ client, name: databaseName })
    this.databases = mockDatabases({ client })

    this.offer = offerResourceId => findMockedOffer({ client, offerResourceId })
    this.offers = mockOffers({ client })

    this.getDatabaseAccount = throwReducedMockupApiError
    this.getReadEndpoint = throwReducedMockupApiError
    this.getWriteEndpoint = throwReducedMockupApiError
  }
}

module.exports = {
  CosmosClient
}
