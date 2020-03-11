/* eslint-disable no-use-before-define */

jest.mock('kth-node-log')

const { getDummyMongooseModel } = require('./testlib')

const { createClient, getClient, wrap } = require('./')

const Global = {}

const MODE_DEVELOPMENT = 'development'
const MODE_PRODUCTION = 'production'

const CLIENT_METHODS = [
  'increaseCollectionThroughput',
  'updateCollectionThroughput',
  'updateAllCollectionsThroughput',
  'listCollectionsWithThroughput',
  'getCollectionThroughput',
  'resetThroughput',
  'init'
]

describe('In module "kth-node-cosmos-db" - when seamlessly replacing old version 3.x', () => {
  beforeAll(storeProcessEnv)

  runTestsAboutClientFunctions()
  runTestsAboutWrap()

  afterAll(restoreProcessEnv)
})

function runTestsAboutClientFunctions() {
  describe('- the client function/s', () => {
    testFunctionExport(createClient, 'createClient() ')
    testFunctionExport(getClient, 'getClient() ')
    runTestsAboutOutputOfClientFunctions(MODE_DEVELOPMENT)
    runTestsAboutOutputOfClientFunctions(MODE_PRODUCTION)
  })
}

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
    beforeAll(() => simulateEnvironment(mode))

    const wrongOrderTestSuffix =
      mode === MODE_DEVELOPMENT ? 'returns a dummy client object' : 'returns nothing'
    it(`- getClient() ${wrongOrderTestSuffix} if used before createClient()`, () => {
      const result = getClient()
      if (mode === MODE_DEVELOPMENT) {
        expectToBeDummyClientObject(result)
      } else {
        expect(result).toBeUndefined()
      }
    })

    const noArgumentTestSuffix =
      mode === MODE_DEVELOPMENT ? 'returns a dummy client object' : 'FAILS'
    it(`w/o arguments - createClient() ${noArgumentTestSuffix}`, () => {
      if (mode === MODE_DEVELOPMENT) {
        const result = createClient()
        expectToBeDummyClientObject(result)
      } else {
        expect(createClient).toThrow()
      }
    })

    const validArgumentTestSuffix =
      mode === MODE_DEVELOPMENT ? 'returns a dummy object' : 'returns a real object'
    it(`with valid arguments - createClient() ${validArgumentTestSuffix}`, () => {
      const result = createClient(validTestOptions)

      if (mode === MODE_DEVELOPMENT) {
        expectToBeDummyClientObject(result)
      } else {
        expectToBeRealClientObject(result)
      }
    })

    it(`- getClient() ${validArgumentTestSuffix}`, () => {
      const result = getClient()

      if (mode === MODE_DEVELOPMENT) {
        expectToBeDummyClientObject(result)
      } else {
        expectToBeRealClientObject(result)
      }
    })

    if (mode === MODE_PRODUCTION) {
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

function runTestsAboutWrap() {
  describe('- wrap()', () => {
    testFunctionExport(wrap)

    runTestsAboutOutputOfWrap(MODE_DEVELOPMENT)
    runTestsAboutOutputOfWrap(MODE_PRODUCTION)
  })
}

function runTestsAboutOutputOfWrap(mode) {
  describe(`- when called in ${mode} mode`, () => {
    beforeAll(() => simulateEnvironment(mode))

    it('w/o arguments - returns nothing', () => {
      const result = wrap()
      expect(result).toBeUndefined()
    })

    it('with numeric argument - returns same input', () => {
      const output = wrap(79)
      expect(output).toBe(79)
    })

    const modelTestSuffix =
      mode === MODE_DEVELOPMENT ? 'returns input w/o any changes' : 'changes input in place'

    it(`with argument of type Model - ${modelTestSuffix}`, () => {
      const input = getDummyMongooseModel()
      const inputKeys = Object.keys(input)

      const output = wrap(input)
      const outputKeys = Object.keys(output)

      expect(output).toBe(input)

      if (mode === MODE_DEVELOPMENT) {
        expect(inputKeys).toEqual(outputKeys)
      } else {
        expect(inputKeys).not.toEqual(outputKeys)
      }
    })
  })
}

function testFunctionExport(callback, prefix = '') {
  it(`${prefix}is still available`, () => {
    expect(callback).toBeDefined()
  })
  it(`${prefix}is still a function`, () => {
    expect(callback).toBeFunction()
  })
}

function storeProcessEnv() {
  Global.NODE_ENV = process.env.NODE_ENV
  Global.USE_COSMOS_DB = process.env.USE_COSMOS_DB
}

function restoreProcessEnv() {
  process.env.NODE_ENV = Global.NODE_ENV
  process.env.USE_COSMOS_DB = Global.USE_COSMOS_DB
}

function simulateEnvironment(mode) {
  switch (mode) {
    case MODE_DEVELOPMENT:
    case MODE_PRODUCTION:
      process.env.NODE_ENV = mode
      process.env.USE_COSMOS_DB = 'false'
      break
    default:
      throw new Error(`Unknown environment mode (${mode})`)
  }
}
