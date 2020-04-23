'use strict'

const useMongoNative = require('./useMongoNative')

const { Environment } = require('../../test/lib')

describe('Helper function useMongoNative()', () => {
  beforeAll(Environment.saveState)
  afterAll(Environment.restoreState)

  it('- when NODE_ENV is "development" and USE_COSMOS_DB is not "true" - lets the client use native Mongo w/o Cosmos features', () => {
    process.env.NODE_ENV = 'development'
    delete process.env.USE_COSMOS_DB

    expect(useMongoNative()).toEqual(true)
  })

  it('- when NODE_ENV is "development" and USE_COSMOS_DB is "true" - activates Cosmos features for development', () => {
    process.env.NODE_ENV = 'development'
    process.env.USE_COSMOS_DB = 'true'

    expect(useMongoNative()).toEqual(false)
  })

  it('- when NODE_ENV is "production" - lets the client always use Cosmos features', () => {
    process.env.NODE_ENV = 'production'
    process.env.USE_COSMOS_DB = false

    expect(useMongoNative()).toEqual(false)
  })
})
