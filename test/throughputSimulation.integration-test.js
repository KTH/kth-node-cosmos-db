/* eslint no-use-before-define: ["error", "nofunc"] */
/* eslint require-await: "error" */

// @ts-check

jest.unmock('@azure/cosmos')

const fs = require('fs')

const mongoose = require('mongoose')
const { table } = require('table')

// eslint-disable-next-line import/newline-after-import
const { CosmosDb: _CosmosDbTestUtils, Environment, Mongoose: _MongooseTestUtils } = require('./lib')
const { parseConnectionStringIntoUrl } = _CosmosDbTestUtils
const {
  connectRealServer,
  ensureRealServerConnection: ensureMongooseConnection,
  disconnectRealServer: disconnectMongoose,
} = _MongooseTestUtils

const { createClient } = require('../lib/client')

const {
  getConfiguration,
  getThroughputSimulations,
  composeSimulationReport,
} = require('./throughputSimulation.test-data')

const ONE_KILOBYTE = 1024

const ENV_DATABASE_CONNECTION = 'INTEGRATION_TEST_COSMOSDB_CONNECTION'
const ENV_DATABASE_NAME = 'INTEGRATION_TEST_COSMOSDB_DATABASE'
const ENV_RUN_FULL_SIMULATION = 'INTEGRATION_TEST_FULL_SET'

const Global = {
  CosmosClient: null,
  MongooseModel: null,
  results: [],
  timestamps: {},
}

describe('Working kth-node-cosmos-db client', () => {
  beforeAll(Environment.saveState)
  beforeAll(Environment.simulateProduction)

  it('(Establishing obligatory connection to Mongoose test server)', _connectMongoose, 5000)

  runSimulationsAboutAutomaticIncrease()

  afterAll(disconnectMongoose)
  afterAll(Environment.restoreState)
})

function runSimulationsAboutAutomaticIncrease() {
  describe('automatically increases throughput during simulation', () => {
    // beforeAll(ensureMongooseConnection)
    beforeAll(_memorizeStartTimestamp)

    const runFullSimulation = String(process.env[ENV_RUN_FULL_SIMULATION] || 'false') === 'true'
    const testDataList = getThroughputSimulations(runFullSimulation)

    it.each(testDataList)('%s', (...args) => _runSimulationAsync(args[1]), 15000)

    afterAll(_showSimulationResults)
    afterAll(_saveSimulationResultsIntoMarkdown)
  })
}

async function _connectMongoose() {
  try {
    const connectionString = process.env[ENV_DATABASE_CONNECTION]
    const databaseName = process.env[ENV_DATABASE_NAME] || 'integrationTests'
    const disableSslRejection = true
    const connectTimeoutMS = 2500
    await connectRealServer({
      connectionString,
      databaseName,
      disableSslRejection,
      connectTimeoutMS,
    })
  } catch (error) {
    throw new Error(
      'Real CosmosDB connection needed for integration tests: ' +
        `Configure valid connection string as ${ENV_DATABASE_CONNECTION} (error: ${error.message})`
    )
  }
}

