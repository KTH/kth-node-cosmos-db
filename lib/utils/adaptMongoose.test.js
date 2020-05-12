/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

const mongoose = require('mongoose')
const prettier = require('prettier')

const { Mongoose: MongooseTestUtils, removeCodeCoveragePollution } = require('../../test/lib')

const CosmosClientWrapper = require('./CosmosClientWrapper')
const { getTestOptions } = require('./CosmosClientWrapper.test-data')

const { adaptMongooseSchema, adaptMongooseModel } = require('./adaptMongoose')

describe('Helper module "adaptMongoose"', () => {
  beforeAll(MongooseTestUtils.connectTestServer)

  runTestsAboutAdaptMongooseSchema()
  runTestsAboutAdaptMongooseModel()

  afterAll(MongooseTestUtils.disconnectTestServer)
})

function runTestsAboutAdaptMongooseSchema() {
  describe('exports function adaptMongooseSchema() that', () => {
    const clientOptions = getTestOptions('valid')
    const cosmosClientWrapper = new CosmosClientWrapper(clientOptions)
    const mongooseSchema = new mongoose.Schema({ name: String })
    const collectionName = 'test-collection'

    it('is accessible', () => {
      expect(adaptMongooseSchema).toBeFunction()
    })

    it('- when called w/o any argument - FAILS', () => {
      expect(adaptMongooseSchema).toThrow('Missing input')
    })

    it('- when called with invalid arguments, e.g. a number - FAILS', () => {
      // @ts-ignore
      expect(() => adaptMongooseSchema(79)).toThrow('Invalid input')
    })

    it('- when called w/o client - FAILS', () => {
      // @ts-ignore
      expect(() => adaptMongooseSchema({ mongooseSchema, collectionName })).toThrow(
        'Missing client'
      )
    })

    it('- when called w/o schema - FAILS', () => {
      // @ts-ignore
      expect(() => adaptMongooseSchema({ cosmosClientWrapper, collectionName })).toThrow(
        'Missing Mongoose schema'
      )
    })

    it('- when called w/o collection-name - FAILS', () => {
      // @ts-ignore
      expect(() => adaptMongooseSchema({ cosmosClientWrapper, mongooseSchema })).toThrow(
        'Missing collection name'
      )
    })

    it('- when called with minimal arguments - returns schema from input', () => {
      const schema = new mongoose.Schema({ name: String })
      const result = adaptMongooseSchema({
        cosmosClientWrapper,
        mongooseSchema: schema,
        collectionName,
      })
      expect(result).toBe(schema)
    })

    it('adds Mongoose middleware as expected', () => {
      const mockups = { pre: jest.fn(), post: jest.fn() }

      const schema = new mongoose.Schema({ name: String })
      schema.pre = mockups.pre
      schema.post = mockups.post

      adaptMongooseSchema({ cosmosClientWrapper, mongooseSchema: schema, collectionName })

      expect(mockups.pre.mock.calls).toEqual([])
      expect(mockups.post).toHaveBeenCalledTimes(1)
      expect(mockups.post).toHaveBeenCalledWith('init', expect.any(Function))
    })

    it('adds Mongoose middleware with the expected functionality', async () => {
      const transformSchema = item =>
        adaptMongooseSchema({ cosmosClientWrapper, mongooseSchema: item, collectionName })

      const normalModel = await MongooseTestUtils.getTestModel(1)
      const adaptedModel = await MongooseTestUtils.getTestModel(1, { transformSchema })
      const normalDocument = await normalModel.findOne({})
      const adaptedDocument = await adaptedModel.findOne({})

      // @ts-ignore
      const { backup } = adaptedDocument._azureAddons
      expect(backup).toMatchSnapshot('backups')

      const adaptedMethods = _getSnapshotsOfAddedOrChangedMethods({
        normal: normalDocument,
        adapted: adaptedDocument,
      })
      expect(Object.keys(adaptedMethods)).toEqual(Object.keys(backup))

      const minifiedSnapshot = _ensureObjectRepeatsSameValueAndReturnValue(adaptedMethods)
      expect(minifiedSnapshot).toMatchSnapshot('adaptions')
    })
  })
}

