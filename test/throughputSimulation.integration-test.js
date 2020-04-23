/* eslint no-use-before-define: ["error", "nofunc"] */
/* eslint require-await: "error" */

// @ts-check

jest.unmock('@azure/cosmos')

const mongoose = require('mongoose')
const { table } = require('table')

// eslint-disable-next-line import/newline-after-import
const { CosmosDb: _CosmosDbTestUtils, Environment, Mongoose: _MongooseTestUtils } = require('./lib')
const { parseConnectionStringIntoUrl } = _CosmosDbTestUtils
const {
  connectRealServer,
  ensureRealServerConnection,
  disconnectRealServer: disconnectMongoose
} = _MongooseTestUtils

const { createClient } = require('../lib/client')

const ONE_MINUTE_TIMEOUT = 60000
const LONG_TIMEOUT = 60 * ONE_MINUTE_TIMEOUT
const ENV_DATABASE_CONNECTION = 'INTEGRATION_TEST_COSMOSDB_CONNECTION'
const ENV_DATABASE_NAME = 'INTEGRATION_TEST_COSMOSDB_DATABASE'

const ONE_KILOBYTE = 1024

const Global = {
  mongooseModel: null,
  results: []
}

describe('Working kth-node-cosmos-db client', () => {
  beforeAll(Environment.saveState)
  beforeAll(Environment.simulateProduction)
  beforeAll(_connectMongoose, ONE_MINUTE_TIMEOUT)

  runTestsAboutHandleError()

  afterAll(disconnectMongoose)
  afterAll(Environment.restoreState)
})

function runTestsAboutHandleError() {
  describe('automatically increases throughput during simulation', () => {
    beforeAll(ensureRealServerConnection)

    const initialThroughput = 400
    const collections = [{ name: 'updatesimulations', throughput: initialThroughput }]
    const maxThroughput = 20000
    const throughputStepsize = 200

    let client

    beforeAll(async () => {
      const clientData = { collections, maxThroughput, throughputStepsize }
      client = await _prepareTestDatabase(clientData)
      await _prepareTestModelWithOneDocument({ client })
    })

    // const recordsets = {
    //   large: [1490, 1490],
    //   mediumsize: [149, 149],
    //   small: [10, 10],
    //   mixed: [10, 149, 1490]
    // }
    const recordsets = {
      small: [2, 2],
      mediumsize: [10, 10],
      large: [100, 100],
      'x-large': [1000, 1000],
      mixed: [2, 10, 100, 1000]
    }
    const recordsetList = Object.keys(recordsets)
    // const retryStrategyList = ['fastest', 'fast', 'good', 'cheapest', 'fourAttemptsOnly']
    // const retryStrategyList = ['fastest', 'fast', 'good']
    const retryStrategyList = ['good', 'fast', 'fastest', 'fastest', 'fast', 'good']
    const modeList = ['findOneAndUpdate']

    const testData = []
    recordsetList.forEach(recordsetName => {
      const recordSizes = recordsets[recordsetName]
      retryStrategyList.forEach(retryStrategy => {
        modeList.forEach(mode => {
          testData.push([
            `with ${recordsetName} recordsets (strategy "${retryStrategy}", operation "${mode}")`,
            `${recordsetName} data`,
            { recordSizes, mode, retryStrategy }
          ])
        })
      })
    })

    it.each(testData)(
      '%s',
      async (...args) => {
        // @ts-ignore
        // eslint-disable-next-line no-unused-vars
        const [fullName, shortName, { recordSizes, mode, retryStrategy }] = args
        const model = _getTestModel()

        await _runSimulationAsync({
          client,
          model,
          fullName,
          shortName,
          recordSizes,
          mode,
          retryStrategy,
          initialThroughput,
          throughputStepsize
        })
      },
      LONG_TIMEOUT
    )

    afterAll(_showSimulationResults)
  })
}

async function _connectMongoose() {
  try {
    const connectionString = process.env[ENV_DATABASE_CONNECTION]
    const databaseName = process.env[ENV_DATABASE_NAME] || 'integrationTests'
    const disableSslRejection = true

    await connectRealServer({ connectionString, databaseName, disableSslRejection })
  } catch (error) {
    throw new Error(
      'Real CosmosDB connection needed for integration tests: ' +
        `Configure valid connection string as ${ENV_DATABASE_CONNECTION} (error: ${error.message})`
    )
  }
}

async function _prepareTestDatabase({
  collections = [],
  maxThroughput = 10000,
  defaultThroughput = null,
  throughputStepsize = null
}) {
  const connectionString = process.env[ENV_DATABASE_CONNECTION]

  const { url, key } = parseConnectionStringIntoUrl(connectionString)
  const { hostname: host, port, username } = url

  const validCosmosDbOptions = {
    host,
    port,
    db: process.env[ENV_DATABASE_NAME] || 'integrationTest',
    collections,
    username,
    password: key,
    maxThroughput,
    disableSslRejection: true,
    createCollectionsWithMongoose: true
  }

  if (defaultThroughput != null) {
    validCosmosDbOptions.defaultThroughput = defaultThroughput
  }
  if (throughputStepsize != null) {
    validCosmosDbOptions.throughputStepsize = throughputStepsize
  }

  const client = createClient(validCosmosDbOptions)
  await client.init()

  return client
}

