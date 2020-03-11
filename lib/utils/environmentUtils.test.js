/* eslint-env mocha */

'use strict'

const { useMongoNative } = require('./environmentUtils')

test('When env NODE_ENV is set to "development" and env USE_COSMOS_DB is not set to "true". Use native Mongo wtesthoout Cosmos features.', () => {
  process.env.NODE_ENV = 'development'
  expect(useMongoNative()).toEqual(true)
})

test('When env NODE_ENV is set to "development" and USE_COSMOS_DB is not set to "true". Use Cosmos features for developement.', () => {
  process.env.NODE_ENV = 'development'
  process.env.USE_COSMOS_DB = true
  expect(useMongoNative()).toEqual(false)
  delete process.env.USE_COSMOS_DB
})

test('When env NODE_ENV is set to "production" the client always uses Cosmos features.', () => {
  process.env.NODE_ENV = 'production'
  process.env.USE_COSMOS_DB = false
  expect(useMongoNative()).toEqual(false)
  delete process.env.USE_COSMOS_DB
})
