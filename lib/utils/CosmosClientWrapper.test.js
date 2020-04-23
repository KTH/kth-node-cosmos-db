/* eslint no-use-before-define: ["error", "nofunc"] */
/* eslint require-await: "error" */

// @ts-check

jest.mock('@azure/cosmos')

jest.mock('./cosmosDb')

const { CosmosClient } = require('@azure/cosmos')

// eslint-disable-next-line import/newline-after-import
const MockedCosmosDbUtils = require('./cosmosDb')
const {
  _resetAllMocks: resetAllCosmosDbMocks,
  _listAllCalls: listAllCosmosDbCalls,
  _clearAllCalls: clearAllCosmosDbCalls
} = MockedCosmosDbUtils

const RealCosmosDbUtils = jest.requireActual('./cosmosDb')

const { getTestOptions, getAsyncRunner } = require('./CosmosClientWrapper.test-data')
const CosmosClientWrapper = require('./CosmosClientWrapper')

describe(`Class CosmosClientWrapper`, () => {
  beforeEach(resetAllCosmosDbMocks)

  runTestsAboutConstructor()
  runTestsAboutGetOption()
  runTestsAboutSetOption()
  runTestsAboutInit()
  runTestsAboutCreateMongooseModel()
  runTestsAboutGetCollectionThroughput()
  runTestsAboutListCollectionsWithThroughput()
  runTestsAboutIncreaseCollectionThroughput()
  runTestsAboutUpdateCollectionThroughput()
  runTestsAboutUpdateAllCollectionsThroughput()
  runTestsAboutResetThroughput()
})

function runTestsAboutConstructor() {
  describe('has constructor that', () => {
    const validOptions = getTestOptions('valid')
    const invalidOptions = getTestOptions('missingUsername')

    it('- when used with valid options - succeeds', () => {
      const runner = () => new CosmosClientWrapper(validOptions)

      runner()
    })

    it('- when used with invalid options - FAILS', () => {
      const runner = () => new CosmosClientWrapper(invalidOptions)

      expect(runner).toThrow('Required keys missing: username')
    })

    it('- when used with no options - FAILS', () => {
      // @ts-ignore
      const runner = () => new CosmosClientWrapper()

      expect(runner).toThrow('Missing input')
    })

    it('does not use any CosmosDbUtils function', () => {
      clearAllCosmosDbCalls()

      const runner = () => new CosmosClientWrapper(validOptions)
      runner()

      expect(listAllCosmosDbCalls()).toBeNull()
    })

    it.todo('reacts to invalid structure of option "collections" as expected')
    it.todo('uses option "retryStrategy" as expected')
    it.todo('uses option "port" as expected')
    it.todo('reacts to invalid hostname with port as expected')
    it.todo('uses option "disableSslRejection" as expected')
    it.todo('uses option "createCollectionWithMongoose" as expected')
  })
}

function runTestsAboutGetOption() {
  describe('has method getOption() that', () => {
    it.todo('behaves as expected')
  })
}

function runTestsAboutSetOption() {
  describe('has method setOption() that', () => {
    it.todo('behaves as expected')
  })
}

