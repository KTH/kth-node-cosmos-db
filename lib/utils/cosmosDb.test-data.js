/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

const { CosmosDb: CosmosDbHelpers } = require('../../test/lib')

module.exports = {
  getGlobalTestData,
  getTestData
}

const Global = {
  cosmosClient: CosmosDbHelpers.getCosmosClientForUnitTests(),
  testData: {
    databaseId: CosmosDbHelpers.getDatabaseNameForUnitTests(),
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
  const { databaseId, containerId: containerName, initialThroughput: throughput } = Global.testData

  const setup = {
    prepareDatabase: true,
    tests: []
  }

  setup.tests.push({
    description: 'valid arguments',
    getArgs: ({ database }) => [{ database, containerName, throughput }],
    checkResult: result => {
      expect(result).toBeObject()
      expect(result.constructor.name).toBe('Container')
      expect(result.database).toBeObject()
      expect(result.database.id).toEqual(databaseId)
      expect(result.id).toEqual(containerName)
    }
  })

  setup.tests.push({
    description: 'invalid database',
    getArgs: () => [{ database: {}, containerName, throughput }],
    error: 'Invalid CosmosDB database'
  })
  setup.tests.push({
    description: 'invalid container name',
    getArgs: ({ database }) => [{ database, containerName: '', throughput }],
    error: 'Invalid CosmosDB container name'
  })
  setup.tests.push({
    description: 'invalid throughput',
    getArgs: ({ database }) => [{ database, containerName, throughput: 0 }],
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
      if (result.database.id !== databaseId) {
        // eslint-disable-next-line no-console
        console.error(
          'WARNING:\nGot unexpected database while testing getOneContainerByClient() ' +
            `("${result.database.id}" instead of "${databaseId}")\n` +
            `- Do you have more than one database with a container named "${containerId}"?`
        )
      }
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
      expect(result).toBe(true)
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
