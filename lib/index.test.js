/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

jest.mock('kth-node-log')

const { Environment, getDummyMongooseModel, testBasicFunctionExport } = require('../testlib')

const { createClient, getClient, wrap } = require('.')

const CLIENT_METHODS = [
  'increaseCollectionThroughput',
  'updateCollectionThroughput',
  'updateAllCollectionsThroughput',
  'listCollectionsWithThroughput',
  'getCollectionThroughput',
  'resetThroughput',
  'init'
]

describe('BACKWARD COMPATIBILITY: In module "kth-node-cosmos-db" - when seamlessly replacing old version 3.x', () => {
  beforeAll(Environment.saveState)

  runTestsAboutClientFunctions()
  runTestsAboutWrap()

  afterAll(Environment.restoreState)
})

function runTestsAboutClientFunctions() {
  describe('- the client function/s', () => {
    testBasicFunctionExport(createClient, 'createClient()')
    testBasicFunctionExport(getClient, 'getClient()')
    runTestsAboutOutputOfClientFunctions(Environment.MODE_DEVELOPMENT)
    runTestsAboutOutputOfClientFunctions(Environment.MODE_PRODUCTION)
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

function runTestsAboutWrap() {
  describe('- wrap()', () => {
    testBasicFunctionExport(wrap)

    runTestsAboutOutputOfWrap(Environment.MODE_DEVELOPMENT)
    runTestsAboutOutputOfWrap(Environment.MODE_PRODUCTION)
  })
}

function runTestsAboutOutputOfWrap(mode) {
  describe(`- when called in ${mode} mode`, () => {
    beforeAll(() => Environment.simulate(mode))

    it('w/o arguments - returns nothing', () => {
      // @ts-ignore
      const result = wrap()
      expect(result).toBeUndefined()
    })

    it('with numeric argument - returns same input', () => {
      const output = wrap(79)
      expect(output).toBe(79)
    })

    const modelTestSuffix =
      mode === Environment.MODE_DEVELOPMENT
        ? 'returns input w/o any changes'
        : 'changes input in place'

    it(`with argument of type Model - ${modelTestSuffix}`, () => {
      const input = getDummyMongooseModel()
      const inputKeys = Object.keys(input)

      const output = wrap(input)
      const outputKeys = Object.keys(output)

      expect(output).toBe(input)

      if (mode === Environment.MODE_DEVELOPMENT) {
        expect(inputKeys).toEqual(outputKeys)
      } else {
        expect(inputKeys).not.toEqual(outputKeys)
      }
    })
  })
}
