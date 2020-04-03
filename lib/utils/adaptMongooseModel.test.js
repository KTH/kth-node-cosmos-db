/* eslint no-use-before-define: ["error", "nofunc"] */
/* eslint require-await: "error" */

// @ts-check

jest.unmock('@azure/cosmos')

// eslint-disable-next-line import/no-extraneous-dependencies
const prettier = require('prettier')

const {
  collectAllInternalMethods,
  Environment,
  getObjectKeysWithDifferentValues,
  Mongoose,
  removeCodeCoveragePollution
} = require('../../test/lib')

const { getTestOptions } = require('./CosmosClientWrapper.test-data')
const { createClient, getClient } = require('../client')

const {
  listOverloadedMethods,
  getPreparedTestModel,
  getTestDataAboutOverloadedMethods
} = require('./adaptMongooseModel.test-data')

const adaptMongooseModel = require('./adaptMongooseModel')

describe('Mongoose model wrapper function adaptMongooseModel()', () => {
  beforeAll(Environment.saveState)
  beforeAll(Mongoose.start)
  beforeAll(() => createClient(getTestOptions('valid')))

  runTestsAboutWrapWithInvalidParameters(Environment.MODE_DEVELOPMENT)
  runTestsAboutWrapWithValidParameters(Environment.MODE_DEVELOPMENT)

  runTestsAboutWrapWithInvalidParameters(Environment.MODE_PRODUCTION)
  runTestsAboutWrapWithValidParameters(Environment.MODE_PRODUCTION)

  runTestsAboutSnapshotsOfWrappedMethods(Environment.MODE_PRODUCTION)
  runTestsAboutWrappedMethods(Environment.MODE_PRODUCTION)

  afterAll(Environment.restoreState)
  afterAll(Mongoose.stop)
})

function runTestsAboutWrapWithInvalidParameters(mode) {
  describe(`- when called in ${mode} mode`, () => {
    beforeAll(() => Environment.simulate(mode))

    it('w/o arguments - FAILS', () => {
      expect(adaptMongooseModel).toThrow('Missing input')
    })

    it('with invalid argument, e.g. of type "number" - FAILS', () => {
      // @ts-ignore
      expect(() => adaptMongooseModel(79)).toThrow('Invalid input')
    })

    if (mode === Environment.MODE_DEVELOPMENT) {
      it('w/o property "cosmosClientWrapper" - returns same input object', async () => {
        const ValidModel = await Mongoose.getTestModel()

        // @ts-ignore
        const result = adaptMongooseModel({ mongooseModel: ValidModel })

        expect(result).toBe(ValidModel)
      })

      it('w/o property "mongooseModel" - returns nothing', () => {
        const cosmosClientWrapper = getClient()

        // @ts-ignore
        const result = adaptMongooseModel({ cosmosClientWrapper })

        expect(result).toBeUndefined()
      })
    } else {
      it('w/o property "cosmosClientWrapper" - FAILS', async () => {
        const ValidModel = await Mongoose.getTestModel()

        // @ts-ignore
        expect(() => adaptMongooseModel({ mongooseModel: ValidModel })).toThrow('Missing client')
      })

      it('w/o property "mongooseModel" - FAILS', () => {
        const cosmosClientWrapper = getClient()

        // @ts-ignore
        expect(() => adaptMongooseModel({ cosmosClientWrapper })).toThrow('Missing Mongoose model')
      })
    }
  })
}

function runTestsAboutWrapWithValidParameters(mode) {
  describe(`- when called in ${mode} mode with valid arguments`, () => {
    beforeAll(() => Environment.simulate(mode))

    it('- returns same input object', async () => {
      const cosmosClientWrapper = getClient()
      const ValidModel = await Mongoose.getTestModel()

      const result = adaptMongooseModel({ cosmosClientWrapper, mongooseModel: ValidModel })

      expect(result).toBe(ValidModel)
    })

    if (mode === Environment.MODE_DEVELOPMENT) {
      it("- DOESN'T change any internal method", async () => {
        const ValidModel = await Mongoose.getTestModel()

        const { changed } = _callWrapperAndObserveInternalMethods(ValidModel)

        expect(changed).toBeEmpty()
      })
    }

    if (mode === Environment.MODE_PRODUCTION) {
      it('- changes input in place', async () => {
        const overloadedMethods = listOverloadedMethods()

        const ValidModel = await Mongoose.getTestModel()

        const { changed } = _callWrapperAndObserveInternalMethods(ValidModel)

        expect(changed).toEqual(overloadedMethods)
      })

      it("- doesn't remove any internal method", async () => {
        const ValidModel = await Mongoose.getTestModel()

        const { removed } = _callWrapperAndObserveInternalMethods(ValidModel)

        expect(removed).toBeEmpty()
      })

      it('(if adding helper _getMethodsBeforeWrapping) - helper returns expected result', async () => {
        const ValidModel = await Mongoose.getTestModel()

        const { changed } = _callWrapperAndObserveInternalMethods(ValidModel)

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

      const client = getClient()

      adaptMongooseModel({ cosmosClientWrapper: client, mongooseModel: ValidModel })

      let functionDefinition = ValidModel.find.toString()

      if (process.env.JEST_MODE === 'coverage') {
        functionDefinition = removeCodeCoveragePollution(functionDefinition)
      }

      let prettyCode = prettier.format(functionDefinition, { parser: 'babel' })
      prettyCode = prettyCode.replace(/\n[ \t]*\n/g, '\n')

      expect(prettyCode).toMatchSnapshot()
    })
  })
}

function runTestsAboutWrappedMethods(mode) {
  describe(`- when overloaded methods are used in ${mode} mode -`, () => {
    beforeAll(() => Environment.simulate(mode))
    // beforeAll(() => createClient(getTestOptions('valid')))

    const testDataList = getTestDataAboutOverloadedMethods()
    testDataList.forEach(testOverloadedMethod)
  })
}

function testOverloadedMethod({ name, callOnInstance, args, check }) {
  it(`${name}() behaves as expected`, async () => {
    const client = getClient()
    const ValidModel = await getPreparedTestModel()
    adaptMongooseModel({ cosmosClientWrapper: client, mongooseModel: ValidModel })

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

function _callWrapperAndObserveInternalMethods(model) {
  const result = {
    before: collectAllInternalMethods(model)
  }

  const client = getClient()

  adaptMongooseModel({ cosmosClientWrapper: client, mongooseModel: model })

  result.after = collectAllInternalMethods(model)

  result.changed = getObjectKeysWithDifferentValues(result.before, result.after)
    .filter(name => name !== '_getMethodsBeforeWrapping')
    .sort()

  result.removed = result.changed.filter(name => result.after[name] == null)

  return result
}
