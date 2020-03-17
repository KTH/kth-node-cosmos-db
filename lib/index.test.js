/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

jest.mock('kth-node-log')

const { testBasicFunctionExport } = require('../testlib')

const { wrap, createClient, getClient } = require('.')

describe('BACKWARD COMPATIBILITY: In module "kth-node-cosmos-db" - when seamlessly replacing old version 3.x', () => {
  runBasicTestsAboutWrap()
  runBasicTestsAboutCreateClient()
  runBasicTestsAboutGetClient()
})

function runBasicTestsAboutWrap() {
  describe('- the Mongoose model wrapper wrap()', () => {
    testBasicFunctionExport(wrap)
  })
}

function runBasicTestsAboutCreateClient() {
  describe('- the client function createClient()', () => {
    testBasicFunctionExport(createClient)
  })
}

function runBasicTestsAboutGetClient() {
  describe('- the client function getClient()', () => {
    testBasicFunctionExport(getClient)
  })
}
