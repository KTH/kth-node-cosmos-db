/* eslint-disable no-use-before-define */

const {
  collectAllInternalMethods,
  getObjectKeysWithDifferentValues,
  getDummyMongooseModel
} = require('../testlib')

jest.mock('./utils')
const utils = require('./utils') // eslint-disable-line import/newline-after-import
utils.useMongoNative = jest.fn().mockReturnValue(false)

const { wrap } = require('./mongooseModelWrapper')

const METHODS_OVERLOADED_BY_WRAP = [
  'find',
  'findById',
  'findOne',
  'findOneAndUpdate',
  'remove',
  'save',
  'update',
  'updateMany',
  'updateOne'
]

describe('Public function wrap()', () => {
  it('is accessible', () => {
    expect(wrap).toBeFunction()
  })

  runTestsAboutWrapWithInvalidParameters()
  runTestsAboutWrapWithValidParameters()
  runTestsAboutWrappedMethods()
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
      const validModel = getDummyMongooseModel()

      const result = wrap(validModel)

      expect(result).toBe(validModel)
    })

    it('(in native mode) - changes no internal methods', () => {
      const validModel = getDummyMongooseModel()

      utils.useMongoNative.mockReturnValueOnce(true)
      const { changed } = callWrapAndObserveInternalMethods(validModel)
      expect(utils.useMongoNative).toHaveBeenCalledTimes(1)

      expect(changed).toBeEmpty()
      expect(validModel._getMethodsBeforeWrapping).toBeUndefined()
    })

    it('- changes expected internal methods', () => {
      const validModel = getDummyMongooseModel()

      const { changed } = callWrapAndObserveInternalMethods(validModel)

      expect(changed).toEqual(METHODS_OVERLOADED_BY_WRAP)
    })

    it("- doesn't remove any internal method", () => {
      const validModel = getDummyMongooseModel()

      const { removed } = callWrapAndObserveInternalMethods(validModel)

      expect(removed).toBeEmpty()
    })

    if (process.env.JEST_MODE === 'coverage') {
      it.skip('- overloads find() exactly as expected', () => {})
    } else {
      it('- overloads find() exactly as expected (see snapshot)', () => {
        const validModel = getDummyMongooseModel()

        wrap(validModel)

        expect(validModel.find.toString()).toMatchSnapshot()
      })
    }

    it('(if adding helper _getMethodsBeforeWrapping) - helper returns expected result', () => {
      const validModel = getDummyMongooseModel()

      const { changed } = callWrapAndObserveInternalMethods(validModel)

      if (typeof validModel._getMethodsBeforeWrapping === 'function') {
        const cache = validModel._getMethodsBeforeWrapping()
        const cacheKeys = Object.keys(cache).sort()
        expect(changed).toEqual(cacheKeys)
      }
    })
  })
}

function runTestsAboutWrappedMethods() {
  describe('- when overloaded methods are used -', () => {
    METHODS_OVERLOADED_BY_WRAP.forEach(testOverloadedMethod)
  })
}

function testOverloadedMethod(name) {
  it(`${name}() behaves as expected`, async () => {
    const validModel = getDummyMongooseModel()

    wrap(validModel)

    const callback = validModel[name]
    expect(callback).toBeFunction()

    const result = callback({}, {}, {})
    expect(result).toBeInstanceOf(Promise)

    await result
  })
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
