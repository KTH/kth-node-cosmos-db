/* eslint-env mocha */

'use strict'

jest.mock('kth-node-log')

const optionsUtils = require('./optionsUtils')

const MOCK_OPTIONS = {
  valid: {
    host: 'localhost',
    db: 'test',
    collections: [{ name: 'test', throughput: 1500 }, { name: 'test-2' }],
    password: '123',
    username: 'test',
    maxThroughput: 1000
  },
  missingKey: {
    host: 'localhost',
    db: 'test',
    collections: [
      { name: 'test', throughput: 1500 },
      { name: undefined, throughput: undefined }
    ],
    password: '123',
    maxThroughput: 1000
    //username: 'test'
  },
  invalideCollection: {
    host: 'localhost',
    db: 'test',
    collections: [{ name: 'test', throughput: 1500 }, {}],
    password: '123',
    username: 'test',
    maxThroughput: 1000
  }
}

test(`The mandatory options are ${optionsUtils.REQUIRED_OPTION_KEYS}.`, () => {
  expect(optionsUtils.REQUIRED_OPTION_KEYS.length).toEqual(6)
})

test('When a options that is "undefined" is passed, an Error is thrown.', () => {
  expect(() => {
    optionsUtils.validate(undefined)
  }).toThrow(Error)
})

test('When a mandatory option is missing to the CosmosClient, an Error is thrown wtesth information about which property is missing..', () => {
  try {
    optionsUtils.validate(MOCK_OPTIONS.missingKey)
  } catch (e) {
    expect(e.message).toMatch(/username/)
  }
})

test('When the options object contains all properties needed, the validation is ok.', () => {
  optionsUtils.validate(MOCK_OPTIONS.valid)
})

test('The collections that are used needs to have atleast a name, otherwise an Error is thrown.', () => {
  const validTestDrive = () => {
    optionsUtils.validate(MOCK_OPTIONS.invalideCollection)
  }

  expect(validTestDrive).toThrow('Collections needs atlease a name')
})

module.exports = {
  MOCK_OPTIONS
}
