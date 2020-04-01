/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

/**
 * Please note: This mockup of an external module
 * will be automatically activated by jest
 * if this file is situated in "<root>/__mocks__"
 * and you don't explicitly call jest.unmock()
 */

/**
 * Structural information about CosmosClient was taken from "API report" at
 * https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/cosmosdb/cosmos/review/cosmos.api.md
 * as well as
 * https://docs.microsoft.com/en-us/javascript/api/@azure/cosmos/
 */

// @ts-check

const { v1: uuid } = require('uuid')
const assert = require('assert')

const { mockDatabases, findMockedDatabase } = require('./Database')
const { mockOffers, findMockedOffer } = require('./Offer')
const { throwReducedMockupApiError } = require('./Error')

module.exports = {
  CosmosClient: getMockupCosmosClient()
}

function getMockupCosmosClient() {
  return class CosmosClient {
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
}
