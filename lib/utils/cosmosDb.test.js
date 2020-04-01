/* eslint no-use-before-define: ["error", "nofunc"] */
/* eslint require-await: "error" */

// @ts-check

jest.mock('@azure/cosmos')

const { testBasicFunctionExport } = require('../../test/lib')

const CosmosDbUtils = require('./cosmosDb')

const {
  createDatabase,
  createContainer,
  getContainerByDatabase,
  getContainerThroughput,
  setContainerThroughput
} = CosmosDbUtils

const { getGlobalTestData, getTestData } = require('./cosmosDb.test-data')

const Global = getGlobalTestData()

describe('Helper module "cosmosDb"', () => {
  const callbackNames = getTestData('function-list')

  callbackNames.forEach(runAllBasicTestsAboutSingleFunction)

  runAdditionalTestsAboutCreateContainer()
  runAdditionalTestsAboutSetContainerThroughput()
})

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
          prepareDatabase || false,
          prepareContainer || false
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

function runAdditionalTestsAboutCreateContainer() {
  const { containerId: containerName, initialThroughput: throughput } = Global.testData

  describe('has createContainer() that also', () => {
    it("- when called twice with same arguments - doesn't create new object", async () => {
      const { database } = await _prepareTestDatabaseAndContainer(true, false)

      const validArgs = [{ database, containerName, throughput }]

      const firstContainer = await _testRunAsync(createContainer, validArgs)
      const secondContainer = await _testRunAsync(createContainer, validArgs)

      expect(firstContainer).toBeObject()
      expect(firstContainer.database).toBe(database)
      expect(firstContainer.id).toBe(containerName)

      expect(firstContainer).toEqual(secondContainer)
    })
  })
}

function runAdditionalTestsAboutSetContainerThroughput() {
  // const { cosmosClient: client } = Global
  const { containerId } = Global.testData

  describe('has setContainerThroughput() that also', () => {
    it("actually changes a container's throughput", async () => {
      const { database } = await _prepareTestDatabaseAndContainer(true, true)

      const throughputs = {}

      const container = await getContainerByDatabase(containerId, database)

      // const containerOffer1 = await getContainerOfferByClient(containerId, client)
      // throughputs.current = containerOffer1.content.offerThroughput

      throughputs.current = await getContainerThroughput(container)
      throughputs.requested = throughputs.current + 200

      await setContainerThroughput(container, throughputs.requested)

      throughputs.updated = await getContainerThroughput(container)
      // const containerOffer2 = await getContainerOfferByClient(containerId, client)
      // throughputs.updated = containerOffer2.content.offerThroughput

      expect(throughputs.updated).toBe(throughputs.requested)
    })
  })
}

async function _prepareTestDatabaseAndContainer(prepareDatabase, prepareContainer) {
  const { cosmosClient: client } = Global
  const { databaseId, containerId, initialThroughput } = Global.testData

  if (!prepareDatabase) {
    return {}
  }

  const database = await createDatabase(client, databaseId)

  const container = prepareContainer
    ? await createContainer({ database, containerName: containerId, throughput: initialThroughput })
    : null

  return { database, container }
}

async function _testRunAsync(callback, args) {
  expect(callback).toBeFunction()
  expect(args).toBeArray()

  const asyncResult = callback(...args)
  expect(asyncResult).toBeInstanceOf(Promise)

  const result = await asyncResult
  return result
}
