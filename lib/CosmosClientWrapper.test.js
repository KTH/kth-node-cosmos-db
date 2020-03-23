/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

jest.mock('@azure/cosmos')
jest.mock('kth-node-log')
jest.mock('./utils/cosmosDb')

const { CosmosClient } = require('@azure/cosmos')

// eslint-disable-next-line import/newline-after-import
const MockedCosmosDbUtils = require('./utils/cosmosDb')
const {
  _resetAllMocks: resetAllCosmosDbMocks,
  _listAllCalls: listAllCosmosDbCalls,
  _clearAllCalls: clearAllCosmosDbCalls
} = MockedCosmosDbUtils

const RealCosmosDbUtils = jest.requireActual('./utils/cosmosDb')

const { getTestOptions } = require('./utils/options.test-data')

const CosmosClientWrapper = require('./CosmosClientWrapper')

describe(`Class CosmosClientWrapper`, () => {
  beforeEach(resetAllCosmosDbMocks)

  runTestsAboutConstructor()
  runTestsAboutInit()
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
    const invalidOoptions = getTestOptions('missingKey')

    it('- when used with valid options - succeeds', () => {
      const runner = () => new CosmosClientWrapper(validOptions)

      runner()
    })

    it('- when used with invalid options - FAILS', () => {
      const runner = () => new CosmosClientWrapper(invalidOoptions)

      expect(runner).toThrow('required config options are missing')
    })

    it('- when used with no options - FAILS', () => {
      const runner = () => new CosmosClientWrapper()

      expect(runner).toThrow('need to pass a config object')
    })

    it('does not use any CosmosDbUtils function', () => {
      clearAllCosmosDbCalls()

      const runner = () => new CosmosClientWrapper(validOptions)
      runner()

      expect(listAllCosmosDbCalls()).toBeNull()
    })
  })
}

function runTestsAboutInit() {
  describe('has method init() that', () => {
    const asyncRunner = async () => {
      const preparations = await _getClientWrapperAndOptions(false, 'withTwoCollections')

      const { client } = preparations

      clearAllCosmosDbCalls()
      await client.init()

      return preparations
    }

    it('uses CosmosDbUtils as expected', async () => {
      const { db: databaseId } = await asyncRunner()

      const allCalls = listAllCosmosDbCalls()
      expect(allCalls).toContainAllKeys(['createDatabase', 'createContainer'])

      const databaseCalls = allCalls.createDatabase
      _expectLengthOfCallsData(databaseCalls, 1, [2])
      expect(databaseCalls[0][0]).toBeInstanceOf(CosmosClient)
      expect(databaseCalls[0][1]).toBe(databaseId)

      _expectLengthOfCallsData(allCalls.createContainer, 2, [3, 3])
    })

    it('succeeds with unmocked CosmosDbUtils', async () => {
      _unmockCosmosDb()

      await asyncRunner()
    })

    it('- if database creation fails - FAILS', async () => {
      // @ts-ignore
      MockedCosmosDbUtils.createDatabase.mockRejectedValueOnce(new Error('test error'))

      await expect(asyncRunner()).rejects.toThrow('test error')
    })

    it('- if first container creation fails - FAILS', async () => {
      // @ts-ignore
      MockedCosmosDbUtils.createContainer.mockRejectedValueOnce(new Error('test error'))

      await expect(asyncRunner()).rejects.toThrow('test error')
    })

    it('- if seconds container creation fails - FAILS', async () => {
      // @ts-ignore
      MockedCosmosDbUtils.createContainer.mockResolvedValueOnce({ id: 'testContainer' })
      // @ts-ignore
      MockedCosmosDbUtils.createContainer.mockRejectedValueOnce(new Error('test error'))

      await expect(asyncRunner()).rejects.toThrow('test error')
    })
  })
}