function runTestsAboutAdaptMongooseModel() {
  describe('exports function adaptMongooseModel() that', () => {
    const clientOptions = getTestOptions('valid')
    const cosmosClientWrapper = new CosmosClientWrapper(clientOptions)

    it('is accessible', () => {
      expect(adaptMongooseModel).toBeFunction()
    })

    it('- when called w/o any arguments - FAILS', () => {
      expect(adaptMongooseModel).toThrow('Missing input')
    })

    it('- when called with invalid arguments, e.g. a number - FAILS', () => {
      // @ts-ignore
      expect(() => adaptMongooseModel(79)).toThrow('Invalid input')
    })

    it('- when called w/o client - FAILS', async () => {
      const model = await MongooseTestUtils.getTestModel(1)

      // @ts-ignore
      expect(() => adaptMongooseModel({ mongooseModel: model })).toThrow('Missing client')
    })

    it('- when called w/o client - FAILS', async () => {
      // @ts-ignore
      expect(() => adaptMongooseModel({ cosmosClientWrapper })).toThrow('Missing Mongoose model')
    })

    it('- when called with minimal arguments - returns a now Mongoose model', async () => {
      const NormalModel = await MongooseTestUtils.getTestModel(1)

      const AdaptedModel = adaptMongooseModel({ cosmosClientWrapper, mongooseModel: NormalModel })

      expect(AdaptedModel).not.toBe(NormalModel)
      expect(AdaptedModel.modelName).toMatch(/./)
      expect(AdaptedModel.modelName).toBe(NormalModel.modelName)
    })

    it('adds the expected wrapper to all functions that return a query', async () => {
      const NormalModel = await MongooseTestUtils.getTestModel(1)
      const AdaptedModel = adaptMongooseModel({ cosmosClientWrapper, mongooseModel: NormalModel })

      // @ts-ignore
      const { backup } = AdaptedModel._azureAddons
      expect(backup).toMatchSnapshot('backups')

      const adaptedMethods = _getSnapshotsOfAddedOrChangedMethods({
        normal: NormalModel,
        adapted: AdaptedModel,
      })
      expect(Object.keys(adaptedMethods)).toEqual(Object.keys(backup))

      const minifiedSnapshot = _ensureObjectRepeatsSameValueAndReturnValue(adaptedMethods)
      expect(minifiedSnapshot).toMatchSnapshot('adaptions')
    })

    it("lets the model's constructor add the expected wrappers to any new document", async () => {
      const NormalModel = await MongooseTestUtils.getTestModel(1)
      const AdaptedModel = adaptMongooseModel({ cosmosClientWrapper, mongooseModel: NormalModel })
      const normalDocument = new NormalModel()
      const adaptedDocument = new AdaptedModel()

      const { backup } = adaptedDocument._azureAddons
      expect(backup).toMatchSnapshot('backups')

      const adaptedMethods = _getSnapshotsOfAddedOrChangedMethods({
        normal: normalDocument,
        adapted: adaptedDocument,
      })
      expect(Object.keys(adaptedMethods)).toEqual(Object.keys(backup))

      const minifiedSnapshot = _ensureObjectRepeatsSameValueAndReturnValue(adaptedMethods)
      expect(minifiedSnapshot).toMatchSnapshot('adaptions')
    })
  })
}

function _getSnapshotsOfAddedOrChangedMethods({ normal, adapted }) {
  expect(normal).toBeInstanceOf(Object)
  expect(adapted).toBeInstanceOf(Object)

  const methodsInAdapted = Object.keys(adapted).filter(key => typeof adapted[key] === 'function')
  const addedOrChangedMethods = methodsInAdapted.filter(
    key => typeof normal[key] !== 'function' || normal[key].toString() !== adapted[key].toString()
  )

  const adaptedMethods = {}
  addedOrChangedMethods.forEach(key => {
    const snapshot = removeCodeCoveragePollution(adapted[key].toString())
    adaptedMethods[key] = _unifyCodeSnapshot(snapshot)
  })

  return adaptedMethods
}

function _ensureObjectRepeatsSameValueAndReturnValue(input) {
  expect(input).toBeObject()
  expect(Object.keys(input)).not.toBeEmpty()

  const keys = Object.keys(input)
  const value = input[keys[0]]

  keys.forEach(key => {
    expect({ key, value: input[key] }).toEqual({ key, value })
  })

  return value
}

function _unifyCodeSnapshot(input) {
  let code = prettier
    .format(input, { parser: 'babel', semi: true })
    .replace(/\/\/.*/g, '')
    .replace(/(?:\n|\s)+/g, ' ')
  code = prettier.format(code, { parser: 'babel' })
  return code
}
