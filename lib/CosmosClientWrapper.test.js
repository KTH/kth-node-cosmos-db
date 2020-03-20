/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

jest.mock('@azure/cosmos')
jest.mock('./utils/cosmosDb')

const { CosmosClient } = require('@azure/cosmos')

// eslint-disable-next-line import/newline-after-import
const CosmosDbUtils = require('./utils/cosmosDb')
const { _listAllCalls, _clearAllCalls } = CosmosDbUtils

const { getTestOptions } = require('./utils/options.test-data')

const CosmosClientWrapper = require('./CosmosClientWrapper')

describe(`Class CosmosClientWrapper`, () => {
  runTestsAboutConstructor()
  runTestsAboutInit()
  // runTestsAboutGetCollectionThroughput()
  // runTestsAboutListCollectionsWithThroughput()
  runTestsAboutIncreaseCollectionThroughput()
  runTestsAboutUpdateCollectionThroughput()
  // runTestsAboutUpdateAllCollectionsThroughput()
  // runTestsAboutResetThroughput()
})

function runTestsAboutConstructor() {
  describe('- when instantiated', () => {
    const validOptions = getTestOptions('valid')
    const invalidOoptions = getTestOptions('missingKey')

    it('with valid options - succeeds', () => {
      const runner = () => new CosmosClientWrapper(validOptions)

      runner()
    })

    it('with invalid options - FAILS', () => {
      const runner = () => new CosmosClientWrapper(invalidOoptions)

      expect(runner).toThrow('required config options are missing')
    })

    it('with no options - FAILS', () => {
      const runner = () => new CosmosClientWrapper()

      expect(runner).toThrow('need to pass a config object')
    })

    it('- does not yet access CosmosDb helper', () => {
      _clearAllCalls()

      const runner = () => new CosmosClientWrapper(validOptions)
      runner()

      expect(_listAllCalls()).toBeNull()
    })
  })
}

function runTestsAboutInit() {
  describe('has method init() that', () => {
    const validOptions = getTestOptions('withTwoCollections')

    it('prepares the database and all given collections', async () => {
      const { db: databaseId } = validOptions

      const client = new CosmosClientWrapper(validOptions)

      _clearAllCalls()
      await client.init()

      const allCalls = _listAllCalls()
      expect(allCalls).toBeObject()
      expect(allCalls).toContainAllKeys(['createDatabase', 'createContainer'])

      const databaseCall = allCalls.createDatabase
      expect(databaseCall).toHaveLength(1)
      expect(databaseCall[0]).toHaveLength(2)
      expect(databaseCall[0][0]).toBeInstanceOf(CosmosClient)
      expect(databaseCall[0][1]).toBe(databaseId)

      const containerCalls = allCalls.createContainer
      expect(containerCalls).toHaveLength(2)
      expect(containerCalls[0]).toHaveLength(3)
      expect(containerCalls[1]).toHaveLength(3)
    })
  })
}

function runTestsAboutIncreaseCollectionThroughput() {
  describe('has method increaseCollectionThroughput() that', () => {
    const validOptions = getTestOptions('valid')

    it('queries an offer and updates it', async () => {
      const { name: collectionName, throughput } = validOptions.collections[0]

      const client = new CosmosClientWrapper(validOptions)
      await client.init()

      // @ts-ignore
      CosmosDbUtils.getContainerThroughput.mockResolvedValue(throughput)

      _clearAllCalls()
      const result = await client.increaseCollectionThroughput(collectionName)

      expect(result).toBeGreaterThan(throughput)

      const allCalls = _listAllCalls()
      expect(allCalls).toBeObject()
      expect(allCalls).toContainAllKeys([
        'getOneContainerByClient',
        'getContainerThroughput',
        'setContainerThroughput'
      ])

      const containerCall = allCalls.getOneContainerByClient
      expect(containerCall).toHaveLength(1)
      expect(containerCall[0]).toHaveLength(2)

      const readThroughputCall = allCalls.getContainerThroughput
      expect(readThroughputCall).toHaveLength(1)
      expect(readThroughputCall[0]).toHaveLength(1)

      const writeThroughputCall = allCalls.setContainerThroughput
      expect(writeThroughputCall).toHaveLength(1)
      expect(writeThroughputCall[0]).toHaveLength(2)
    })
  })
}

