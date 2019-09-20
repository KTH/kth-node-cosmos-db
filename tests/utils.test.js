/* eslint-env mocha */

'use strict'

const expect = require('chai').expect

const { MongoError } = require('mongodb-core')

const { _development } = require('../lib/utils/development')
const { handleError } = require('../lib/utils/handleError')

describe('Util', () => {
  describe('development', () => {
    it('return true if NODE_ENV="development"', done => {
      const res = _development({
        NODE_ENV: 'development'
      })
      expect(res).to.equal(true)
      done()
    })

    it('return false if NODE_ENV="production"', done => {
      const res = _development({
        NODE_ENV: 'production'
      })
      expect(res).to.equal(false)
      done()
    })

    it('return false if NODE_ENV="development" and USE_COSMOS_DB="true"', done => {
      const res = _development({
        NODE_ENV: 'development',
        USE_COSMOS_DB: 'true'
      })
      expect(res).to.equal(false)
      done()
    })
  })

  describe('handleError', () => {
    it('Handle all types of Request rate is too large errors', done => {
      process.env.NODE_ENV = 'development'
      process.env.USE_COSMOS_DB = true

      let count = 0

      const client = {
        increaseCollectionThroughput: () => {
          count++
        }
      }

      const model = {
        collection: {
          collectionName: 'test'
        }
      }

      const error = new MongoError('Request rate is large')
      const error2 = new MongoError('Message: { Errors: ["Request rate is large"] }')
      const error3 = new Error('Message')

      handleError(error, client, model, () => {
        handleError(error2, client, model, () => {
          handleError(error3, client, model).catch(e => {
            expect(count).to.equal(2)
            expect(e.message).to.equal('Message')
            done()
          })
        })
      })
    })
  })
})
