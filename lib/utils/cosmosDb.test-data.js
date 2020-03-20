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
  const allCallbacks = {
    createDatabase: _getTestDataAboutCreateDatabase,
    createContainer: _getTestDataAboutCreateContainer,
    getOneContainerByClient: _getTestDataAboutGetOneContainerByClient,
    getContainerByDatabase: _getTestDataAboutGetContainerByDatabase,
    getContainerThroughput: _getTestDataAboutGetContainerThroughput,
    setContainerThroughput: _getTestDataAboutSetContainerThroughput
  }

  if (target === 'function-list') {
    return Object.keys(allCallbacks)
  }

  if (allCallbacks[target] == null) {
    throw new Error(`Can't find test data of target "${target}"`)
  }

  const testDataCallback = allCallbacks[target]
  return testDataCallback()
}

function _getTestDataAboutCreateDatabase() {
  const { cosmosClient: client } = Global
  const { databaseId } = Global.testData

  const setup = {
    tests: []
  }

  setup.tests.push({
    description: 'valid arguments',
    getArgs: () => [client, databaseId],
    checkResult: result => {
      expect(result).toBeObject()
      expect(result.constructor.name).toBe('Database')
      expect(result.client).toBe(client)
      expect(result.id).toBe(databaseId)
    }
  })

  setup.tests.push({
    description: 'invalid client',
    getArgs: () => [{}, databaseId],
    error: 'Invalid CosmosDB client'
  })
  setup.tests.push({
    description: 'invalid database name',
    getArgs: () => [client, ''],
    error: 'Invalid CosmosDB database name'
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

function _getTestDataAboutGetOneContainerByClient() {
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

function _getTestDataAboutGetContainerByDatabase() {
  const { databaseId, containerId } = Global.testData

  const setup = {
    prepareDatabase: true,
    prepareContainer: true,
    tests: []
  }

  setup.tests.push({
    description: 'valid arguments',
    getArgs: ({ database }) => [containerId, database],
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
    getArgs: ({ database }) => ['', database],
    error: 'Invalid CosmosDB container name'
  })
  setup.tests.push({
    description: 'invalid database',
    getArgs: () => [containerId, {}],
    error: 'Invalid CosmosDB database'
  })

  setup.tests.push({
    description: 'no arguments',
    error: true
  })

  return setup
}

function _getTestDataAboutGetContainerThroughput() {
  const setup = {
    prepareDatabase: true,
    prepareContainer: true,
    tests: []
  }

  setup.tests.push({
    description: 'valid arguments',
    getArgs: ({ container }) => [container],
    checkResult: throughput => {
      expect(throughput).toBeNumber()
      expect(throughput).toBeGreaterThan(0)
    }
  })

  setup.tests.push({
    description: 'invalid container',
    getArgs: () => [{}],
    error: 'Invalid CosmosDB container'
  })

  setup.tests.push({
    description: 'no arguments',
    error: true
  })

  return setup
}

function _getTestDataAboutSetContainerThroughput() {
  const { initialThroughput } = Global.testData

  const setup = {
    prepareDatabase: true,
    prepareContainer: true,
    tests: []
  }

  setup.tests.push({
    description: 'valid arguments',
    getArgs: ({ container }) => [container, initialThroughput],
    checkResult: result => {
      expect(result).toBeNull()
    }
  })

  setup.tests.push({
    description: 'invalid container',
    getArgs: () => [{}, initialThroughput],
    error: 'Invalid CosmosDB container'
  })
  setup.tests.push({
    description: 'invalid throughput',
    getArgs: ({ container }) => [container, 0],
    error: 'Invalid CosmosDB throughput'
  })

  setup.tests.push({
    description: 'no arguments',
    error: true
  })

  return setup
}
