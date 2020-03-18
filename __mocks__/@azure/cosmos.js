/* eslint no-use-before-define: ["error", "nofunc"] */

/**
 * Structural information about CosmosClient was taken from "API report" at
 * https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/cosmosdb/cosmos/review/cosmos.api.md
 * as well as
 * https://docs.microsoft.com/en-us/rest/api/cosmos-db/
 */

// @ts-check

const { v1: uuid } = require('uuid')
const assert = require('assert')
const https = require('https')

const RealAzure = jest.requireActual('@azure/cosmos')

const { mockDatabases, findMockedDatabase } = require('./cosmosDatabase')
const { mockOffers, findMockedOffer } = require('./cosmosOffer')
const { throwReducedMockupApiError } = require('./cosmosError')

module.exports = {
  CosmosClient: getMockupCosmosClient(),
  __testHelpers: {
    getConfiguredTestCosmosClient,
    getConfiguredTestDatabaseName
  }
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

function getConfiguredTestCosmosClient() {
  const { TEST_WITH_REAL_COSMOSDB } = process.env

  if (_shallRemoteAzureBeUsedForTests()) {
    const { endpoint, key } = _parseCosmosDbConnectionString(TEST_WITH_REAL_COSMOSDB)
    const agent = new https.Agent({
      rejectUnauthorized: false
    })

    return new RealAzure.CosmosClient({ endpoint, key, agent })
  }

  const CosmosClient = getMockupCosmosClient()
  return new CosmosClient({})
}

function _shallRemoteAzureBeUsedForTests() {
  const { TEST_WITH_REAL_COSMOSDB } = process.env

  const useIntegratedMockup =
    TEST_WITH_REAL_COSMOSDB == null ||
    typeof TEST_WITH_REAL_COSMOSDB !== 'string' ||
    TEST_WITH_REAL_COSMOSDB.trim() === '' ||
    ['false', 'no'].includes(TEST_WITH_REAL_COSMOSDB.trim().toLowerCase())

  if (useIntegratedMockup) {
    return false
  }

  _parseCosmosDbConnectionString(TEST_WITH_REAL_COSMOSDB)

  return true
}

function _parseCosmosDbConnectionString(connectionString) {
  const stringParts = connectionString.split(';')

  assert(stringParts.length === 2, 'Invalid CosmosDB Connection String')

  const match1 = /^AccountEndpoint=(http.+)$/.exec(stringParts[0])
  assert(match1 != null, 'Invalid endpoint in CosmosDB Connection String')
  const endpoint = match1[1]

  const match2 = /^AccountKey=(.+)$/.exec(stringParts[1])
  assert(match2 != null, 'Invalid key in CosmosDB Connection String')
  const key = match2[1]

  return { endpoint, key }
}

function getConfiguredTestDatabaseName() {
  const { TEST_WITH_COSMOSDB_DATABASE } = process.env

  const useDefaultName =
    TEST_WITH_COSMOSDB_DATABASE == null ||
    typeof TEST_WITH_COSMOSDB_DATABASE !== 'string' ||
    TEST_WITH_COSMOSDB_DATABASE.trim() === ''

  if (useDefaultName) {
    return 'testDatabase'
  }

  assert(/^[^/\\#?]{1,255}$/.test(TEST_WITH_COSMOSDB_DATABASE.trim()), 'Invalid test database name')
  assert(
    !['true', 'false', 'yes', 'no', '1', '0'].includes(
      TEST_WITH_COSMOSDB_DATABASE.trim().toLowerCase()
    ),
    'Test database name expected'
  )

  return TEST_WITH_COSMOSDB_DATABASE.trim()
}