function runTestsAboutUpdateCollectionThroughput() {
  describe('has method updateCollectionThroughput() that', () => {
    const validOptions = getTestOptions('valid')

    it('can change the throughput of a collection', async () => {
      const { name: collectionName, throughput } = validOptions.collections[0]
      const newThroughput = throughput - 100

      const client = new CosmosClientWrapper(validOptions)
      await client.init()

      // @ts-ignore
      CosmosDbUtils.getContainerThroughput.mockResolvedValue(throughput)

      _clearAllCalls()
      const result = await client.updateCollectionThroughput(collectionName, newThroughput)

      expect(result).toBe(newThroughput)

      const allCalls = _listAllCalls()
      expect(allCalls).toBeObject()
      expect(allCalls).toContainAllKeys([
        'getOneContainerByClient',
        'getContainerThroughput',
        'setContainerThroughput'
      ])

      const containerCall = allCalls.getOneContainerByClient
      expect(containerCall).toHaveLength(1)
      expect(containerCall[0]).toHaveLength(2)

      const readThroughputCall = allCalls.getContainerThroughput
      expect(readThroughputCall).toHaveLength(1)
      expect(readThroughputCall[0]).toHaveLength(1)

      const writeThroughputCall = allCalls.setContainerThroughput
      expect(writeThroughputCall).toHaveLength(1)
      expect(writeThroughputCall[0]).toHaveLength(2)
    })
  })
}

function runTestsAboutUpdateAllCollectionsThroughput() {
  describe('has method updateAllCollectionThroughput() that', () => {
    const validOptions = getTestOptions('valid')

    it('can change the throughput of a collection', async () => {
      const { name: collectionName, throughput } = validOptions.collections[0]
      const newThroughput = throughput - 100

      const client = new CosmosClientWrapper(validOptions)
      await client.init()

      // @ts-ignore
      CosmosDbUtils.getContainerThroughput.mockResolvedValue(throughput)

      _clearAllCalls()
      const result = await client.updateCollectionThroughput(collectionName, newThroughput)

      expect(result).toBe(newThroughput)

      const allCalls = _listAllCalls()
      expect(allCalls).toBeObject()
      expect(allCalls).toContainAllKeys([
        'getOneContainerByClient',
        'getContainerThroughput',
        'setContainerThroughput'
      ])

      const containerCall = allCalls.getOneContainerByClient
      expect(containerCall).toHaveLength(1)
      expect(containerCall[0]).toHaveLength(2)

      const readThroughputCall = allCalls.getContainerThroughput
      expect(readThroughputCall).toHaveLength(1)
      expect(readThroughputCall[0]).toHaveLength(1)

      const writeThroughputCall = allCalls.setContainerThroughput
      expect(writeThroughputCall).toHaveLength(1)
      expect(writeThroughputCall[0]).toHaveLength(2)
    })
  })
}

function runTestsAboutPublicMethods() {
  describe.skip(`getClient() returns an object with`, () => {
    test('Dont break when calling updateAllCollectionsThroughput in development', () => {
      const client = getClient()
      let error

      try {
        client.updateAllCollectionsThroughput()
      } catch (e) {
        error = e
      }

      expect(error).toBe(undefined)
    })

    test('After a client is created. You should be able to create databases and collections.', async () => {
      await getClient().init()
    })

    test("You can increase a named collection's throughput, by a default increase.", async () => {
      const client = getClient()

      const throughput = await client.increaseCollectionThroughput('test')
      expect(throughput).toEqual(600)
    })

    test('You can increase a named collections throughput, by a specific increase.', async () => {
      const client = getClient()

      const throughput = await client.updateCollectionThroughput('test', 800)
      expect(throughput).toEqual(800)
    })

    test('You can get a named collections throughput.', async () => {
      const client = getClient()

      const offer = await client.getCollectionThroughput('test')
      expect(offer.content.offerThroughput).toEqual(400)
    })

    test('You can increase all collections throughput, by a default increase.', async () => {
      const client = getClient()

      await client.updateAllCollectionsThroughput()
    })

    test.todo('updateAllCollectionsThroughput increases throughput')

    test('listCollectionsWithThroughput', async () => {
      const client = getClient()

      const collections = await client.listCollectionsWithThroughput()
      expect(collections.length).toEqual(2)
      expect(collections[0]).to.eql({ collection: 'test', throughput: 400 })
      expect(collections[1]).to.eql({ collection: 'test2', throughput: 400 })
    })

    test('resetThroughput', async () => {
      const client = getClient()

      await client.resetThroughput()
    })

    test.todo('resetThrought decreases throughput')
  })
}
