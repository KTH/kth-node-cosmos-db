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
  _clearAllCalls: clearAllCosmosDbCalls,
} = MockedCosmosDbUtils

const RealCosmosDbUtils = jest.requireActual('./cosmosDb')

const { getTestOptions, getAsyncRunner } = require('./CosmosClientWrapper.test-data')
const CosmosClientWrapper = require('./CosmosClientWrapper')

describe(`Class CosmosClientWrapper`, () => {
  beforeEach(resetAllCosmosDbMocks)

  runTestsAboutConstructor()
  runTestsAboutGetOption()
  runTestsAboutSetOption()
  runTestsAboutDeleteDatabase()
  runTestsAboutDeleteCollection()
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

function runTestsAboutDeleteDatabase() {
  describe('has method deleteDatabase() that', () => {
    it.todo('behaves as expected')
  })
}

function runTestsAboutDeleteCollection() {
  describe('has method deleteCollection() that', () => {
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
        'createContainer',
      ]).toContainValues(Object.keys(allCalls))

      _expectLengthOfCallsData(allCalls.getDatabase, 1, [3])
      _expectLengthOfCallsData(allCalls.getContainerByDatabase, 2, [2, 2])
    })

    it("- if database doesn't yet exist - uses CosmosDbUtils as expected", async () => {
      const mockupAdaptions = {
        getDatabase: [{ resolve: null }],
      }

      const { db: databaseName } = await asyncRunner({ mockupAdaptions })

      const allCalls = listAllCosmosDbCalls()

      _expectLengthOfCallsData(allCalls.createDatabase, 1, [2])
      expect(allCalls.createDatabase[0][0]).toBeInstanceOf(CosmosClient)
      expect(allCalls.createDatabase[0][1]).toBe(databaseName)
    })

    it("- if first collection doesn't yet exist - uses CosmosDbUtils as expected", async () => {
      const mockupAdaptions = {
        getContainerByDatabase: [{ resolve: null }],
      }

      const { collections } = await asyncRunner({ mockupAdaptions })

      const allCalls = listAllCosmosDbCalls()

      _expectLengthOfCallsData(allCalls.createContainer, 1, [4])

      const callArg = allCalls.createContainer[0][0]
      expect(callArg).toBeObject()
      expect(callArg.containerName).toBe(collections[0].name)
    })

    it("- if second collection doesn't yet exist - uses CosmosDbUtils as expected", async () => {
      const mockupAdaptions = {
        getContainerByDatabase: [{ resolve: { id: 'dummy testContainer' } }, { resolve: null }],
      }

      const { collections } = await asyncRunner({ mockupAdaptions })

      const allCalls = listAllCosmosDbCalls()

      _expectLengthOfCallsData(allCalls.createContainer, 1, [4])

      const callArg = allCalls.createContainer[0][0]
      expect(callArg).toBeObject()
      expect(callArg.containerName).toBe(collections[1].name)
    })

    it("- if both collections don't exist, yet - uses CosmosDbUtils as expected", async () => {
      const mockupAdaptions = {
        getContainerByDatabase: [{ resolve: null }, { resolve: null }],
      }

      const { collections } = await asyncRunner({ mockupAdaptions })

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
      const mockupAdaptions = {
        getDatabase: [{ resolve: null }],
        createDatabase: [{ reject: new Error('test error') }],
      }

      await expect(asyncRunner({ mockupAdaptions })).rejects.toThrow('test error')
    })

    it('- if first container creation fails - FAILS', async () => {
      const mockupAdaptions = {
        getContainerByDatabase: [{ resolve: null }],
        createContainer: [{ reject: new Error('test error') }],
      }

      await expect(asyncRunner({ mockupAdaptions })).rejects.toThrow('test error')
    })

    it('- if seconds container creation fails - FAILS', async () => {
      const mockupAdaptions = {
        getContainerByDatabase: [{ resolve: null }, { resolve: null }],
        createContainer: [
          { resolve: { id: 'testContainer' } },
          { reject: new Error('test error') },
        ],
      }

      await expect(asyncRunner({ mockupAdaptions })).rejects.toThrow('test error')
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

      expect(allCalls).toContainAllKeys([
        'getDatabase',
        'getContainerByDatabase',
        'getContainerThroughput',
      ])
      _expectLengthOfCallsData(allCalls.getDatabase, 1, [2])
      _expectLengthOfCallsData(allCalls.getContainerByDatabase, 1, [2])
      _expectLengthOfCallsData(allCalls.getContainerThroughput, 1, [1])
    })

    it('succeeds with unmocked CosmosDbUtils', async () => {
      _unmockCosmosDb()

      await asyncRunner()
    })

    it('delivers a throughput value', async () => {
      const mockupAdaptions = {
        getContainerThroughput: [{ resolve: 600 }],
      }

      const { result } = await asyncRunner({ mockupAdaptions })

      expect(result).toBe(600)
    })

    it("- if the database can't be found - returns null", async () => {
      const mockupAdaptions = {
        getDatabase: [{ resolve: null }],
      }

      const { result } = await asyncRunner({ mockupAdaptions })

      expect(result).toBeNull()
    })

    it("- if a container can't be found - returns null", async () => {
      const mockupAdaptions = {
        getContainerByDatabase: [{ resolve: null }],
      }

      const { result } = await asyncRunner({ mockupAdaptions })

      expect(result).toBeNull()
    })

    it("- if a throughput can't be determined - returns null", async () => {
      const mockupAdaptions = {
        getContainerThroughput: [{ resolve: null }],
      }

      const { result } = await asyncRunner({ mockupAdaptions })

      expect(result).toBeNull()
    })

    it('- if database query fails - FAILS', async () => {
      const mockupAdaptions = {
        getDatabase: [{ reject: new Error('test error') }],
      }

      await expect(asyncRunner({ mockupAdaptions })).rejects.toThrow('test error')
    })

    it('- if container query fails - FAILS', async () => {
      const mockupAdaptions = {
        getContainerByDatabase: [{ reject: new Error('test error') }],
      }

      await expect(asyncRunner({ mockupAdaptions })).rejects.toThrow('test error')
    })

    it('- if throughput query fails - FAILS', async () => {
      const mockupAdaptions = {
        getContainerThroughput: [{ reject: new Error('test error') }],
      }

      await expect(asyncRunner({ mockupAdaptions })).rejects.toThrow('test error')
    })
  })
}