async function _prepareTestModelWithOneDocument({ client }) {
  if (Global.mongooseModel != null) {
    throw new Error("Can't prepare more than one test model - delete the old model, first")
  }

  const modelDefinition = { name: String, updateStep: Number, data: String }
  const documentTemplate = { name: 'Test, Integration', updateStep: -1, data: 'abcdefg' }

  const testSchema = new mongoose.Schema(modelDefinition)
  const Model = client.createMongooseModel('UpdateSimulation', testSchema, mongoose)

  const randomDocument = await Model.findOne({})
  if (randomDocument == null) {
    const newDocument = new Model(documentTemplate)
    await newDocument.save()
  }

  Global.mongooseModel = Model
  return Model
}

function _getTestModel() {
  if (Global.mongooseModel == null) {
    throw new Error("Can't find test model - create one, first")
  }
  return Global.mongooseModel
}

function _deleteTestModelInMongoose() {
  if (Global.mongooseModel == null) {
    return
  }

  const { modelName } = Global.mongooseModel
  mongoose.connection.deleteModel(modelName)

  Global.mongooseModel = null
}

function _prepareSimulationRecords(sizeList) {
  const setup = {
    testRecords: [],
    testRecordSizes: []
  }
  sizeList.forEach(kilobytes => {
    setup.testRecords.push({
      updateStep: null,
      data: _composeRandomChars(kilobytes * ONE_KILOBYTE)
    })
    setup.testRecordSizes.push(kilobytes)
  })
  return setup
}

async function _useRecordAsync({ setup, model, updateStep }) {
  const index = (updateStep - 1) % setup.testRecords.length
  const updateData = setup.testRecords[index]
  updateData.updateStep = updateStep
  const size = setup.testRecordSizes[index]

  await model.findOneAndUpdate({ name: 'Test, Integration' }, updateData)
  const document = await model.findOne({ name: 'Test, Integration' })
  // @ts-ignore
  expect(document.updateStep).toBe(updateStep)

  return size
}

// const document = await Model.findOne({ name: 'Test, Integration' })
// // @ts-ignore
// document.age = step
// await document.save()

// if (step === 1) {
//   console.log('findOne()', Model.findOne.toString())
//   console.log('save()', document.save.toString())
// }

async function _runSimulationAsync({
  client,
  model,
  fullName,
  shortName,
  recordSizes,
  mode,
  retryStrategy,
  initialThroughput,
  throughputStepsize
}) {
  await client.resetThroughput()
  client.setOption('retryStrategy', retryStrategy)

  const setup = _prepareSimulationRecords(recordSizes)

  const throughputInfo1 = await client.listCollectionsWithThroughput()
  const { throughput: throughput1 } = throughputInfo1[0]
  expect(throughput1).toBe(initialThroughput)

  const numberOfUpdateSteps = 2000
  let kilobytes = 0
  // await _wait(1000)

  for (let updateStep = 1; updateStep <= numberOfUpdateSteps; updateStep++) {
    kilobytes += await _useRecordAsync({ setup, model, updateStep })

    const throughputInfo2 = await client.listCollectionsWithThroughput()
    const { throughput: throughput2 } = throughputInfo2[0]

    if (throughput2 !== throughput1) {
      expect(throughput2).toBeGreaterThanOrEqual(initialThroughput + throughputStepsize)

      const itemUpdates = updateStep

      // eslint-disable-next-line no-console
      console.log(
        `\nRunning simulation ${fullName}:\n` +
          `  Collection throughput was just automatically increased ` +
          `from ${throughput1} to ${throughput2}\n` +
          `  - aborting simulation after updating ${itemUpdates} items ` +
          `with a total of ${kilobytes} kilobytes`
      )

      _memorizeSimulationResult({
        name: shortName,
        mode,
        retryStrategy,
        recordSizes,
        increase: `${throughput1} -> ${throughput2}`,
        itemUpdates,
        kilobytes
      })
      return
    }
  }

  throw new Error(
    `Collection throughput was not increased - consider making simulation longer than ${numberOfUpdateSteps} steps`
  )
}

function _composeRandomChars(amount) {
  let output = ''
  for (let i = 1; i <= amount; i++) {
    output += String.fromCharCode(Math.floor((128 - 32) * Math.random() + 32))
  }
  return output
}

function _memorizeSimulationResult({
  name,
  mode,
  retryStrategy,
  recordSizes,
  increase,
  itemUpdates,
  kilobytes
}) {
  if (Global.results.length === 0) {
    Global.results.push(['#', 'name', 'mode', 'retry', 'records', 'increase', 'items', 'kBytes'])
  }

  const num = Global.results.length

  Global.results.push([
    num,
    name,
    mode,
    retryStrategy,
    recordSizes,
    increase,
    itemUpdates,
    kilobytes
  ])
}

function _showSimulationResults() {
  function drawHorizontalLine(index, size) {
    const currItem = Global.results[index - 1] || []
    const nextItem = Global.results[index] || []
    const itemIsLastOfGroup = currItem[1] !== nextItem[1]
    return [0, 1, size].includes(index) || itemIsLastOfGroup
  }
  const options = { drawHorizontalLine: drawHorizontalLine.bind(this) }
  const resultTable = table(Global.results, options)
  // eslint-disable-next-line no-console
  console.log(`\nAll simulation results\n======================\n${resultTable}`)
}

async function _wait(ms) {
  await new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}