function runTestsAboutInit() {
  const asyncRunner = getAsyncRunner('init')

  describe('has method init() that', () => {
    it('uses CosmosDbUtils as expected', async () => {
      await asyncRunner()
      const allCalls = listAllCosmosDbCalls()

      expect([
        'getDatabase',
        'createDatabase',
        'getContainerByDatabase',
        'createContainer'
      ]).toContainValues(Object.keys(allCalls))

      _expectLengthOfCallsData(allCalls.getDatabase, 1, [3])
      _expectLengthOfCallsData(allCalls.getContainerByDatabase, 2, [2, 2])
    })

    it("- if database doesn't yet exist - uses CosmosDbUtils as expected", async () => {
      // @ts-ignore
      MockedCosmosDbUtils.getDatabase.mockResolvedValueOnce(null)

      const { db: databaseName } = await asyncRunner()
      const allCalls = listAllCosmosDbCalls()

      _expectLengthOfCallsData(allCalls.createDatabase, 1, [2])
      expect(allCalls.createDatabase[0][0]).toBeInstanceOf(CosmosClient)
      expect(allCalls.createDatabase[0][1]).toBe(databaseName)
    })

    it("- if first collection doesn't yet exist - uses CosmosDbUtils as expected", async () => {
      // @ts-ignore
      MockedCosmosDbUtils.getContainerByDatabase.mockResolvedValueOnce(null)

      const { collections } = await asyncRunner()
      const allCalls = listAllCosmosDbCalls()

      _expectLengthOfCallsData(allCalls.createContainer, 1, [4])

      const callArg = allCalls.createContainer[0][0]
      expect(callArg).toBeObject()
      expect(callArg.containerName).toBe(collections[0].name)
    })

    it("- if second collection doesn't yet exist - uses CosmosDbUtils as expected", async () => {
      // @ts-ignore
      MockedCosmosDbUtils.getContainerByDatabase.mockResolvedValueOnce({
        id: 'dummy testContainer'
      })
      // @ts-ignore
      MockedCosmosDbUtils.getContainerByDatabase.mockResolvedValueOnce(null)

      const { collections } = await asyncRunner()
      const allCalls = listAllCosmosDbCalls()

      _expectLengthOfCallsData(allCalls.createContainer, 1, [4])

      const callArg = allCalls.createContainer[0][0]
      expect(callArg).toBeObject()
      expect(callArg.containerName).toBe(collections[1].name)
    })

    it("- if both collections don't exist, yet - uses CosmosDbUtils as expected", async () => {
      // @ts-ignore
      MockedCosmosDbUtils.getContainerByDatabase.mockResolvedValueOnce(null)
      // @ts-ignore
      MockedCosmosDbUtils.getContainerByDatabase.mockResolvedValueOnce(null)

      const { collections } = await asyncRunner()
      const allCalls = listAllCosmosDbCalls()

      _expectLengthOfCallsData(allCalls.createContainer, 2, [4, 4])

      const callArg1 = allCalls.createContainer[0][0]
      expect(callArg1).toBeObject()
      expect(callArg1.containerName).toBe(collections[0].name)

      const callArg2 = allCalls.createContainer[1][0]
      expect(callArg2).toBeObject()
      expect(callArg2.containerName).toBe(collections[1].name)
    })

    it('succeeds with unmocked CosmosDbUtils', async () => {
      _unmockCosmosDb()

      await asyncRunner()
    })

    it('- if database creation fails - FAILS', async () => {
      // @ts-ignore
      MockedCosmosDbUtils.getDatabase.mockResolvedValueOnce(null)
      // @ts-ignore
      MockedCosmosDbUtils.createDatabase.mockRejectedValueOnce(new Error('test error'))

      await expect(asyncRunner()).rejects.toThrow('test error')
    })

    it('- if first container creation fails - FAILS', async () => {
      // @ts-ignore
      MockedCosmosDbUtils.getContainerByDatabase.mockResolvedValueOnce(null)
      // @ts-ignore
      MockedCosmosDbUtils.createContainer.mockRejectedValueOnce(new Error('test error'))

      await expect(asyncRunner()).rejects.toThrow('test error')
    })

    it('- if seconds container creation fails - FAILS', async () => {
      // @ts-ignore
      MockedCosmosDbUtils.getContainerByDatabase.mockResolvedValueOnce(null)
      // @ts-ignore
      MockedCosmosDbUtils.getContainerByDatabase.mockResolvedValueOnce(null)
      // @ts-ignore
      MockedCosmosDbUtils.createContainer.mockResolvedValueOnce({ id: 'testContainer' })
      // @ts-ignore
      MockedCosmosDbUtils.createContainer.mockRejectedValueOnce(new Error('test error'))

      await expect(asyncRunner()).rejects.toThrow('test error')
    })
  })
}

function runTestsAboutCreateMongooseModel() {
  describe('has method createMongooseModel() that', () => {
    it.todo('- when used before init() - behaves as expected')
    it.todo('behaves as expected')
    it.todo('normally pluralizes collection names by itself')
    it.todo('accepts user-defined collection names in schema')
  })
}

function runTestsAboutGetCollectionThroughput() {
  const asyncRunner = getAsyncRunner('getCollectionThroughput')

  describe('has method getCollectionThroughput() that', () => {
    it('uses CosmosDbUtils as expected', async () => {
      await asyncRunner()
      const allCalls = listAllCosmosDbCalls()

      expect(allCalls).toContainAllKeys(['getOneContainerByClient', 'getContainerThroughput'])
      _expectLengthOfCallsData(allCalls.getOneContainerByClient, 1, [2])
      _expectLengthOfCallsData(allCalls.getContainerThroughput, 1, [1])
    })

    it('succeeds with unmocked CosmosDbUtils', async () => {
      _unmockCosmosDb()

      await asyncRunner()
    })

    it('delivers a throughput value', async () => {
      const { result } = await asyncRunner({ mockedThroughputs: [600] })

      expect(result).toBe(600)
    })

    it("- if a container can't be found - returns null", async () => {
      // @ts-ignore
      MockedCosmosDbUtils.getOneContainerByClient.mockResolvedValueOnce(null)

      const { result } = await asyncRunner()

      expect(result).toBeNull()
    })

    it("- if a throughput can't be determined - returns null", async () => {
      const { result } = await asyncRunner({ mockedThroughputs: [null] })

      expect(result).toBeNull()
    })

    it('- if container query fails - FAILS', async () => {
      // @ts-ignore
      MockedCosmosDbUtils.getOneContainerByClient.mockRejectedValueOnce(new Error('test error'))

      await expect(asyncRunner()).rejects.toThrow('test error')
    })

    it('- if throughput query fails - FAILS', async () => {
      // @ts-ignore
      MockedCosmosDbUtils.getContainerThroughput.mockRejectedValueOnce(new Error('test error'))

      await expect(asyncRunner()).rejects.toThrow('test error')
    })
  })
}

