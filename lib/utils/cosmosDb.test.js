/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

jest.mock('@azure/cosmos')
jest.mock('kth-node-log')

const { testBasicFunctionExport } = require('../../testlib')

const CosmosDbUtils = require('./cosmosDb')

const {
  createDatabase,
  createContainer,
  getContainerOfferByClient,
  increaseThroughputByName
} = CosmosDbUtils

const { getGlobalTestData, getTestData } = require('./cosmosDb.test-data')

const Global = getGlobalTestData()

describe('Helper module "cosmosDb"', () => {
  runAllBasicTestsAboutSingleFunction('createDatabase')
  runAllBasicTestsAboutSingleFunction('createContainer')
  runAllBasicTestsAboutSingleFunction('getContainerByClient')
  runAllBasicTestsAboutSingleFunction('getContainerOfferByClient')
  runAllBasicTestsAboutSingleFunction('increaseThroughputByName')

  runAdditionalTestsAboutCreateContainer()
  runAdditionalTestsAboutIncreaseThroughput()

  it.todo('has increaseThroughputByOffer() ...')
})

function runAdditionalTestsAboutCreateContainer() {
  const { containerId, initialThroughput } = Global.testData

  describe('has createContainer() that also', () => {
    it("- when called twice with same arguments - doesn't create new object", async () => {
      const { database } = await _prepareTestDatabaseAndContainer(true, false)

      const validArgs = [database, containerId, initialThroughput]

      const firstContainer = await _testRunAsync(createContainer, validArgs)
      const secondContainer = await _testRunAsync(createContainer, validArgs)

      expect(firstContainer).toBeObject()
      expect(firstContainer.database).toBe(database)
      expect(firstContainer.id).toBe(containerId)

      expect(firstContainer).toEqual(secondContainer)
    })
  })
}

function runAdditionalTestsAboutIncreaseThroughput() {
  const { cosmosClient: client } = Global
  const { containerId } = Global.testData

  describe('has increaseThroughputByName() that also', () => {
    it("actually changes a container's throughput", async () => {
      await _prepareTestDatabaseAndContainer()

      const throughputs = {}

      const containerOffer1 = await getContainerOfferByClient(containerId, client)
      throughputs.current = containerOffer1.content.offerThroughput
      throughputs.requested = throughputs.current + 200

      await increaseThroughputByName(containerId, throughputs.requested, client)

      const containerOffer2 = await getContainerOfferByClient(containerId, client)
      throughputs.updated = containerOffer2.content.offerThroughput

      expect(throughputs.updated).toBe(throughputs.requested)
    })
  })
}

function runAllBasicTestsAboutSingleFunction(funcName) {
  const testSetup = getTestData(funcName)

  // @ts-ignore
  const { prepareDatabase, prepareContainer, tests } = testSetup
  const func = CosmosDbUtils[funcName]

  describe(`has ${funcName}() that`, () => {
    testBasicFunctionExport(func)

    tests.forEach(({ description, getArgs, checkResult, error }) => {
      let testNameSuffix
      if (error) {
        testNameSuffix = error === true ? 'REJECTS' : 'REJECTS as expected'
      } else {
        testNameSuffix = 'resolves as expected'
      }

      it(`- when called with ${description} - ${testNameSuffix}`, async () => {
        const { database, container } = await _prepareTestDatabaseAndContainer(
          prepareDatabase,
          prepareContainer
        )

        const args = typeof getArgs === 'function' ? getArgs({ database, container }) : []

        if (error) {
          await expect(_testRunAsync(func, args)).rejects.toThrow(
            error === true ? undefined : error
          )
          return
        }

        const result = await _testRunAsync(func, args)

        if (typeof checkResult === 'function') {
          checkResult(result, { database, container })
        }
      })
    })
  })
}

async function _prepareTestDatabaseAndContainer(prepareDatabase = true, prepareContainer = true) {
  const { cosmosClient: client } = Global
  const { databaseId, containerId, initialThroughput } = Global.testData

  if (!prepareDatabase) {
    return {}
  }

  const database = await createDatabase(databaseId, client)

  const container = prepareContainer
    ? await createContainer(database, containerId, initialThroughput)
    : null

  return { database, container }
}

async function _testRunAsync(callback, args) {
  expect(callback).toBeFunction()
  expect(args).toBeArray()

  const asyncResult = callback(...args)

  expect(asyncResult).toBeInstanceOf(Promise)

  return asyncResult
}
