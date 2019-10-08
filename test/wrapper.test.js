/* eslint-disable no-unused-expressions */
/* eslint-disable no-multi-assign */
/* eslint-env mocha */

const mockery = require('mockery')
const expect = require('chai').expect
const { model } = require('./mocks/model')

const mockLogger = {}
mockLogger.error = mockLogger.debug = mockLogger.info = mockLogger.warn = mockLogger.init = () => {}

mockery.registerMock('documentdb', {})
mockery.registerMock('kth-node-log', mockLogger)

const { wrap } = require('../lib/wrapper')

describe('Wrapper', () => {
  it('Can wrap a model', done => {
    process.env.NODE_ENV = 'development'
    process.env.USE_COSMOS_DB = true

    const copy = Object.assign({}, model)

    const wrappedModel = wrap(copy)
    expect(wrappedModel.find.constructor.name).to.equal('AsyncFunction')
    done()
  })

  it('Dont wrap model if NODE_ENV="development"', done => {
    process.env.NODE_ENV = 'development'
    process.env.USE_COSMOS_DB = false

    const copy = Object.assign({}, model)

    const wrappedModel = wrap(copy)
    expect(wrappedModel.find).to.be.undefined
    done()
  })
})

describe('Wrapper supported functions', () => {
  const wrappedModel = wrap(Object.assign({}, model))

  it('findOneAndUpdate', async () => {
    Object.getPrototypeOf(wrappedModel).findOneAndUpdate = () => {}

    let error
    try {
      await wrappedModel.findOneAndUpdate({}, {}, {})
    } catch (e) {
      error = e
    }

    expect(error).to.be.undefined
  })

  it('findById', async () => {
    Object.getPrototypeOf(wrappedModel).findById = () => {}

    let error
    try {
      await wrappedModel.findById({}, {}, {})
    } catch (e) {
      error = e
    }

    expect(error).to.be.undefined
  })

  it('save', async () => {
    Object.getPrototypeOf(wrappedModel).save = () => {}

    let error
    try {
      await wrappedModel.save({}, {}, {})
    } catch (e) {
      error = e
    }

    expect(error).to.be.undefined
  })

  it('update', async () => {
    Object.getPrototypeOf(wrappedModel).update = () => {}

    let error
    try {
      await wrappedModel.update({}, {}, {})
    } catch (e) {
      error = e
    }

    expect(error).to.be.undefined
  })

  it('updateOne', async () => {
    Object.getPrototypeOf(wrappedModel).updateOne = () => {}

    let error
    try {
      await wrappedModel.updateOne({}, {}, {})
    } catch (e) {
      error = e
    }

    expect(error).to.be.undefined
  })

  it('updateMany', async () => {
    Object.getPrototypeOf(wrappedModel).updateMany = () => {}

    let error
    try {
      await wrappedModel.updateMany({}, {}, {})
    } catch (e) {
      error = e
    }

    expect(error).to.be.undefined
  })

  it('findOne', async () => {
    Object.getPrototypeOf(wrappedModel).findOne = () => {}

    let error
    try {
      await wrappedModel.findOne({}, {}, {})
    } catch (e) {
      error = e
    }

    expect(error).to.be.undefined
  })

  it('find', async () => {
    Object.getPrototypeOf(wrappedModel).find = () => {}

    let error
    try {
      await wrappedModel.find({}, {}, {})
    } catch (e) {
      error = e
    }

    expect(error).to.be.undefined
  })

  it('remove', async () => {
    Object.getPrototypeOf(wrappedModel).remove = () => {}

    let error
    try {
      await wrappedModel.remove({}, {}, {})
    } catch (e) {
      error = e
    }

    expect(error).to.be.undefined
  })
})
