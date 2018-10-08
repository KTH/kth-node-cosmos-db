/* eslint-env mocha */

'use strict'

const mockery = require('mockery')
const expect = require('chai').expect
const model = require('./mocks/model')
const documentdb = require('./mocks/documentdb')

const mockLogger = {}
mockLogger.error = mockLogger.debug = mockLogger.info = mockLogger.warn = mockLogger.init = function () {}

mockery.registerMock('kth-node-log', mockLogger)
mockery.registerMock('documentdb', documentdb)

mockery.enable({
  warnOnUnregistered: false,
  warnOnReplace: false
})

const { initClient, getClient } = require('../lib/client')

describe('Client', () => {
  it('Ask for config object if none is provided', done => {
    const client = initClient().catch(e => {
      expect(e.message).to.equal("You need to pass a config object to the construct")
      done()      
    })
  })

  it('Require specific fields in config object', done => {
    const client = initClient({}).catch(e => {
      expect(e.fields).to.equal("host, db, collections, password, username, maxThroughput")
      expect(e.message).to.equal("One or more of the required config options is missing, please add these to the conf object")
      done()      
    })
  })

  it('Can create client when correct config object is provided', done => {
    const config = {
      host: 'localhost',
      db: 'test',
      collections: ['test'],
      password: '123',
      username: 'test',
      maxThroughput: 1000,
      log: mockLogger
    }

    const client = initClient(config).then(client => {
      expect(client).to.not.be.undefined
      done()
    })
  })

  it('Dont break when calling updateAllCollectionsThroughput in development', done => {
    process.env.NODE_ENV='development'

    const client = getClient().then(client => {
      let error
      try {
        client.updateAllCollectionsThroughput()
      } catch (e) {
        error = e
      }
      expect(error).to.be.undefined
      done()
    })
  })
})
