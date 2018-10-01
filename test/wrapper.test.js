/* eslint-env mocha */

'use strict'

const mockery = require('mockery')
const expect = require('chai').expect
const { model } = require('./mocks/model')

const mockLogger = {}
mockLogger.error = mockLogger.debug = mockLogger.info = mockLogger.warn = mockLogger.init = function () {}

mockery.registerMock('documentdb', {})
mockery.registerMock('kth-node-log', mockLogger)

const { wrap } = require('../lib/wrapper')

describe('Wrapper', () => {
  it ('Can wrap a model', done => {
    process.env.NODE_ENV="development"
    process.env.USE_COSMOS_DB=true

    const copy = Object.assign({}, model)

    const wrappedModel = wrap(copy)
    expect(wrappedModel.find.constructor.name).to.equal('AsyncFunction')
    done()
  })

  it ('Dont wrap model if NODE_ENV="development"', done => {
    process.env.NODE_ENV="development"
    process.env.USE_COSMOS_DB=false

    const copy = Object.assign({}, model)

    const wrappedModel = wrap(copy)
    expect(wrappedModel.find).to.be.undefined
    done()
  })
})