function runTestsAboutListCollectionsWithThroughput() {
  const asyncRunner = getAsyncRunner('listCollectionsWithThroughput')

  describe('has method listCollectionsWithThroughput() that', () => {
    it('uses CosmosDbUtils as expected', async () => {
      await asyncRunner()
      const allCalls = listAllCosmosDbCalls()

      expect(allCalls).toContainAllKeys([
        'getDatabase',
        'getContainerByDatabase',
        'getContainerThroughput',
      ])
      _expectLengthOfCallsData(allCalls.getDatabase, 1, [2])
      _expectLengthOfCallsData(allCalls.getContainerByDatabase, 2, [2, 2])
      _expectLengthOfCallsData(allCalls.getContainerThroughput, 2, [1, 1])
    })

    it('succeeds with unmocked CosmosDbUtils', async () => {
      _unmockCosmosDb()

      await asyncRunner()
    })

    it('delivers expected list', async () => {
      const mockupAdaptions = {
        getContainerThroughput: [{ resolve: 800 }, { resolve: 900 }],
      }

      const { result, collectionName1, collectionName2 } = await asyncRunner({ mockupAdaptions })

      expect(result).toEqual([
        { collection: collectionName1, throughput: 800 },
        { collection: collectionName2, throughput: 900 },
      ])
    })

    it("- if one collection can't be found - shortens list", async () => {
      const mockupAdaptions = {
        getContainerByDatabase: [{ resolve: null }],
        getContainerThroughput: [{ resolve: 800 }],
      }

      const { result, collectionName2 } = await asyncRunner({ mockupAdaptions })

      expect(result).toEqual([{ collection: collectionName2, throughput: 800 }])
    })

    it("- if one throughput can't be determined - shortens list", async () => {
      const mockupAdaptions = {
        getContainerThroughput: [{ resolve: 800 }, { resolve: null }],
      }

      const { result, collectionName1 } = await asyncRunner({ mockupAdaptions })

      expect(result).toEqual([{ collection: collectionName1, throughput: 800 }])
    })

    it('- if no collection can be found - returns null', async () => {
      const mockupAdaptions = {
        getContainerByDatabase: [{ resolve: null }, { resolve: null }],
      }

      const { result } = await asyncRunner({ mockupAdaptions })

      expect(result).toBeNull()
    })

    it('- if no throughput can be determined - returns null', async () => {
      const mockupAdaptions = {
        getContainerThroughput: [{ resolve: null }, { resolve: null }],
      }

      const { result } = await asyncRunner({ mockupAdaptions })

      expect(result).toBeNull()
    })

    it('- if database query fails - FAILS', async () => {
      const mockupAdaptions = {
        getDatabase: [{ reject: new Error('test error') }],
      }

      await expect(asyncRunner({ mockupAdaptions })).rejects.toThrow('test error')
    })

    it('- if container query fails - FAILS', async () => {
      const mockupAdaptions = {
        getContainerByDatabase: [{ reject: new Error('test error') }],
      }

      await expect(asyncRunner({ mockupAdaptions })).rejects.toThrow('test error')
    })

    it('- if throughput query fails - FAILS', async () => {
      const mockupAdaptions = {
        getContainerThroughput: [{ reject: new Error('test error') }],
      }

      await expect(asyncRunner({ mockupAdaptions })).rejects.toThrow('test error')
    })
  })
}