function runTestsAboutListCollectionsWithThroughput() {
  const asyncRunner = getAsyncRunner('listCollectionsWithThroughput')

  describe('has method listCollectionsWithThroughput() that', () => {
    it('uses CosmosDbUtils as expected', async () => {
      await asyncRunner()
      const allCalls = listAllCosmosDbCalls()

      expect(allCalls).toContainAllKeys(['getOneContainerByClient', 'getContainerThroughput'])
      _expectLengthOfCallsData(allCalls.getOneContainerByClient, 2, [2, 2])
      _expectLengthOfCallsData(allCalls.getContainerThroughput, 2, [1, 1])
    })

    it('succeeds with unmocked CosmosDbUtils', async () => {
      _unmockCosmosDb()

      await asyncRunner()
    })

    it('delivers expected list', async () => {
      const { result, collectionName1, collectionName2 } = await asyncRunner({
        mockedThroughputs: [800, 900]
      })

      expect(result).toEqual([
        { collection: collectionName1, throughput: 800 },
        { collection: collectionName2, throughput: 900 }
      ])
    })

    it("- if one collection can't be found - shortens list", async () => {
      // @ts-ignore
      MockedCosmosDbUtils.getOneContainerByClient.mockResolvedValueOnce(null)

      const { result, collectionName2 } = await asyncRunner({ mockedThroughputs: [800] })

      expect(result).toEqual([{ collection: collectionName2, throughput: 800 }])
    })

    it("- if one throughput can't be determined - shortens list", async () => {
      const { result, collectionName1 } = await asyncRunner({ mockedThroughputs: [800, null] })

      expect(result).toEqual([{ collection: collectionName1, throughput: 800 }])
    })

    it('- if no collection can be found - returns null', async () => {
      // @ts-ignore
      MockedCosmosDbUtils.getOneContainerByClient.mockResolvedValueOnce(null)
      // @ts-ignore
      MockedCosmosDbUtils.getOneContainerByClient.mockResolvedValueOnce(null)

      const { result } = await asyncRunner()

      expect(result).toBeNull()
    })

    it('- if no throughput can be determined - returns null', async () => {
      const { result } = await asyncRunner({ mockedThroughputs: [null, null] })

      expect(result).toBeNull()
    })

    it('- if container query fails - FAILS', async () => {
      // @ts-ignore
      MockedCosmosDbUtils.getOneContainerByClient.mockRejectedValueOnce(new Error('test error'))

      await expect(asyncRunner()).rejects.toThrow('test error')
    })

    it('- if throughput query fails - FAILS', async () => {
      // @ts-ignore
      MockedCosmosDbUtils.getContainerThroughput.mockRejectedValueOnce(new Error('test error'))

      await expect(asyncRunner()).rejects.toThrow('test error')
    })
  })
}

