/* eslint-env mocha */

'use strict'

const expect = require('chai').expect
const { _development } = require('../utils/development')

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