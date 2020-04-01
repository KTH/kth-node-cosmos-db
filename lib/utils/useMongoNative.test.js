'use strict'

const useMongoNative = require('./useMongoNative')

const { Environment } = require('../../test/lib')

describe('Helper function useMongoNative()', () => {
  beforeAll(Environment.saveState)
  afterAll(Environment.restoreState)

  it('- when env NODE_ENV is set to "development" and env USE_COSMOS_DB is not set to "true". Use native Mongo without Cosmos features.', () => {
    process.env.NODE_ENV = 'development'
    delete process.env.USE_COSMOS_DB

    expect(useMongoNative()).toEqual(true)
  })

  it('When env NODE_ENV is set to "development" and USE_COSMOS_DB is not set to "true". Use Cosmos features for development.', () => {
    process.env.NODE_ENV = 'development'
    process.env.USE_COSMOS_DB = true

    expect(useMongoNative()).toEqual(false)
  })

  it('When env NODE_ENV is set to "production" the client always uses Cosmos features.', () => {
    process.env.NODE_ENV = 'production'
    process.env.USE_COSMOS_DB = false

    expect(useMongoNative()).toEqual(false)
  })
})