function runTestsAboutIncreaseCollectionThroughput() {
  const asyncRunner = getAsyncRunner('increaseCollectionThroughput')

  describe('has method increaseCollectionThroughput() that', () => {
    it('uses CosmosDbUtils as expected', async () => {
      const { client } = await asyncRunner({ mockedThroughputs: [400] })
      const allCalls = listAllCosmosDbCalls()

      expect(allCalls).toContainAllKeys([
        'getOneContainerByClient',
        'getContainerThroughput',
        'setContainerThroughput'
      ])

      _expectLengthOfCallsData(allCalls.getOneContainerByClient, 1, [2])
      _expectLengthOfCallsData(allCalls.getContainerThroughput, 2, [1, 1])
      _expectLengthOfCallsData(allCalls.setContainerThroughput, 1, [2])

      const setArgs = allCalls.setContainerThroughput[0]
      expect(setArgs[1]).toBe(400 + client.throughputStepsize)
    })

    it('succeeds with unmocked CosmosDbUtils', async () => {
      _unmockCosmosDb()

      await asyncRunner()
    })

    it('increases and delivers a throughput value', async () => {
      const { result } = await asyncRunner({ mockedThroughputs: [400, 600] })

      expect(result).toBe(200)
    })

    it('- if throughput is too high - works as expected', async () => {
      const { result } = await asyncRunner({ mockedThroughputs: [100000] })

      expect(result).toBeNull()
    })

    it('- if container query fails - FAILS', async () => {
      // @ts-ignore
      MockedCosmosDbUtils.getOneContainerByClient.mockRejectedValueOnce(new Error('test error'))

      await expect(asyncRunner()).rejects.toThrow('test error')
    })

    it('- if throughput query fails - FAILS', async () => {
      // @ts-ignore
      MockedCosmosDbUtils.getContainerThroughput.mockRejectedValueOnce(new Error('test error'))

      await expect(asyncRunner()).rejects.toThrow('test error')
    })

    it('- if throughput update fails - FAILS', async () => {
      // @ts-ignore
      MockedCosmosDbUtils.setContainerThroughput.mockRejectedValueOnce(new Error('test error'))

      await expect(asyncRunner()).rejects.toThrow('test error')
    })
  })
}

function runTestsAboutUpdateCollectionThroughput() {
  const asyncRunner = getAsyncRunner('updateCollectionThroughput')

  describe('has method updateCollectionThroughput() that', () => {
    it('uses CosmosDbUtils as expected', async () => {
      await asyncRunner({ mockedThroughputs: [400, 200] })
      const allCalls = listAllCosmosDbCalls()

      expect(allCalls).toContainAllKeys([
        'getOneContainerByClient',
        'getContainerThroughput',
        'setContainerThroughput'
      ])
      _expectLengthOfCallsData(allCalls.getOneContainerByClient, 1, [2])
      _expectLengthOfCallsData(allCalls.getContainerThroughput, 2, [1, 1])
      _expectLengthOfCallsData(allCalls.setContainerThroughput, 1, [2])

      const setArgs = allCalls.setContainerThroughput[0]
      expect(setArgs[1]).toBe(300)
    })

    it('succeeds with unmocked CosmosDbUtils', async () => {
      _unmockCosmosDb()

      await asyncRunner()
    })

    it('updates and delivers a throughput value', async () => {
      const { result } = await asyncRunner({ mockedThroughputs: [400, 300] })

      expect(result).toBe(300)
    })

    it('- if current throughput is too high - works as expected', async () => {
      const { result } = await asyncRunner({ mockedThroughputs: [100000] })

      expect(result).toBe(100000)
    })

    it('- if container query fails - FAILS', async () => {
      // @ts-ignore
      MockedCosmosDbUtils.getOneContainerByClient.mockRejectedValueOnce(new Error('test error'))

      await expect(asyncRunner()).rejects.toThrow('test error')
    })

    it('- if throughput query fails - FAILS', async () => {
      // @ts-ignore
      MockedCosmosDbUtils.getContainerThroughput.mockRejectedValueOnce(new Error('test error'))

      await expect(asyncRunner()).rejects.toThrow('test error')
    })

    it('- if throughput update fails - FAILS', async () => {
      // @ts-ignore
      MockedCosmosDbUtils.setContainerThroughput.mockRejectedValueOnce(new Error('test error'))

      await expect(asyncRunner()).rejects.toThrow('test error')
    })
  })
}

