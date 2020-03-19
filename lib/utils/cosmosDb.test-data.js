/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

module.exports = {
  getGlobalTestData,
  getTestData
}

const AzureHelpers = require('../../__mocks__/@azure/cosmos.test-helpers')

const Global = {
  cosmosClient: AzureHelpers.getConfiguredTestCosmosClient(),
  testData: {
    databaseId: AzureHelpers.getConfiguredTestDatabaseName(),
    containerId: 'testContainer',
    initialThroughput: 700
  }
}

function getGlobalTestData() {
  return Global
}

function getTestData(target) {
  switch (target) {
    case 'createDatabase':
      return _getTestDataAboutCreateDatabase()
    case 'createContainer':
      return _getTestDataAboutCreateContainer()
    case 'getContainerByClient':
      return _getTestDataAboutGetContainerByClient()
    case 'getContainerOfferByClient':
      return _getTestDataAboutGetContainerOfferByClient()
    case 'increaseThroughputByName':
      return _getTestDataAboutIncreaseThroughputByName()
    default:
      throw new Error(`Can't find test data of target "${target}"`)
  }
}

function _getTestDataAboutCreateDatabase() {
  const { cosmosClient: client } = Global
  const { databaseId } = Global.testData

  const setup = {
    tests: []
  }

  setup.tests.push({
    description: 'valid arguments',
    getArgs: () => [databaseId, client],
    checkResult: result => {
      expect(result).toBeObject()
      expect(result.constructor.name).toBe('Database')
      expect(result.client).toBe(client)
      expect(result.id).toBe(databaseId)
    }
  })

  setup.tests.push({
    description: 'invalid database name',
    getArgs: () => ['', client],
    error: 'Invalid CosmosDB database name'
  })
  setup.tests.push({
    description: 'invalid client',
    getArgs: () => [databaseId, {}],
    error: 'Invalid CosmosDB client'
  })

  setup.tests.push({
    description: 'no arguments',
    error: true
  })

  return setup
}

function _getTestDataAboutCreateContainer() {
  const { databaseId, containerId, initialThroughput } = Global.testData

  const setup = {
    prepareDatabase: true,
    tests: []
  }

  setup.tests.push({
    description: 'valid arguments',
    getArgs: ({ database }) => [database, containerId, initialThroughput],
    checkResult: result => {
      expect(result).toBeObject()
      expect(result.constructor.name).toBe('Container')
      expect(result.database).toBeObject()
      expect(result.database.id).toEqual(databaseId)
      expect(result.id).toEqual(containerId)
    }
  })

  setup.tests.push({
    description: 'invalid database',
    getArgs: () => [{}, containerId, initialThroughput],
    error: 'Invalid CosmosDB database'
  })
  setup.tests.push({
    description: 'invalid container name',
    getArgs: ({ database }) => [database, '', initialThroughput],
    error: 'Invalid CosmosDB container name'
  })
  setup.tests.push({
    description: 'invalid throughput',
    getArgs: ({ database }) => [database, containerId, 0],
    error: 'Invalid CosmosDB throughput'
  })

  setup.tests.push({
    description: 'no arguments',
    error: true
  })

  return setup
}

function _getTestDataAboutGetContainerByClient() {
  const { cosmosClient: client } = Global
  const { databaseId, containerId } = Global.testData

  const setup = {
    prepareDatabase: true,
    prepareContainer: true,
    tests: []
  }

  setup.tests.push({
    description: 'valid arguments',
    getArgs: () => [containerId, client],
    checkResult: result => {
      expect(result).toBeObject()
      expect(result.constructor.name).toBe('Container')
      expect(result.database).toBeObject()
      expect(result.database.id).toEqual(databaseId)
      expect(result.id).toEqual(containerId)
    }
  })

  setup.tests.push({
    description: 'invalid container name',
    getArgs: () => ['', client],
    error: 'Invalid CosmosDB container name'
  })
  setup.tests.push({
    description: 'invalid client',
    getArgs: () => [containerId, {}],
    error: 'Invalid CosmosDB client'
  })

  setup.tests.push({
    description: 'no arguments',
    error: true
  })

  return setup
}

function _getTestDataAboutGetContainerOfferByClient() {
  const { cosmosClient: client } = Global
  const { containerId } = Global.testData

  const setup = {
    prepareDatabase: true,
    prepareContainer: true,
    tests: []
  }

  setup.tests.push({
    description: 'valid arguments',
    getArgs: () => [containerId, client],
    checkResult: offerDefinition => {
      expect(offerDefinition).toBeObject()
      expect(offerDefinition.content).toBeObject()
      expect(offerDefinition.content.offerThroughput).toBeNumber()
      expect(offerDefinition.content.offerThroughput).toBeGreaterThan(0)
      expect(offerDefinition.offerResourceId).toMatch(/\w/)
    }
  })

  setup.tests.push({
    description: 'invalid container name',
    getArgs: () => ['', client],
    error: 'Invalid CosmosDB container name'
  })
  setup.tests.push({
    description: 'invalid client',
    getArgs: () => [containerId, {}],
    error: 'Invalid CosmosDB client'
  })

  setup.tests.push({
    description: 'no arguments',
    error: true
  })

  return setup
}

function _getTestDataAboutIncreaseThroughputByName() {
  const { cosmosClient: client } = Global
  const { containerId, initialThroughput } = Global.testData

  const setup = {
    prepareDatabase: true,
    prepareContainer: true,
    tests: []
  }

  setup.tests.push({
    description: 'valid arguments',
    getArgs: () => [containerId, initialThroughput + 100, client],
    checkResult: result => expect(result).toBeUndefined()
  })

  setup.tests.push({
    description: 'invalid container name',
    getArgs: () => ['', initialThroughput + 100, client],
    error: 'Invalid CosmosDB container name'
  })
  setup.tests.push({
    description: 'invalid throughput',
    getArgs: () => [containerId, 0, client],
    error: 'Invalid CosmosDB throughput'
  })
  setup.tests.push({
    description: 'invalid client',
    getArgs: () => [containerId, initialThroughput + 100, {}],
    error: 'Invalid CosmosDB client'
  })

  setup.tests.push({
    description: 'no arguments',
    error: true
  })

  return setup
}
