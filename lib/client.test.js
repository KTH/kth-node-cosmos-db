/* eslint no-use-before-define: ["error", "nofunc"] */

jest.mock('@azure/cosmos')

const { getTestOptions } = require('./utils/options.test-data')

const { Environment } = require('../testlib')

const { createClient, getClient } = require('./client')
const CosmosClientWrapper = require('./CosmosClientWrapper')

const CLIENT_METHODS = [
  'increaseCollectionThroughput',
  'updateCollectionThroughput',
  'updateAllCollectionsThroughput',
  'listCollectionsWithThroughput',
  'getCollectionThroughput',
  'resetThroughput',
  'init'
]

describe('CosmosDB client function/s', () => {
  beforeAll(Environment.saveState)

  runTestsAboutOutputOfClientFunctions(Environment.MODE_DEVELOPMENT)
  runTestsAboutOutputOfClientFunctions(Environment.MODE_PRODUCTION)

  runTestsAboutCreateClient(Environment.MODE_DEVELOPMENT)
  runTestsAboutGetClient(Environment.MODE_DEVELOPMENT)

  runTestsAboutCreateClient(Environment.MODE_PRODUCTION)
  runTestsAboutGetClient(Environment.MODE_PRODUCTION)

  runTestsAboutPublicMethods()

  afterAll(Environment.restoreState)
})

function runTestsAboutOutputOfClientFunctions(mode) {
  const validTestOptions = {
    host: 'test',
    db: 'test',
    collections: [{ name: 'testCollection' }],
    password: 'test',
    username: 'test',
    maxThroughput: 1000
  }

  describe(`- when used in ${mode} mode`, () => {
    beforeAll(() => Environment.simulate(mode))

    const wrongOrderTestSuffix =
      mode === Environment.MODE_DEVELOPMENT ? 'returns a dummy client object' : 'returns nothing'
    it(`- getClient() ${wrongOrderTestSuffix} if used before createClient()`, () => {
      const result = getClient()
      if (mode === Environment.MODE_DEVELOPMENT) {
        expectToBeDummyClientObject(result)
      } else {
        expect(result).toBeUndefined()
      }
    })

    const noArgumentTestSuffix =
      mode === Environment.MODE_DEVELOPMENT ? 'returns a dummy client object' : 'FAILS'
    it(`w/o arguments - createClient() ${noArgumentTestSuffix}`, () => {
      if (mode === Environment.MODE_DEVELOPMENT) {
        // @ts-ignore
        const result = createClient()
        expectToBeDummyClientObject(result)
      } else {
        expect(createClient).toThrow()
      }
    })

    const validArgumentTestSuffix =
      mode === Environment.MODE_DEVELOPMENT ? 'returns a dummy object' : 'returns a real object'
    it(`with valid arguments - createClient() ${validArgumentTestSuffix}`, () => {
      const result = createClient(validTestOptions)

      if (mode === Environment.MODE_DEVELOPMENT) {
        expectToBeDummyClientObject(result)
      } else {
        expectToBeRealClientObject(result)
      }
    })

    it(`- getClient() ${validArgumentTestSuffix}`, () => {
      const result = getClient()

      if (mode === Environment.MODE_DEVELOPMENT) {
        expectToBeDummyClientObject(result)
      } else {
        expectToBeRealClientObject(result)
      }
    })

    if (mode === Environment.MODE_PRODUCTION) {
      it('- getClient() returns same object if called twice', () => {
        const result1 = getClient()
        const result2 = getClient()

        expectToBeRealClientObject(result1)
        expectToBeRealClientObject(result2)

        expect(result1).toBe(result2)
      })
    }
  })
}

function expectToBeRealClientObject(result) {
  expect(result).toBeObject()

  CLIENT_METHODS.forEach(name => {
    expect(result[name]).toBeFunction()
  })

  expect(result.init.toString()).not.toMatch('log.info')
}

function expectToBeDummyClientObject(result) {
  expect(result).toBeObject()

  CLIENT_METHODS.forEach(name => {
    expect(result[name]).toBeFunction()
  })

  expect(result.init.toString()).toMatch('log.info')
}

function runTestsAboutCreateClient(mode) {
  describe(`createClient() - when used in mode "${mode}"`, () => {
    beforeAll(() => Environment.simulate(mode))

    it('with valid arguments - works as expected', () => {
      const validOptions = getTestOptions('valid')

      const result = createClient(validOptions)

      expect(result).toBeObject()

      if (mode === Environment.MODE_DEVELOPMENT) {
        expect(result).not.toBeInstanceOf(CosmosClientWrapper)
      } else {
        expect(result).toBeInstanceOf(CosmosClientWrapper)
      }
    })

    it.todo('with invalid arguments - FAILS as expected')
    it.todo('with no arguments - FAILS as expected')
  })

  // test('When passing valid options, createClient({..}) returns a CosmosClientWrapper.', () => {
  //   process.env.NODE_ENV = 'production'
  //   const cosmosClientWrapper = createClient(getTestOptions('valid'))
  //   expect(cosmosClientWrapper).not.toBeUndefined()
  // })
}

function runTestsAboutGetClient(mode) {
  describe(`getClient() - when used in mode "${mode}"`, () => {
    beforeAll(() => Environment.simulate(mode))

    // let client
    // beforeEach(() => {
    //   client = createClient(getTestOptions('valid'))
    // })

    it.todo('- delivers object with expected public methods')
  })
}

function runTestsAboutPublicMethods() {
  describe.skip(`getClient() returns an object with`, () => {
    runTestsAboutIncreateCollectionThroughput()
    runTestsAboutUpdateCollectionThroughput()
    runTestsAboutUpdateAllCollectionsThroughput()
    runTestsAboutListCollectionsWithThroughput()
    runTestsAboutGetCollectionThroughput()
    runTestsAboutResetThroughput()

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

function runTestsAboutIncreateCollectionThroughput() {}
function runTestsAboutUpdateCollectionThroughput() {}
function runTestsAboutUpdateAllCollectionsThroughput() {}
function runTestsAboutListCollectionsWithThroughput() {}
function runTestsAboutGetCollectionThroughput() {}
function runTestsAboutResetThroughput() {}
