/* eslint no-use-before-define: ["error", "nofunc"] */

const {
  collectAllInternalMethods,
  getObjectKeysWithDifferentValues,
  getDummyMongooseModel,
  removeCodeCoveragePollution
} = require('../testlib')

jest.mock('./utils')
const Utils = require('./utils') // eslint-disable-line import/newline-after-import
Utils.useMongoNative = jest.fn().mockReturnValue(false)

const wrap = require('./wrap')

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

  it.todo('calls internal handleError() in case of throughput problems')
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

      Utils.useMongoNative.mockReturnValueOnce(true)
      const { changed } = callWrapAndObserveInternalMethods(validModel)
      expect(Utils.useMongoNative).toHaveBeenCalledTimes(1)

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

    it('- overloads find() exactly as expected (see snapshot)', () => {
      const validModel = getDummyMongooseModel()

      wrap(validModel)

      const functionDefinition = validModel.find.toString()

      if (process.env.JEST_MODE === 'coverage') {
        const unpolluted = removeCodeCoveragePollution(functionDefinition)
        expect(unpolluted).toMatchSnapshot()
      } else {
        expect(functionDefinition).toMatchSnapshot()
      }
    })

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
