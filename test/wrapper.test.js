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

describe('Wrapper supported functions', () => {
  const wrappedModel = wrap(Object.assign({}, model))
  
  it('findOneAndUpdate', async () => {
    wrappedModel.__proto__.findOneAndUpdate = () => {}

    let error
    try {
      await wrappedModel.findOneAndUpdate({}, {}, {})
    } catch (e) {
      error = e
    }

    expect(error).to.be.undefined
  })

  it('findById', async () => {
    wrappedModel.__proto__.findById = () => {}

    let error
    try {
      await wrappedModel.findById({}, {}, {})
    } catch (e) {
      error = e
    }

    expect(error).to.be.undefined
  })

  it('save', async () => {
    wrappedModel.__proto__.save = () => {}

    let error
    try {
      await wrappedModel.save({}, {}, {})
    } catch (e) {
      error = e
    }

    expect(error).to.be.undefined
  })

  it('update', async () => {
    wrappedModel.__proto__.update = () => {}

    let error
    try {
      await wrappedModel.update({}, {}, {})
    } catch (e) {
      error = e
    }

    expect(error).to.be.undefined
  })
  
  it('updateOne', async () => {
    wrappedModel.__proto__.updateOne = () => {}

    let error
    try {
      await wrappedModel.updateOne({}, {}, {})
    } catch (e) {
      error = e
    }

    expect(error).to.be.undefined
  })

  it('updateMany', async () => {
    wrappedModel.__proto__.updateMany = () => {}

    let error
    try {
      await wrappedModel.updateMany({}, {}, {})
    } catch (e) {
      error = e
    }

    expect(error).to.be.undefined
  })

  it('findOne', async () => {
    wrappedModel.__proto__.findOne = () => {}

    let error
    try {
      await wrappedModel.findOne({}, {}, {})
    } catch (e) {
      error = e
    }

    expect(error).to.be.undefined
  })

  it('find', async () => {
    wrappedModel.__proto__.find = () => {}

    let error
    try {
      await wrappedModel.find({}, {}, {})
    } catch (e) {
      error = e
    }

    expect(error).to.be.undefined
  })

  it('remove', async () => {
    wrappedModel.__proto__.remove = () => {}

    let error
    try {
      await wrappedModel.remove({}, {}, {})
    } catch (e) {
      error = e
    }

    expect(error).to.be.undefined
  })
})