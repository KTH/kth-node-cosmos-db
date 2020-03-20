/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

const { getTestOptions } = require('./utils/options.test-data')

const { Environment } = require('../testlib')

const { createClient, getClient } = require('./client')
const CosmosClientWrapper = require('./CosmosClientWrapper')

const PUBLIC_CLIENT_METHODS = CosmosClientWrapper.getListOfPublicMethods()

describe('Public client functions', () => {
  beforeAll(Environment.saveState)

  const modes = [Environment.MODE_DEVELOPMENT, Environment.MODE_PRODUCTION]

  modes.forEach(runTestsAboutGetClientWhenUsedTooEarly)
  modes.forEach(runTestsAboutCreateClient)
  modes.forEach(runTestsAboutGetClient)

  afterAll(Environment.restoreState)
})

function runTestsAboutGetClientWhenUsedTooEarly(mode) {
  describe('include getClient() that - when used too early', () => {
    beforeAll(() => Environment.simulate(mode))

    const isDevMode = mode === Environment.MODE_DEVELOPMENT

    const tooEarlyResultText = isDevMode ? 'returns dummy client object' : 'returns nothing'

    it(`in mode "${mode}" - ${tooEarlyResultText}`, () => {
      const result = getClient()

      if (isDevMode) {
        _expectToBeDummyClientObject(result)
      } else {
        expect(result).toBeUndefined()
      }
    })
  })
}

function runTestsAboutCreateClient(mode) {
  describe('include createClient() that - when used', () => {
    beforeAll(() => Environment.simulate(mode))

    const modePrefix = `in mode "${mode}"`
    const isDevMode = mode === Environment.MODE_DEVELOPMENT

    const validArgsResultText = isDevMode
      ? 'returns dummy client object'
      : 'returns real client object'

    it(`${modePrefix} with valid options - ${validArgsResultText}`, () => {
      const validOptions = getTestOptions('valid')

      const result = createClient(validOptions)

      if (isDevMode) {
        _expectToBeDummyClientObject(result)
      } else {
        _expectToBeRealClientObject(result)
      }
    })

    const invalidArgsResultText = isDevMode ? 'returns dummy client object' : 'FAILS as expected'

    it(`${modePrefix} with incomplete options - ${invalidArgsResultText}`, () => {
      const invalidOptions = getTestOptions('missingKey')
      if (isDevMode) {
        const result = createClient(invalidOptions)
        _expectToBeDummyClientObject(result)
      } else {
        expect(() => createClient(invalidOptions)).toThrow('config options are missing')
      }
    })

    const noArgsResultText = isDevMode ? 'returns dummy client object' : 'FAILS as expected'

    it(`${modePrefix} with no options - ${noArgsResultText}`, () => {
      if (isDevMode) {
        // @ts-ignore
        const result = createClient()
        _expectToBeDummyClientObject(result)
      } else {
        expect(createClient).toThrow('need to pass a config object')
      }
    })
  })
}

function runTestsAboutGetClient(mode) {
  describe('include getClient() that - when used', () => {
    beforeAll(() => Environment.simulate(mode))

    const modePrefix = `in mode "${mode}"`
    const isDevMode = mode === Environment.MODE_DEVELOPMENT

    const validArgsResultText = isDevMode
      ? 'returns dummy client object'
      : 'returns real client object'

    it(`${modePrefix} - ${validArgsResultText}`, () => {
      const result = getClient()

      if (isDevMode) {
        _expectToBeDummyClientObject(result)
      } else {
        _expectToBeRealClientObject(result)
      }
    })

    it(`${modePrefix} twice - returns same object`, () => {
      const result1 = getClient()
      const result2 = getClient()

      expect(result1).toBe(result2)
    })
  })
}

function _expectToBeRealClientObject(result) {
  expect(result).toBeObject()

  PUBLIC_CLIENT_METHODS.forEach(name => {
    expect(result[name]).toBeFunction()
  })

  expect(result.init.toString()).not.toMatch('log.info')
}

function _expectToBeDummyClientObject(result) {
  expect(result).toBeObject()

  PUBLIC_CLIENT_METHODS.forEach(name => {
    expect(result[name]).toBeFunction()
  })

  expect(result.init.toString()).toMatch('log.info')
}