async function _runSimulationAsync({
  fullName,
  shortName,
  recordSizes,
  mode,
  retryStrategy,
  throughputStepsize,
}) {
  ensureMongooseConnection()

  const simulationSetup = { shortName, recordSizes, mode, retryStrategy, throughputStepsize }
  const numberOfUpdateSteps = 2000

  const statistics = {
    items: 0,
    kilobytes: 0,
    timestamps: {},
    throughput: {},
    increase: '',
    after: '(during preparation)',
    seconds: 0,
  }

  try {
    const config = getConfiguration()
    const { initialThroughput } = config.cosmos

    const clientData = { retryStrategy, throughputStepsize }
    const { model, getCurrentThroughput } = await _prepareFreshClientAndModel(clientData)

    const setup = _prepareSimulationRecords(recordSizes)

    statistics.timestamps.first = new Date().getTime()

    statistics.throughput.first = await getCurrentThroughput()
    if (statistics.throughput.first !== initialThroughput) {
      throw new Error(
        `Initial throughput mismatch - got ${statistics.throughput.first} instead of ${initialThroughput}`
      )
    }

    for (let updateStep = 1; updateStep <= numberOfUpdateSteps; updateStep++) {
      statistics.items = updateStep
      statistics.kilobytes += await _useRecordAsync({ setup, model, mode, updateStep })
      statistics.throughput.current = await getCurrentThroughput()
      statistics.timestamps.current = new Date().getTime()
      statistics.seconds =
        Math.round((statistics.timestamps.current - statistics.timestamps.first) / 10) / 100
      statistics.after = `${updateStep} items, ${statistics.kilobytes} kB, ${statistics.seconds} s`
      statistics.speed = Math.round((statistics.items / statistics.seconds) * 10) / 10

      if (statistics.throughput.current !== statistics.throughput.first) {
        if (statistics.throughput.current < initialThroughput + throughputStepsize) {
          throw new Error(
            `Updated throughput mismatch - got ${
              statistics.throughput.current
            } instead of at least ${initialThroughput + throughputStepsize}`
          )
        }

        const increase = `${statistics.throughput.first} -> ${statistics.throughput.current}`
        // eslint-disable-next-line no-console
        console.log(
          `\nRunning simulation ${fullName}:\n` +
            `  Collection throughput was just automatically increased - aborting simulation\n `,
          { increase, after: statistics.after }
        )
        _memorizeSimulationResult({ ...simulationSetup, ...statistics, increase })
        return
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`\nRunning simulation ${fullName}:\n  Error occured - simulation failed\n `, {
      error: error.message,
      after: statistics.after,
    })
    const shortErrorText = error.code === 16500 ? 'RU error' : 'failed'
    _memorizeSimulationResult({ ...simulationSetup, ...statistics, increase: shortErrorText })
    return
  }

  throw new Error(
    `Collection throughput was not increased - consider making simulation longer than ${numberOfUpdateSteps} steps`
  )
}

async function _prepareFreshClientAndModel({ retryStrategy, throughputStepsize }) {
  const config = getConfiguration()
  const { collectionName, modelName, modelDefinition, documentTemplate, shardKey } = config.mongoose
  const { fallbackDatabaseName, maxThroughput, collections } = config.cosmos

  const connectionString = process.env[ENV_DATABASE_CONNECTION]
  const databaseName = process.env[ENV_DATABASE_NAME] || fallbackDatabaseName

  const { url, key } = parseConnectionStringIntoUrl(connectionString)
  const { hostname: host, port, username } = url

  const cosmosDbOptions = {
    host,
    port,
    db: databaseName,
    collections,
    username,
    password: key,
    throughputStepsize,
    maxThroughput,
    disableSslRejection: true,
    createCollectionsWithMongoose: true,
    retryStrategy,
  }

  Global.CosmosClient = createClient(cosmosDbOptions)

  Environment.simulateDevelopment()
  await Global.CosmosClient.deleteCollection(collectionName, { safetyFlag: 'Yes, do it!' })
  Environment.simulateProduction()

  await Global.CosmosClient.init()

  const schemaOptions = { collection: collectionName, shardKey, bufferCommands: false }
  // const schemaOptions = { collection: collectionName, shardKey }
  const testSchema = new mongoose.Schema(modelDefinition, schemaOptions)

  if (Global.MongooseModel != null) {
    mongoose.connection.deleteModel(modelName)
  }
  Global.MongooseModel = Global.CosmosClient.createMongooseModel(modelName, testSchema, mongoose)

  await Global.MongooseModel.createCollection()

  const randomDocument = await Global.MongooseModel.findOne({})
  // const randomDocument = await Global.MongooseModel.azureFindOne({})
  if (randomDocument == null) {
    const newDocument = new Global.MongooseModel(documentTemplate)
    await newDocument.save()
    // await Global.MongooseModel.azureSaveDocument(newDocument)
  }

  await Global.CosmosClient.resetThroughput()

  const getCurrentThroughput = async () => {
    const throughput = await Global.CosmosClient.getCollectionThroughput(collectionName)
    return throughput
  }

  return { client: Global.CosmosClient, model: Global.MongooseModel, getCurrentThroughput }
}

function _prepareSimulationRecords(sizeList) {
  const setup = {
    testRecords: [],
    testRecordSizes: [],
  }
  sizeList.forEach(kilobytes => {
    setup.testRecords.push({
      updateStep: null,
      data: _composeRandomChars(kilobytes * ONE_KILOBYTE),
    })
    setup.testRecordSizes.push(kilobytes)
  })
  return setup
}

async function _useRecordAsync({ setup, model, mode, updateStep }) {
  const config = getConfiguration()
  const { name } = config.mongoose.documentTemplate

  const index = (updateStep - 1) % setup.testRecords.length
  const updateData = setup.testRecords[index]
  const size = setup.testRecordSizes[index]

  let document

  switch (mode) {
    case 'update':
      updateData.updateStep = updateStep
      await model.findOneAndUpdate({ name }, updateData)
      break
    // case 'azureUpdate':
    //   updateData.updateStep = updateStep
    //   await model.azureFindOneAndUpdate({ name }, updateData)
    //   break
    case 'update+find':
      updateData.updateStep = updateStep
      await model.findOneAndUpdate({ name }, updateData)
      document = await model.findOne({ name })
      expect(document.updateStep).toBe(updateStep)
      break
    case 'find+save':
      document = await model.findOne({ name })
      document.updateStep = updateStep
      await document.save()
      break
    // case 'azureSave':
    //   document = await model.findOne({ name })
    //   // document = await model.azureFindOne({ name })
    //   document.updateStep = updateStep
    //   await model.azureSaveDocument(document)
    //   break
    default:
      throw new Error(`_useRecordAsync() failed: Unknown simulation mode "${mode}"`)
  }

  return size
}

function _composeRandomChars(amount) {
  let output = ''
  for (let i = 1; i <= amount; i++) {
    output += String.fromCharCode(Math.floor((128 - 32) * Math.random() + 32))
  }
  return output
}

function _memorizeSimulationResult(data) {
  const {
    shortName,
    mode,
    retryStrategy,
    recordSizes,
    throughputStepsize,
    increase,
    after,
    speed,
  } = data

  if (Global.results.length === 0) {
    Global.results.push([
      '#',
      'data size',
      'records (kB)',
      'mode',
      'strategy',
      'stepsize',
      'increase',
      'after',
      'items/s',
    ])
  }

  const num = Global.results.length

  Global.results.push([
    num,
    shortName,
    recordSizes,
    mode,
    retryStrategy,
    throughputStepsize,
    increase,
    after,
    speed,
  ])
}

function _memorizeStartTimestamp() {
  Global.timestamps.start = new Date().getTime()
}

function _showSimulationResults() {
  if (Global.results.length === 0) {
    return
  }

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

function _saveSimulationResultsIntoMarkdown(done) {
  if (Global.results.length === 0) {
    return
  }

  let markdown = ''
  Global.results.forEach((item, index) => {
    markdown += `| ${item.join(' | ')} |\n`
    if (index === 0) {
      markdown += `| ${item.map(() => '---').join(' | ')} |\n`
    }
  })

  const now = new Date().getTime()
  const duration = Math.round((now - Global.timestamps.start) / 100) / 10

  const start = new Date()
  start.setTime(Global.timestamps.start)

  const output = composeSimulationReport({
    results: markdown,
    start: start.toString(),
    duration,
  })

  const runFullSimulation = String(process.env[ENV_RUN_FULL_SIMULATION] || 'false') === 'true'

  fs.writeFile(runFullSimulation ? './SIMULATION-full.md' : './SIMULATION.md', output, done)
}

async function _wait(timeoutMS) {
  await new Promise(resolve => {
    setTimeout(resolve, timeoutMS)
  })
}
