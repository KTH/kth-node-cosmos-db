/* eslint-disable no-multi-assign */
/* eslint-disable no-unused-expressions */
/* eslint-env mocha */

const mockery = require('mockery')
const expect = require('chai').expect
const documentdb = require('./mocks/documentdb')

const mockLogger = {}
mockLogger.error = mockLogger.debug = mockLogger.info = mockLogger.warn = mockLogger.init = () => {}

mockery.registerMock('kth-node-log', mockLogger)
mockery.registerMock('documentdb', documentdb)

mockery.enable({
  warnOnUnregistered: false,
  warnOnReplace: false
})

const { createClient, getClient } = require('../lib/client')

describe('Client', () => {
  it('Ask for config object if none is provided', done => {
    try {
      createClient()
    } catch (e) {
      expect(e.message).to.equal(
        'kth-node-cosmos-db: You need to pass a config object to the construct'
      )
      done()
    }
  })

  it('Require specific fields in config object', done => {
    try {
      createClient({})
    } catch (e) {
      expect(e.message.includes('host, db, collections, password, username, maxThroughput')).to.be
        .true
      done()
    }
  })

  it('Require specific fields to not be undefined', done => {
    try {
      createClient({
        host: undefined,
        db: undefined,
        collections: undefined,
        password: undefined,
        username: undefined,
        maxThroughput: undefined
      })
    } catch (e) {
      expect(e.message.includes('host, db, collections, password, username, maxThroughput')).to.be
        .true
      done()
    }
  })

  it('Can create client when correct config object is provided', done => {
    const config = {
      host: 'localhost',
      db: 'test',
      collections: [{ name: 'test', throughput: 1500 }, { name: 'test2' }],
      password: '123',
      username: 'test',
      maxThroughput: 1000
    }

    const client = createClient(config)

    expect(client).to.not.be.undefined
    done()
  })

  it('The option for collections are only allowed to contain objects', done => {
    const config = {
      host: 'localhost',
      db: 'test',
      collections: [{ name: 'test', throughput: 1500 }, 'test2'],
      password: '123',
      username: 'test',
      maxThroughput: 1000
    }

    try {
      createClient(config)
    } catch (e) {
      expect(e).to.not.be.undefined
      expect(e.message).to.equal(
        'kth-node-cosmos-db: The collections option are only allowed to contain objects'
      )
      done()
    }
  })

  it('Each object in the collections options must have a name attribute', done => {
    const config = {
      host: 'localhost',
      db: 'test',
      collections: [{ name: 'test', throughput: 1500 }, {}],
      password: '123',
      username: 'test',
      maxThroughput: 1000
    }

    try {
      createClient(config)
    } catch (e) {
      expect(e).to.not.be.undefined
      expect(e.message).to.equal(
        'kth-node-cosmos-db: One of the collection objects is missing a name'
      )
      done()
    }
  })

  it('Dont break when calling updateAllCollectionsThroughput in development', done => {
    process.env.NODE_ENV = 'development'

    const client = getClient()
    let error

    try {
      client.updateAllCollectionsThroughput()
    } catch (e) {
      error = e
    }

    expect(error).to.be.undefined
    done()
  })

  describe('Functions', () => {
    before(() => {
      process.env.NODE_ENV = 'production'

      const config = {
        host: 'localhost',
        db: 'test',
        collections: [{ name: 'test', throughput: 1500 }, { name: 'test2' }],
        password: '123',
        username: 'test',
        maxThroughput: 1000
      }

      createClient(config)
    })

    it('init', done => {
      const client = getClient()

      client.init().then(() => {
        done()
      })
    })

    it('increaseCollectionThroughput', done => {
      const client = getClient()

      client
        .increaseCollectionThroughput('test')
        .then(throughput => {
          expect(throughput).to.equal(600)
          done()
        })
        .catch(e => {
          expect(e).to.be.undefined
          done()
        })
    })

    it('updateCollectionThroughput', done => {
      const client = getClient()

      client
        .updateCollectionThroughput('test', 800)
        .then(throughput => {
          expect(throughput).to.equal(800)
          done()
        })
        .catch(e => {
          expect(e).to.be.undefined
          done()
        })
    })

    it('getCollectionThroughput', done => {
      const client = getClient()

      client
        .getCollectionThroughput('test')
        .then(offer => {
          expect(offer.content.offerThroughput).to.equal(400)
          done()
        })
        .catch(e => {
          expect(e).to.be.undefined
          done()
        })
    })

    it('updateAllCollectionsThroughput', done => {
      const client = getClient()

      client
        .updateAllCollectionsThroughput()
        .then(() => {
          done()
        })
        .catch(e => {
          expect(e).to.be.undefined
          done()
        })
    })

    it('listCollectionsWithThroughput', done => {
      const client = getClient()

      client
        .listCollectionsWithThroughput()
        .then(collections => {
          expect(collections.length).to.equal(2)
          expect(collections[0]).to.eql({ collection: 'test', throughput: 400 })
          expect(collections[1]).to.eql({ collection: 'test2', throughput: 400 })
          done()
        })
        .catch(e => {
          expect(e).to.be.undefined
          done()
        })
    })

    it('resetThroughput', done => {
      const client = getClient()

      client
        .resetThroughput()
        .then(() => {
          done()
        })
        .catch(e => {
          expect(e).to.be.undefined
          done()
        })
    })
  })
})
