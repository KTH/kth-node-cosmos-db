/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

module.exports = {
  getCosmosClientForUnitTests,
  getDatabaseNameForUnitTests,

  parseConnectionStringIntoUrl,
  composeUrlIntoPrimaryConnectionString,
  composeUrlIntoMongoConnectionString,
}

const assert = require('assert')
const https = require('https')

const AzureMockup = jest.requireActual('../../__mocks__/@azure/cosmos')
const RealAzure = jest.requireActual('@azure/cosmos')

/**
 * @returns {object} instance of CosmosClient
 *      (either mockup or configured Azure connection)
 */
function getCosmosClientForUnitTests() {
  const envVariableName = 'UNIT_TEST_COSMOSDB_CONNECTION'
  const connectionString = process.env[envVariableName]

  if (_isRealAzureUsedForTests(connectionString)) {
    const { endpoint, key } = parseConnectionStringIntoUrl(connectionString)

    const agent = new https.Agent({ rejectUnauthorized: false })

    // eslint-disable-next-line no-console
    console.log(
      `Azure CosmosDB: Using real connection for unit tests (configured with environment variable ${envVariableName})`
    )

    return new RealAzure.CosmosClient({ endpoint, key, agent })
  }

  // eslint-disable-next-line no-console
  console.log('Azure CosmosDB: Using internal mockup for unit tests')

  return new AzureMockup.CosmosClient({})
}

/**
 * @returns {string}
 */
function getDatabaseNameForUnitTests() {
  const envVariableName = 'UNIT_TEST_COSMOSDB_DATABASE'
  const databaseName = process.env[envVariableName]

  const useDefaultName =
    databaseName == null || typeof databaseName !== 'string' || databaseName.trim() === ''

  if (useDefaultName) {
    return 'testDatabase'
  }

  assert(
    /^[^/\\#?]{1,255}$/.test(databaseName.trim()),
    `Invalid test database name ${databaseName}`
  )

  assert(
    !['true', 'false', 'yes', 'no', '1', '0'].includes(databaseName.trim().toLowerCase()),
    'Test database name expected'
  )

  return databaseName.trim()
}

/**
 * @param {string} connectionString
 *    Primary Connection String or Mongo Connection String
 *    of a CosmosDB setup
 *
 * @returns {object} Object with those properties:
 *    - url: Node.js URL object with all found data
 *    - endpoint: Prepared option for class CosmosClient
 *    - key: Prepared option for class CosmosClient
 * @throws
 *    in case of invalid or missing input
 */
function parseConnectionStringIntoUrl(connectionString) {
  assert(
    typeof connectionString === 'string' && connectionString !== '',
    'Missing CosmosDB Connection String'
  )

  const stringParts = connectionString.split(';')

  let url
  switch (stringParts.length) {
    case 1:
      url = _parseMongoConnectionString(connectionString)
      break
    case 2:
      url = _parsePrimaryConnectionString(stringParts[0], stringParts[1])
      break
    default:
      throw new Error('Invalid CosmosDB Connection String')
  }

  const neededUrlParts = ['protocol', 'hostname', 'port', 'origin', 'username', 'password']
  neededUrlParts.forEach(key => {
    assert(url[key] !== '', `Missing ${key} in CosmosDB Connection String`)
  })

  const endpoint = url.origin
  const key = decodeURIComponent(url.password)

  return { url, endpoint, key }
}

/**
 * @param {object} options
 * @param {URL} options.url
 * @param {string} [options.databaseName]
 * @param {boolean} [options.usePortFromUrl]
 * @param {boolean} [options.disableSslRejection]
 *
 * @returns {object} Object with those properties:
 *    - "fullString": Mongo Connection String with username and password
 *    - "basicString": Mongo Connection String w/o username and password
 *    - "user": username
 *    - "pass": password
 */
function composeUrlIntoMongoConnectionString({
  url,
  databaseName = null,
  disableSslRejection = false,
}) {
  const newUrl = new URL(url.href)
  newUrl.protocol = 'http:'
  newUrl.port = '10255'
  newUrl.pathname = databaseName ? `/${databaseName}` : '/'

  const useSsl = url.protocol === 'https:'

  const searchItems = []
  searchItems.push(`ssl=${String(useSsl)}`)
  if (useSsl && disableSslRejection) {
    searchItems.push('tlsAllowInvalidCertificates=true')
  }
  // searchItems.push('replicaSet=globaldb')
  newUrl.search = '?' + searchItems.join('&')

  const fullString = newUrl.href.replace(/^http:/, 'mongodb:').replace(/\+/g, '%2B')

  newUrl.username = ''
  newUrl.password = ''
  const basicString = newUrl.href.replace(/^http:/, 'mongodb:')
  const user = url.username
  const pass = decodeURIComponent(url.password)

  return { fullString, basicString, user, pass }
}

/**
 * @param {object} options
 * @param {URL} options.url
 *
 * @returns {string} Primary Connection String
 */
function composeUrlIntoPrimaryConnectionString({ url }) {
  const key = decodeURIComponent(url.password)

  const endpointPart = `AccountEndpoint=${url.origin}`
  const keyPart = `AccountKey=${key}`

  const connectionString = `${endpointPart};${keyPart}`
  return connectionString
}

function _parseMongoConnectionString(connectionString) {
  const url = new URL(connectionString)

  assert(
    url.protocol === 'mongodb:',
    `Invalid protocol in Mongo Connection String (${url.protocol})`
  )

  url.protocol = url.search === '?ssl=true' ? 'hhtps:' : 'http:'
  url.search = ''

  return url
}

function _parsePrimaryConnectionString(endpointPart, keyPart) {
  const match1 = /^AccountEndpoint=(http.+)$/.exec(endpointPart)
  const match2 = /^AccountKey=(.+)$/.exec(keyPart)

  assert(match1 != null, 'Invalid endpoint part in CosmosDB Connection String')
  assert(match2 != null, 'Invalid key part in CosmosDB Connection String')

  const url = new URL(match1[1])
  url.username = url.hostname
  // eslint-disable-next-line prefer-destructuring
  url.password = match2[1]

  return url
}

function _isRealAzureUsedForTests(connectionString) {
  const useIntegratedMockup =
    connectionString == null ||
    typeof connectionString !== 'string' ||
    connectionString.trim() === '' ||
    ['false', 'no'].includes(connectionString.trim().toLowerCase())

  return useIntegratedMockup === false
}
