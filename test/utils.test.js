/* eslint-env mocha */

'use strict'

const expect = require('chai').expect
const { _development } = require('../utils/development')
const { handleError } = require('../utils/handleError')

describe('Util development', () => {
  it ('return true if NODE_ENV="development"', done => {
    const res = _development({
      NODE_ENV: 'development'
    })
    expect(res).to.equal(true)
    done()
  })

  it ('return false if NODE_ENV="production"', done => {
    const res = _development({
      NODE_ENV: 'production'
    })
    expect(res).to.equal(false)
    done()
  })

  it ('return false if NODE_ENV="development" and USE_COSMOS_DB="true"', done => {
    const res = _development({
      NODE_ENV: 'development',
      USE_COSMOS_DB: 'true'
    })
    expect(res).to.equal(false)
    done()
  })
})

describe('Util handleError', () => {

  it('Handle all types of Request rate is too large errors', done => {
    process.env.NODE_ENV="development"
    process.env.USE_COSMOS_DB=true

    let count = 0

    const client = {
      increaseCollectionThroughput: tmp => {
        count++
      }
    }

    const model = {
      collection: {
        collectionName: "test"
      }
    }

    const error = {
      message: "Request rate is large"
    }

    const error2 = {
      message: {
        errors: [
          "Request rate is large"
        ]
      }
    }

    const error3 = "Message: {Errors: ['Request rate is large']}"
    const error4 = "Message"

    handleError(error, client, model, args => {
      handleError(error2, client, model, args => {
        handleError(error3, client, model, args => {
          handleError(error4, client, model, args => {}).catch(e => {
            expect(count).to.equal(3)
            expect(e).to.equal('Message')
            done()  
          })
        })
      })
    })
  })
})