function runTestsAboutIncreaseCollectionThroughput() {
  const asyncRunner = getAsyncRunner('increaseCollectionThroughput')

  describe('has method increaseCollectionThroughput() that', () => {
    it('uses CosmosDbUtils as expected', async () => {
      const mockupAdaptions = {
        getContainerThroughput: [{ resolve: 400 }],
      }

      const { client } = await asyncRunner({ mockupAdaptions })

      const allCalls = listAllCosmosDbCalls()
      expect(allCalls).toContainAllKeys([
        'getDatabase',
        'getContainerByDatabase',
        'getContainerThroughput',
        'setContainerThroughput',
      ])

      _expectLengthOfCallsData(allCalls.getDatabase, 1, [2])
      _expectLengthOfCallsData(allCalls.getContainerByDatabase, 1, [2])
      _expectLengthOfCallsData(allCalls.getContainerThroughput, 2, [1, 1])
      _expectLengthOfCallsData(allCalls.setContainerThroughput, 1, [2])

      const setArgs = allCalls.setContainerThroughput[0]
      expect(setArgs[1]).toBe(400 + client.throughputStepsize)
    })

    it('succeeds with unmocked CosmosDbUtils', async () => {
      _unmockCosmosDb()

      await asyncRunner()
    })

    it('increases the throughput value and returns the difference', async () => {
      const mockupAdaptions = {
        getContainerThroughput: [{ resolve: 400 }, { resolve: 600 }],
      }

      const { result } = await asyncRunner({ mockupAdaptions })

      expect(result).toBe(200)
    })

    it('- if throughput is too high - works as expected', async () => {
      const mockupAdaptions = {
        getContainerThroughput: [{ resolve: 100000 }],
      }

      const { result } = await asyncRunner({ mockupAdaptions })

      expect(result).toBeNull()
    })

    it('- if database query fails - FAILS', async () => {
      const mockupAdaptions = {
        getDatabase: [{ reject: new Error('test error') }],
      }

      await expect(asyncRunner({ mockupAdaptions })).rejects.toThrow('test error')
    })

    it('- if container query fails - FAILS', async () => {
      const mockupAdaptions = {
        getContainerByDatabase: [{ reject: new Error('test error') }],
      }

      await expect(asyncRunner({ mockupAdaptions })).rejects.toThrow('test error')
    })

    it('- if throughput query fails - FAILS', async () => {
      const mockupAdaptions = {
        getContainerThroughput: [{ reject: new Error('test error') }],
      }

      await expect(asyncRunner({ mockupAdaptions })).rejects.toThrow('test error')
    })

    it('- if throughput update fails - FAILS', async () => {
      const mockupAdaptions = {
        setContainerThroughput: [{ reject: new Error('test error') }],
      }

      await expect(asyncRunner({ mockupAdaptions })).rejects.toThrow('test error')
    })
  })
}