function runTestsAboutUpdateAllCollectionsThroughput() {
  const asyncRunner = getAsyncRunner('updateAllCollectionsThroughput')

  describe('has method updateAllCollectionsThroughput() that', () => {
    it('uses CosmosDbUtils as expected', async () => {
      await asyncRunner()
      const allCalls = listAllCosmosDbCalls()

      expect(allCalls).toContainAllKeys([
        'getOneContainerByClient',
        'getContainerThroughput',
        'setContainerThroughput'
      ])
      _expectLengthOfCallsData(allCalls.getOneContainerByClient, 2, [2, 2])
      _expectLengthOfCallsData(allCalls.getContainerThroughput, 4, [1, 1, 1, 1])
      _expectLengthOfCallsData(allCalls.setContainerThroughput, 2, [2, 2])
    })

    it('succeeds with unmocked CosmosDbUtils', async () => {
      _unmockCosmosDb()

      await asyncRunner()
    })

    it('updates and delivers several throughput values', async () => {
      // @ts-ignore
      const { result } = await asyncRunner({
        mockedThroughputs: [800, 900, 400, 600],
        newThroughput: 500
      })

      expect(result).toEqual([400, 600])
    })

    it('- if current throughput is too high - works as expected', async () => {
      // @ts-ignore
      const { result } = await asyncRunner({
        mockedThroughputs: [100000, 900, 400, 600],
        newThroughput: 800
      })

      expect(result).toEqual([400, 600])
    })

    it('- if new throughput is too high - works as expected', async () => {
      // @ts-ignore
      const { result } = await asyncRunner({ mockedThroughputs: [800, 900], newThroughput: 100000 })

      expect(result).toEqual([800, 900])
    })

    it('- if container query fails - FAILS', async () => {
      // @ts-ignore
      MockedCosmosDbUtils.getOneContainerByClient.mockRejectedValueOnce(new Error('test error'))

      await expect(asyncRunner()).rejects.toThrow('test error')
    })

    it('- if throughput query fails - FAILS', async () => {
      // @ts-ignore
      MockedCosmosDbUtils.getContainerThroughput.mockRejectedValueOnce(new Error('test error'))

      await expect(asyncRunner()).rejects.toThrow('test error')
    })

    it('- if throughput update fails - FAILS', async () => {
      // @ts-ignore
      MockedCosmosDbUtils.setContainerThroughput.mockRejectedValueOnce(new Error('test error'))

      await expect(asyncRunner()).rejects.toThrow('test error')
    })
  })
}

function runTestsAboutResetThroughput() {
  const asyncRunner = getAsyncRunner('resetThroughput')

  describe('has method resetThroughput() that', () => {
    it('uses CosmosDbUtils as expected', async () => {
      const { client, collections } = await asyncRunner({
        mockedThroughputs: [800, 600, 1000, 900]
      })
      const allCalls = listAllCosmosDbCalls()

      expect(allCalls).toContainAllKeys([
        'getOneContainerByClient',
        'getContainerThroughput',
        'setContainerThroughput'
      ])

      _expectLengthOfCallsData(allCalls.getOneContainerByClient, 2, [2, 2])
      _expectLengthOfCallsData(allCalls.getContainerThroughput, 4, [1, 1, 1, 1])
      _expectLengthOfCallsData(allCalls.setContainerThroughput, 2, [2, 2])

      const setArgs1 = allCalls.setContainerThroughput[0]
      expect(setArgs1[1]).toBe(collections[0].throughput || client.defaultThroughput)
      const setArgs2 = allCalls.setContainerThroughput[1]
      expect(setArgs2[1]).toBe(collections[1].throughput || client.defaultThroughput)
    })

    it('succeeds with unmocked CosmosDbUtils', async () => {
      _unmockCosmosDb()

      await asyncRunner()
    })

    it('updates and delivers several throughput values', async () => {
      const { result } = await asyncRunner({
        mockedThroughputs: [800, 600, 1000, 900]
      })

      expect(result).toEqual([1000, 900])
    })

    it('- if container query fails - FAILS', async () => {
      // @ts-ignore
      MockedCosmosDbUtils.getOneContainerByClient.mockRejectedValueOnce(new Error('test error'))

      await expect(asyncRunner()).rejects.toThrow('test error')
    })

    it('- if throughput query fails - FAILS', async () => {
      // @ts-ignore
      MockedCosmosDbUtils.getContainerThroughput.mockRejectedValueOnce(new Error('test error'))

      await expect(asyncRunner()).rejects.toThrow('test error')
    })

    it('- if throughput update fails - FAILS', async () => {
      // @ts-ignore
      MockedCosmosDbUtils.setContainerThroughput.mockRejectedValueOnce(new Error('test error'))

      await expect(asyncRunner()).rejects.toThrow('test error')
    })
  })
}

function _expectLengthOfCallsData(callsArray, expectedLength, expectedNumberOfArgumentList) {
  expect(callsArray).toHaveLength(expectedLength)
  if (Array.isArray(expectedNumberOfArgumentList)) {
    for (let i = 0; i < expectedLength; i++) {
      const wasCalledWithOneObject =
        callsArray[i].length === 1 &&
        callsArray[i][0] != null &&
        typeof callsArray[i][0] === 'object'
      if (wasCalledWithOneObject) {
        expect(Object.keys(callsArray[i][0])).toHaveLength(expectedNumberOfArgumentList[i])
      } else {
        expect(callsArray[i]).toHaveLength(expectedNumberOfArgumentList[i])
      }
    }
  }
}

function _unmockCosmosDb() {
  const funcNames = Object.keys(RealCosmosDbUtils)
  funcNames.forEach(name => {
    if (typeof MockedCosmosDbUtils[name] === 'function') {
      MockedCosmosDbUtils[name].mockImplementation(RealCosmosDbUtils[name])
    }
  })
}
