/* eslint-disable no-use-before-define */

const mongoose = require('mongoose')

jest.mock('./utils')
const utils = require('./utils') // eslint-disable-line import/newline-after-import
utils.useMongoNative = jest.fn().mockReturnValue(false)

const { wrap } = require('./mongooseModelWrapper')

describe('Public function wrap()', () => {
  it('is accessible', () => {
    expect(wrap).toBeFunction()
  })

  runTestsAboutWrapWithInvalidParameters()
  runTestsAboutWrapWithValidParameters()
  // runTestsAboutWrappedMethods()
})

function runTestsAboutWrapWithInvalidParameters() {
  it('- when called without any parameter - returns nothing', () => {
    const result = wrap()
    expect(result).toBeUndefined()
  })

  it('- when called with invalid Model parameter - returns same input', () => {
    const result = wrap(79)
    expect(result).toBe(79)
  })
}

function runTestsAboutWrapWithValidParameters() {
  describe('- when called with valid Model parameter', () => {
    it('- returns same input object', () => {
      const validModel = getTestModel()

      const result = wrap(validModel)

      expect(result).toBe(validModel)
    })

    it('(in native mode) - changes no internal methods', () => {
      utils.useMongoNative.mockReturnValueOnce(true)
      const validModel = getTestModel()

      const { changed } = callWrapAndObserveInternalMethods(validModel)

      expect(changed).toBeEmpty()
      expect(validModel._getMethodsBeforeWrapping).toBeUndefined()
      expect(utils.useMongoNative).toHaveBeenCalledTimes(1)
    })

    it('- changes expected internal methods', () => {
      const validModel = getTestModel()

      const { changed } = callWrapAndObserveInternalMethods(validModel)

      expect(changed).toMatchInlineSnapshot(`
        Array [
          "find",
          "findById",
          "findOne",
          "findOneAndUpdate",
          "remove",
          "save",
          "update",
          "updateMany",
          "updateOne",
        ]
      `)

      if (typeof validModel._getMethodsBeforeWrapping === 'function') {
        const cache = validModel._getMethodsBeforeWrapping()
        const cacheKeys = Object.keys(cache).sort()
        expect(cacheKeys).toEqual(changed)
      }
    })

    it('- overloads find() exactly as expected', () => {
      const validModel = getTestModel()

      wrap(validModel)

      expect(validModel.find.toString()).toMatchInlineSnapshot(`
"async function wrapper(...args) {
    let result;
    const client = await getClient();

    try {
      result = await this.__proto__[name].apply(this, args);

      if (client.batchSize) {
        result = result.batchSize(client.batchSize);
      }
    } catch (error) {
      result = handleError(error, client, this, this[name], args);
    }

    return result;
  }"
`)
    })

    it("- doesn't remove any internal method", () => {
      const validModel = getTestModel()

      const { changed, removed } = callWrapAndObserveInternalMethods(validModel)

      expect(changed).not.toBeEmpty()
      expect(removed).toBeEmpty()
    })
  })
}

let testModelSerialNumber = 1
function getTestModel() {
  const schema = new mongoose.Schema({ name: 'string', age: 'string' })
  const model = mongoose.model(`Test-${testModelSerialNumber}`, schema)
  testModelSerialNumber += 1
  return model
}

function callWrapAndObserveInternalMethods(model) {
  const result = {
    before: collectAllInternalMethods(model)
  }

  wrap(model)

  result.after = collectAllInternalMethods(model)

  result.changed = getObjectKeysWithDifferentValues(result.before, result.after)
    .filter(name => name !== '_getMethodsBeforeWrapping')
    .sort()

  result.removed = result.changed.filter(name => result.after[name] == null)

  return result
}

function collectAllInternalMethods(input) {
  if (typeof input !== 'object' && typeof input !== 'function') {
    return {}
  }

  const keys = Object.keys(input)
  const prototype = Object.getPrototypeOf(input)
  const prototypeKeys = Object.keys(prototype)

  const result = {}

  keys.forEach(key => {
    const value = input[key]
    if (typeof value === 'function') {
      result[key] = value
    }
  })

  prototypeKeys.forEach(key => {
    const value = prototype[key]
    if (typeof value === 'function') {
      result[`prototype/${key}`] = value
    }
  })

  return result
}

function getObjectKeysWithDifferentValues(input1, input2) {
  if (
    input1 == null ||
    typeof input1 !== 'object' ||
    input2 == null ||
    typeof input2 !== 'object'
  ) {
    return []
  }

  const keys1 = Object.keys(input1)
  const diffKeys1 = keys1.filter(key => input1[key] !== input2[key])

  const keys2only = Object.keys(input2).filter(key => input1[key] == null)

  return [...diffKeys1, ...keys2only]
}

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
