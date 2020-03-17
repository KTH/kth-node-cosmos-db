/* eslint no-use-before-define: ["error", "nofunc"] */
/* eslint require-await: "error" */

// @ts-check

// eslint-disable-next-line import/no-extraneous-dependencies
const prettier = require('prettier')

const {
  collectAllInternalMethods,
  Environment,
  getObjectKeysWithDifferentValues,
  Mongoose,
  removeCodeCoveragePollution
} = require('../testlib')

const { getTestOptions } = require('./utils/options.test-data')
const { createClient } = require('./client')

const {
  listOverloadedMethods,
  getPreparedTestModel,
  getTestDataAboutOverloadedMethods
} = require('./wrap.test-data')

const wrap = require('./wrap')

describe('Mongoose model wrapper function wrap()', () => {
  beforeAll(Environment.saveState)
  beforeAll(Mongoose.start)

  runTestsAboutWrapWithInvalidParameters(Environment.MODE_DEVELOPMENT)
  runTestsAboutWrapWithValidParameters(Environment.MODE_DEVELOPMENT)

  runTestsAboutWrapWithInvalidParameters(Environment.MODE_PRODUCTION)
  runTestsAboutWrapWithValidParameters(Environment.MODE_PRODUCTION)

  runTestsAboutSnapshotsOfWrappedMethods(Environment.MODE_PRODUCTION)
  runTestsAboutWrappedMethods(Environment.MODE_PRODUCTION)

  it.todo('calls internal handleError() in case of throughput problems')

  afterAll(Environment.restoreState)
  afterAll(Mongoose.stop)
})

function runTestsAboutWrapWithInvalidParameters(mode) {
  describe(`- when called in ${mode} mode`, () => {
    beforeAll(() => Environment.simulate(mode))

    it('w/o arguments - returns nothing', () => {
      // @ts-ignore
      const result = wrap()
      expect(result).toBeUndefined()
    })

    it('with invalid argument, e.g. of type "number" - returns same input', () => {
      const result = wrap(79)
      expect(result).toBe(79)
    })
  })
}

function runTestsAboutWrapWithValidParameters(mode) {
  describe(`- when called in ${mode} mode with valid Model argument`, () => {
    beforeAll(() => Environment.simulate(mode))

    it('- returns same input object', async () => {
      const ValidModel = await Mongoose.getTestModel()

      const result = wrap(ValidModel)

      expect(result).toBe(ValidModel)
    })

    if (mode === Environment.MODE_DEVELOPMENT) {
      it("- DOESN'T change any internal method", async () => {
        const ValidModel = await Mongoose.getTestModel()

        const { changed } = _callWrapAndObserveInternalMethods(ValidModel)

        expect(changed).toBeEmpty()
      })
    }

    if (mode === Environment.MODE_PRODUCTION) {
      it('- changes input in place', async () => {
        const overloadedMethods = listOverloadedMethods()

        const ValidModel = await Mongoose.getTestModel()

        const { changed } = _callWrapAndObserveInternalMethods(ValidModel)

        expect(changed).toEqual(overloadedMethods)
      })

      it("- doesn't remove any internal method", async () => {
        const ValidModel = await Mongoose.getTestModel()

        const { removed } = _callWrapAndObserveInternalMethods(ValidModel)

        expect(removed).toBeEmpty()
      })

      it('(if adding helper _getMethodsBeforeWrapping) - helper returns expected result', async () => {
        const ValidModel = await Mongoose.getTestModel()

        const { changed } = _callWrapAndObserveInternalMethods(ValidModel)

        // @ts-ignore
        const helper = ValidModel._getMethodsBeforeWrapping

        if (typeof helper === 'function') {
          const cache = helper()
          const cacheKeys = Object.keys(cache).sort()
          expect(changed).toEqual(cacheKeys)
        }
      })
    }
  })
}

function runTestsAboutSnapshotsOfWrappedMethods(mode) {
  describe(`- when looking at the code of single methods in ${mode} mode`, () => {
    beforeAll(() => Environment.simulate(mode))

    it('- overloads find() matching snapshot', async () => {
      const ValidModel = await Mongoose.getTestModel()

      wrap(ValidModel)

      let functionDefinition = ValidModel.find.toString()

      if (process.env.JEST_MODE === 'coverage') {
        functionDefinition = removeCodeCoveragePollution(functionDefinition)
      }

      const prettyCode = prettier.format(functionDefinition, { parser: 'babel' })
      expect(prettyCode).toMatchSnapshot()
    })
  })
}

function runTestsAboutWrappedMethods(mode) {
  describe(`- when overloaded methods are used in ${mode} mode -`, () => {
    beforeAll(() => Environment.simulate(mode))
    beforeAll(() => createClient(getTestOptions('valid')))

    const testDataList = getTestDataAboutOverloadedMethods()
    testDataList.forEach(testOverloadedMethod)
  })
}

function testOverloadedMethod({ name, callOnInstance, args, check }) {
  it(`${name}() behaves as expected`, async () => {
    const ValidModel = await getPreparedTestModel()

    wrap(ValidModel)

    let callback
    if (callOnInstance) {
      const record = new ValidModel()
      callback = record[name].bind(record)
    } else {
      callback = ValidModel[name].bind(ValidModel)
    }
    expect(callback).toBeFunction()

    const asyncResult = callback(...args)
    expect(asyncResult).toBeInstanceOf(Promise)

    const result = await asyncResult

    if (typeof check === 'function') {
      check(result)
    }
  })
}

function _callWrapAndObserveInternalMethods(model) {
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