function runTestsAboutGetCollectionThroughput() {
  describe('has method getCollectionThroughput() that', () => {
    const asyncRunner = async mockedThroughputs => {
      const preparations = await _getClientWrapperAndOptions(true)

      const { client, collections } = preparations
      const { name: collectionName } = collections[0]

      if (Array.isArray(mockedThroughputs)) {
        // @ts-ignore
        mockedThroughputs.forEach(MockedCosmosDbUtils.getContainerThroughput.mockResolvedValueOnce)
      }

      clearAllCosmosDbCalls()
      const result = await client.getCollectionThroughput(collectionName)

      return { ...preparations, result }
    }

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
      const { result } = await asyncRunner([600])

      expect(result).toBe(600)
    })

    it("- if a container can't be found - returns null", async () => {
      // @ts-ignore
      MockedCosmosDbUtils.getOneContainerByClient.mockResolvedValueOnce(null)

      const { result } = await asyncRunner()

      expect(result).toBeNull()
    })

    it("- if a throughput can't be determined - returns null", async () => {
      const { result } = await asyncRunner([null])

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
  describe('has method listCollectionsWithThroughput() that', () => {
    const asyncRunner = async mockedThroughputs => {
      const preparations = await _getClientWrapperAndOptions(true, 'withTwoCollections')

      const { client, collections } = preparations
      const { name: collectionName1 } = collections[0]
      const { name: collectionName2 } = collections[1]

      if (Array.isArray(mockedThroughputs)) {
        // @ts-ignore
        mockedThroughputs.forEach(MockedCosmosDbUtils.getContainerThroughput.mockResolvedValueOnce)
      }

      clearAllCosmosDbCalls()
      const result = await client.listCollectionsWithThroughput()

      return { ...preparations, result, collectionName1, collectionName2 }
    }

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
      const { result, collectionName1, collectionName2 } = await asyncRunner([800, 900])

      expect(result).toEqual([
        { collection: collectionName1, throughput: 800 },
        { collection: collectionName2, throughput: 900 }
      ])
    })

    it("- if one collection can't be found - shortens list", async () => {
      // @ts-ignore
      MockedCosmosDbUtils.getOneContainerByClient.mockResolvedValueOnce(null)

      const { result, collectionName2 } = await asyncRunner([800])

      expect(result).toEqual([{ collection: collectionName2, throughput: 800 }])
    })

    it("- if one throughput can't be determined - shortens list", async () => {
      const { result, collectionName1 } = await asyncRunner([800, null])

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
      const { result } = await asyncRunner([null, null])

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
  describe('has method increaseCollectionThroughput() that', () => {
    const asyncRunner = async mockedThroughputs => {
      const preparations = await _getClientWrapperAndOptions(true)

      const { client, collections } = preparations
      const { name: collectionName } = collections[0]

      if (Array.isArray(mockedThroughputs)) {
        // @ts-ignore
        mockedThroughputs.forEach(MockedCosmosDbUtils.getContainerThroughput.mockResolvedValueOnce)
      }

      clearAllCosmosDbCalls()
      const result = await client.increaseCollectionThroughput(collectionName)

      return { ...preparations, result }
    }

    it('uses CosmosDbUtils as expected', async () => {
      await asyncRunner()

      const allCalls = listAllCosmosDbCalls()
      expect(allCalls).toContainAllKeys([
        'getOneContainerByClient',
        'getContainerThroughput',
        'setContainerThroughput'
      ])
      _expectLengthOfCallsData(allCalls.getOneContainerByClient, 1, [2])
      _expectLengthOfCallsData(allCalls.getContainerThroughput, 1, [1])
      _expectLengthOfCallsData(allCalls.setContainerThroughput, 1, [2])
    })

    it('succeeds with unmocked CosmosDbUtils', async () => {
      _unmockCosmosDb()

      await asyncRunner()
    })

    it('increases and delivers a throughput value', async () => {
      const { client, result } = await asyncRunner([400])

      expect(result).toBe(400 + client.throughputStepsize)
    })

    it('- if throughput is too high - works as expected', async () => {
      const { result } = await asyncRunner([100000])

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

function runTestsAboutUpdateCollectionThroughput() {
  describe('has method updateCollectionThroughput() that', () => {
    const asyncRunner = async mockedThroughputs => {
      const preparations = await _getClientWrapperAndOptions(true)
      const { client, collections } = preparations

      const { name: collectionName, throughput } = collections[0]
      let newThroughput = throughput - 100

      if (Array.isArray(mockedThroughputs)) {
        // @ts-ignore
        mockedThroughputs.forEach(MockedCosmosDbUtils.getContainerThroughput.mockResolvedValueOnce)
        if (mockedThroughputs[0] > 100) {
          newThroughput = mockedThroughputs[0] - 100
        }
      }

      clearAllCosmosDbCalls()
      const result = await client.updateCollectionThroughput(collectionName, newThroughput)

      return { ...preparations, result, newThroughput }
    }

    it('uses CosmosDbUtils as expected', async () => {
      await asyncRunner()

      const allCalls = listAllCosmosDbCalls()
      expect(allCalls).toContainAllKeys([
        'getOneContainerByClient',
        'getContainerThroughput',
        'setContainerThroughput'
      ])
      _expectLengthOfCallsData(allCalls.getOneContainerByClient, 1, [2])
      _expectLengthOfCallsData(allCalls.getContainerThroughput, 1, [1])
      _expectLengthOfCallsData(allCalls.setContainerThroughput, 1, [2])
    })

    it('succeeds with unmocked CosmosDbUtils', async () => {
      _unmockCosmosDb()

      await asyncRunner()
    })

    it('updates and delivers a throughput value', async () => {
      const { result, newThroughput } = await asyncRunner()

      expect(result).toBe(newThroughput)
    })

    it('- if current throughput is too high - works as expected', async () => {
      const { result } = await asyncRunner([100000])

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
  describe('has method updateAllCollectionsThroughput() that', () => {
    const asyncRunner = async (mockedThroughputs, newThroughput) => {
      const preparations = await _getClientWrapperAndOptions(true, 'withTwoCollections')

      const { client } = preparations

      if (Array.isArray(mockedThroughputs)) {
        // @ts-ignore
        mockedThroughputs.forEach(MockedCosmosDbUtils.getContainerThroughput.mockResolvedValueOnce)
      }

      clearAllCosmosDbCalls()
      const result = await client.updateAllCollectionsThroughput(newThroughput || 600)

      return { ...preparations, result }
    }

    it('uses CosmosDbUtils as expected', async () => {
      await asyncRunner()

      const allCalls = listAllCosmosDbCalls()
      expect(allCalls).toContainAllKeys([
        'getOneContainerByClient',
        'getContainerThroughput',
        'setContainerThroughput'
      ])
      _expectLengthOfCallsData(allCalls.getOneContainerByClient, 2, [2, 2])
      _expectLengthOfCallsData(allCalls.getContainerThroughput, 2, [1, 1])
      _expectLengthOfCallsData(allCalls.setContainerThroughput, 2, [2, 2])
    })

    it('succeeds with unmocked CosmosDbUtils', async () => {
      _unmockCosmosDb()

      await asyncRunner()
    })

    it('updates and delivers several throughput values', async () => {
      const { result } = await asyncRunner([800, 900], 500)

      expect(result).toEqual([500, 500])
    })

    it('- if current throughput is too high - works as expected', async () => {
      const { result } = await asyncRunner([100000, 900], 800)

      expect(result).toEqual([800, 800])
    })

    it('- if new throughput is too high - works as expected', async () => {
      const { result } = await asyncRunner([800, 900], 100000)

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
  describe('has method resetThroughput() that', () => {
    const asyncRunner = async () => {
      const preparations = await _getClientWrapperAndOptions(true, 'withTwoCollections')

      const { client, collections } = preparations
      const { throughput: throughput1 } = collections[0]
      const { throughput: throughput2 } = collections[1]

      // @ts-ignore
      MockedCosmosDbUtils.getContainerThroughput.mockResolvedValueOnce(throughput1)
      // @ts-ignore
      MockedCosmosDbUtils.getContainerThroughput.mockResolvedValueOnce(throughput2)

      clearAllCosmosDbCalls()
      const result = await client.resetThroughput()

      return { ...preparations, result, throughput1, throughput2 }
    }

    it('uses CosmosDbUtils as expected', async () => {
      await asyncRunner()

      const allCalls = listAllCosmosDbCalls()
      expect(allCalls).toContainAllKeys([
        'getOneContainerByClient',
        'getContainerThroughput',
        'setContainerThroughput'
      ])
      _expectLengthOfCallsData(allCalls.getOneContainerByClient, 2, [2, 2])
      _expectLengthOfCallsData(allCalls.getContainerThroughput, 2, [1, 1])
      _expectLengthOfCallsData(allCalls.setContainerThroughput, 2, [2, 2])
    })

    it('succeeds with unmocked CosmosDbUtils', async () => {
      _unmockCosmosDb()

      await asyncRunner()
    })

    it('updates and delivers several throughput values', async () => {
      const { result, throughput1, throughput2, client } = await asyncRunner()

      expect(result).toEqual([
        throughput1 || client.defaultThroughput,
        throughput2 || client.defaultThroughput
      ])
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
      expect(callsArray[i]).toHaveLength(expectedNumberOfArgumentList[i])
    }
  }
}

async function _getClientWrapperAndOptions(runInit, target = 'valid') {
  const options = getTestOptions(target)

  const client = new CosmosClientWrapper(options)

  if (runInit) {
    await client.init()
  }

  return { ...options, client }
}

function _unmockCosmosDb() {
  const funcNames = Object.keys(RealCosmosDbUtils)
  funcNames.forEach(name => {
    if (typeof MockedCosmosDbUtils[name] === 'function') {
      MockedCosmosDbUtils[name].mockImplementation(RealCosmosDbUtils[name])
    }
  })
}