function runTestsAboutUpdateCollectionThroughput() {
  const asyncRunner = getAsyncRunner('updateCollectionThroughput')
  const newThroughput = 500

  describe('has method updateCollectionThroughput() that', () => {
    it('uses CosmosDbUtils as expected', async () => {
      const mockupAdaptions = {
        getContainerThroughput: [{ resolve: 800 }, { resolve: 600 }],
      }

      await asyncRunner({ mockupAdaptions, newThroughput })
      const allCalls = listAllCosmosDbCalls()

      expect(allCalls).toContainAllKeys([
        'getDatabase',
        'getContainerByDatabase',
        'getContainerThroughput',
        'setContainerThroughput',
      ])
      _expectLengthOfCallsData(allCalls.getDatabase, 1, [2])
      _expectLengthOfCallsData(allCalls.getContainerByDatabase, 1, [2])
      _expectLengthOfCallsData(allCalls.getContainerThroughput, 2, [1, 1])
      _expectLengthOfCallsData(allCalls.setContainerThroughput, 1, [2])

      const setArgs = allCalls.setContainerThroughput[0]
      expect(setArgs[1]).toBe(newThroughput)
    })

    it('succeeds with unmocked CosmosDbUtils', async () => {
      _unmockCosmosDb()

      await asyncRunner()
    })

    it('updates and delivers a throughput value', async () => {
      const mockupAdaptions = {
        getContainerThroughput: [{ resolve: 800 }, { resolve: 600 }],
      }

      const { result } = await asyncRunner({ mockupAdaptions, newThroughput })

      expect(result).toBe(600)
    })

    it('- if current throughput is too high - works as expected', async () => {
      const mockupAdaptions = {
        getContainerThroughput: [{ resolve: 100000 }, { resolve: 100001 }],
      }

      const { result } = await asyncRunner({ mockupAdaptions, newThroughput })

      expect(result).toBe(100001)
    })

    it('- if database query fails - FAILS', async () => {
      const mockupAdaptions = {
        getDatabase: [{ reject: new Error('test error') }],
      }

      await expect(asyncRunner({ mockupAdaptions })).rejects.toThrow('test error')
    })

    it('- if container query fails - FAILS', async () => {
      const mockupAdaptions = {
        getContainerByDatabase: [{ reject: new Error('test error') }],
      }

      await expect(asyncRunner({ mockupAdaptions })).rejects.toThrow('test error')
    })

    it('- if throughput query fails - FAILS', async () => {
      const mockupAdaptions = {
        getContainerThroughput: [{ reject: new Error('test error') }],
      }

      await expect(asyncRunner({ mockupAdaptions })).rejects.toThrow('test error')
    })

    it('- if throughput update fails - FAILS', async () => {
      const mockupAdaptions = {
        setContainerThroughput: [{ reject: new Error('test error') }],
      }

      await expect(asyncRunner({ mockupAdaptions, newThroughput })).rejects.toThrow('test error')
    })

    it.todo('skips setContainerThroughput() if new throughput equals current throughput')
  })
}

