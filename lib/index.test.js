/* eslint no-use-before-define: ["error", "nofunc"] */
/* eslint require-await: "error" */

// @ts-check

jest.unmock('@azure/cosmos')

const { testBasicFunctionExport } = require('../test/lib')

const { createClient, getClient } = require('.')

describe('BACKWARD COMPATIBILITY: In module "kth-node-cosmos-db" - when seamlessly replacing old version 3.x', () => {
  runBasicTestsAboutCreateClient()
  runBasicTestsAboutGetClient()
})

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
