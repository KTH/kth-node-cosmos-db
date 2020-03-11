/* eslint-disable no-unused-expressions */
/* eslint-disable no-multi-assign */
/* eslint-env mocha */

test('Empty', () => {
  expect(1).toEqual(1)
})
/*
const mockery = require('mockery')

const { model } = require('../test/mocks/model')

const mockLogger = {}
mockLogger.error = mockLogger.debug = mockLogger.info = mockLogger.warn = mockLogger.intest = () => {}

mockery.registerMock('documentdb', {})
mockery.registerMock('kth-node-log', mockLogger)

const { wrap } = require('./wrapper')

test('Can wrap a model', () => {
  process.env.NODE_ENV = 'development'
  process.env.USE_COSMOS_DB = true

  const copy = Object.assign({}, model)

  const wrappedModel = wrap(copy)
  expect(wrappedModel.find.constructor.name).toEqual('AsyncFunction')
})

test('Dont wrap model if NODE_ENV="development"', () => {
  process.env.NODE_ENV = 'development'
  process.env.USE_COSMOS_DB = false

  const copy = Object.assign({}, model)

  const wrappedModel = wrap(copy)
  expect(wrappedModel.find).toBeUndefined
})

const wrappedModel = wrap(Object.assign({}, model))

test('findOneAndUpdate', async () => {
  Object.getPrototypeOf(wrappedModel).findOneAndUpdate = () => {}

  let error
  try {
    awatest wrappedModel.findOneAndUpdate({}, {}, {})
  } catch (e) {
    error = e
  }

  expect(error).toBeUndefined
})

test('findById', async () => {
  Object.getPrototypeOf(wrappedModel).findById = () => {}

  let error
  try {
    awatest wrappedModel.findById({}, {}, {})
  } catch (e) {
    error = e
  }

  expect(error).toBeUndefined
})

test('save', async () => {
  Object.getPrototypeOf(wrappedModel).save = () => {}

  let error
  try {
    awatest wrappedModel.save({}, {}, {})
  } catch (e) {
    error = e
  }

  expect(error).toBeUndefined
})

test('update', async () => {
  Object.getPrototypeOf(wrappedModel).update = () => {}

  let error
  try {
    awatest wrappedModel.update({}, {}, {})
  } catch (e) {
    error = e
  }

  expect(error).toBeUndefined
})

test('updateOne', async () => {
  Object.getPrototypeOf(wrappedModel).updateOne = () => {}

  let error
  try {
    awatest wrappedModel.updateOne({}, {}, {})
  } catch (e) {
    error = e
  }

  expect(error).to.be.undefined
})

test('updateMany', async () => {
  Object.getPrototypeOf(wrappedModel).updateMany = () => {}

  let error
  try {
    awatest wrappedModel.updateMany({}, {}, {})
  } catch (e) {
    error = e
  }

  expect(error).to.be.undefined
})

test('findOne', async () => {
  Object.getPrototypeOf(wrappedModel).findOne = () => {}

  let error
  try {
    awatest wrappedModel.findOne({}, {}, {})
  } catch (e) {
    error = e
  }

  expect(error).to.be.undefined
})

test('find', async () => {
  Object.getPrototypeOf(wrappedModel).find = () => {}

  let error
  try {
    awatest wrappedModel.find({}, {}, {})
  } catch (e) {
    error = e
  }

  expect(error).to.be.undefined
})

test('remove', async () => {
  Object.getPrototypeOf(wrappedModel).remove = () => {}

  let error
  try {
    awatest wrappedModel.remove({}, {}, {})
  } catch (e) {
    error = e
  }

  expect(error).to.be.undefined
})
*/