function runTestsAboutUpdateAllCollectionsThroughput() {
  const asyncRunner = getAsyncRunner('updateAllCollectionsThroughput')

  describe('has method updateAllCollectionsThroughput() that', () => {
    it('uses CosmosDbUtils as expected', async () => {
      await asyncRunner({ newThroughput: 500 })
      const allCalls = listAllCosmosDbCalls()

      expect(allCalls).toContainAllKeys([
        'getDatabase',
        'getContainerByDatabase',
        'getContainerThroughput',
        'setContainerThroughput',
      ])
      _expectLengthOfCallsData(allCalls.getDatabase, 2, [2, 2])
      _expectLengthOfCallsData(allCalls.getContainerByDatabase, 2, [2, 2])
      _expectLengthOfCallsData(allCalls.getContainerThroughput, 4, [1, 1, 1, 1])
      _expectLengthOfCallsData(allCalls.setContainerThroughput, 2, [2, 2])
    })

    it('succeeds with unmocked CosmosDbUtils', async () => {
      _unmockCosmosDb()

      await asyncRunner()
    })

    it('updates and delivers several throughput values', async () => {
      const mockupAdaptions = {
        getContainerThroughput: [
          { resolve: 800 },
          { resolve: 900 },
          { resolve: 400 },
          { resolve: 600 },
        ],
      }

      const { result } = await asyncRunner({ mockupAdaptions, newThroughput: 500 })

      expect(result).toEqual([400, 600])
    })

    it('- if current throughput is too high - works as expected', async () => {
      const mockupAdaptions = {
        getContainerThroughput: [
          { resolve: 100000 },
          { resolve: 900 },
          { resolve: 400 },
          { resolve: 600 },
        ],
      }

      const { result } = await asyncRunner({ mockupAdaptions, newThroughput: 800 })

      expect(result).toEqual([400, 600])
    })

    it('- if new throughput is too high - works as expected', async () => {
      const mockupAdaptions = {
        getContainerThroughput: [{ resolve: 800 }, { resolve: 900 }],
      }

      const { result } = await asyncRunner({ mockupAdaptions, newThroughput: 100000 })

      expect(result).toEqual([800, 900])
    })

    it('- if database query fails - FAILS', async () => {
      const mockupAdaptions = {
        getDatabase: [{ reject: new Error('test error') }],
      }

      await expect(asyncRunner({ mockupAdaptions })).rejects.toThrow('test error')
    })

    it('- if container query fails - FAILS', async () => {
      const mockupAdaptions = {
        getContainerByDatabase: [{ reject: new Error('test error') }],
      }

      await expect(asyncRunner({ mockupAdaptions })).rejects.toThrow('test error')
    })

    it('- if throughput query fails - FAILS', async () => {
      const mockupAdaptions = {
        getContainerThroughput: [{ reject: new Error('test error') }],
      }

      await expect(asyncRunner({ mockupAdaptions })).rejects.toThrow('test error')
    })

    it('- if throughput update fails - FAILS', async () => {
      const mockupAdaptions = {
        setContainerThroughput: [{ reject: new Error('test error') }],
      }

      await expect(asyncRunner({ mockupAdaptions, newThroughput: 500 })).rejects.toThrow(
        'test error'
      )
    })
  })
}

function runTestsAboutResetThroughput() {
  const asyncRunner = getAsyncRunner('resetThroughput')

  describe('has method resetThroughput() that', () => {
    it('uses CosmosDbUtils as expected', async () => {
      const mockupAdaptions = {
        getContainerThroughput: [
          { resolve: 800 },
          { resolve: 600 },
          { resolve: 1000 },
          { resolve: 900 },
        ],
      }

      const { client, collections } = await asyncRunner({ mockupAdaptions })
      const allCalls = listAllCosmosDbCalls()

      expect(allCalls).toContainAllKeys([
        'getDatabase',
        'getContainerByDatabase',
        'getContainerThroughput',
        'setContainerThroughput',
      ])

      _expectLengthOfCallsData(allCalls.getDatabase, 2, [2, 2])
      _expectLengthOfCallsData(allCalls.getContainerByDatabase, 2, [2, 2])
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
      const mockupAdaptions = {
        getContainerThroughput: [
          { resolve: 800 },
          { resolve: 600 },
          { resolve: 1000 },
          { resolve: 900 },
        ],
      }

      const { result } = await asyncRunner({ mockupAdaptions })

      expect(result).toEqual([1000, 900])
    })

    it('- if database query fails - FAILS', async () => {
      const mockupAdaptions = {
        getDatabase: [{ reject: new Error('test error') }],
      }

      await expect(asyncRunner({ mockupAdaptions })).rejects.toThrow('test error')
    })

    it('- if container query fails - FAILS', async () => {
      const mockupAdaptions = {
        getContainerByDatabase: [{ reject: new Error('test error') }],
      }

      await expect(asyncRunner({ mockupAdaptions })).rejects.toThrow('test error')
    })

    it('- if throughput query fails - FAILS', async () => {
      const mockupAdaptions = {
        getContainerThroughput: [{ reject: new Error('test error') }],
      }

      await expect(asyncRunner({ mockupAdaptions })).rejects.toThrow('test error')
    })

    it('- if throughput update fails - FAILS', async () => {
      const mockupAdaptions = {
        setContainerThroughput: [{ reject: new Error('test error') }],
      }

      await expect(asyncRunner({ mockupAdaptions })).rejects.toThrow('test error')
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
