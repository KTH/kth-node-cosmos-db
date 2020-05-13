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

const { createClient, getClient } = require('../lib/client')

const {
  getConfiguration,
  getThroughputSimulations,
  composeSimulationReport,
} = require('./throughputSimulation.test-data')

const ONE_KILOBYTE = 1024

const ENV_DATABASE_CONNECTION = 'INTEGRATION_TEST_COSMOSDB_CONNECTION'
const ENV_DATABASE_NAME = 'INTEGRATION_TEST_COSMOSDB_DATABASE'
const ENV_RUN_FULL_SIMULATION = 'INTEGRATION_TEST_FULL_SET'

const TEST_COLLECTION_SUFFIXES = ['A', 'B', 'C', 'D', 'E']

const Global = {
  testDataList: [],
  ready: {
    connectServer: false,
    createClient: false,
    initClient: false,
    createModels: false,
    createCollections: false,
  },
  results: [],
  timestamps: {
    start: null,
  },
  runningTestsCounter: 0,
}

describe('Client automatically increases throughput during simulation', () => {
  beforeAll(Environment.saveState)
  beforeAll(Environment.simulateProduction)

  const runFullSimulation = String(process.env[ENV_RUN_FULL_SIMULATION]) === 'true'
  Global.testDataList = getThroughputSimulations(runFullSimulation)

  it('(Preparing Cosmos DB client)', _prepareCosmosDbClient, 30000)
  it('(Connecting obligatory test server)', _connectMongoose, 30000)
  it('(Preparing test models and collections)', _prepareModelsAndCollections, 30000)

  it.each(Global.testDataList)('%s', (...args) => _runSimulationAsync(args[1]), 180000)

  it('(Saving results to markdown file)', _saveSimulationResultsIntoMarkdown)
  afterAll(_showSimulationResults)

  afterAll(_disconnectMongoose)
  afterAll(Environment.restoreState)
})

async function _prepareCosmosDbClient() {
  expect(Global.testDataList).not.toBeEmpty()

  expect(Global.ready.createClient).toBeFalse()
  expect(Global.ready.initClient).toBeFalse()

  // eslint-disable-next-line no-console
  console.log('Preparing Cosmos DB client...')

  const config = getConfiguration()
  const { fallbackDatabaseName, maxThroughput, _collectionTemplate } = config.cosmos

  const connectionString = process.env[ENV_DATABASE_CONNECTION]
  const { url, key } = parseConnectionStringIntoUrl(connectionString)
  const { hostname: host, port, username } = url

  const databaseName = process.env[ENV_DATABASE_NAME] || fallbackDatabaseName

  const collections = TEST_COLLECTION_SUFFIXES.map(suffix => {
    const name = `${_collectionTemplate.name}-${suffix.toLowerCase()}`
    return { ..._collectionTemplate, name }
  })

  const cosmosDbOptions = {
    host,
    port,
    db: databaseName,
    collections,
    username,
    password: key,
    maxThroughput,
    disableSslRejection: true,
    // createCollectionsWithMongoose: true,
  }

  const client = createClient(cosmosDbOptions)

  await client.init()

  Global.ready.createClient = true
  Global.ready.initClient = true
}

async function _connectMongoose() {
  expect(Global.ready.connectServer).toBeFalse()

  // eslint-disable-next-line no-console
  console.log('Connecting obligatory test server...')

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
        `Configure valid connection string as ${ENV_DATABASE_CONNECTION} ` +
        `(error: ${error.message})`
    )
  }

  Global.ready.connectServer = true
}

async function _prepareModelsAndCollections() {
  expect(Global.testDataList).not.toBeEmpty()
  expect(Global.ready.initClient).toBeTrue()

  expect(Global.ready.createModels).toBeFalse()
  expect(Global.ready.createCollections).toBeFalse()

  // eslint-disable-next-line no-console
  console.log('Preparing test models and collections...')

  const config = getConfiguration()
  const { _templateModelName, modelDefinition, documentTemplate, shardKey } = config.mongoose
  const { initialThroughput, _collectionTemplate } = config.cosmos

  const client = getClient()

  const modelDataList = await Promise.all(
    TEST_COLLECTION_SUFFIXES.map(async suffix => {
      const collectionName = `${_collectionTemplate.name}-${suffix.toLowerCase()}`
      const modelName = `${_templateModelName}${suffix.toUpperCase()}`

      const schemaOptions = {
        collection: collectionName,
        shardKey,
        // bufferCommands: false,
        // autoCreate: false,
      }

      const schema = new mongoose.Schema(modelDefinition, schemaOptions)

      const Model = client.createMongooseModel(modelName, schema, mongoose)

      // await Model.createCollection()

      const randomDocument = await Model.findOne({})
      if (randomDocument == null) {
        const newDocument = new Model(documentTemplate)
        await newDocument.save()
      }

      return { collectionName, modelName, Model }
    })
  )

  await Promise.all(
    Global.testDataList.map(async (item, index) => {
      const testSetup = item[1]
      const { retryStrategy, throughputStepsize } = testSetup

      const modelData = modelDataList[index % modelDataList.length]
      const { collectionName, modelName, Model } = modelData

      testSetup.collectionName = collectionName
      testSetup.modelName = modelName
      testSetup.Model = Model

      testSetup.setClientOptions = () => {
        client.setOption('retryStrategy', retryStrategy)
        client.setOption('throughputStepsize', throughputStepsize)
      }

      testSetup.resetThroughput = async () => {
        await client.updateCollectionThroughput(collectionName, initialThroughput)
      }

      testSetup.getCurrentThroughput = async () => {
        const throughput = await client.getCollectionThroughput(collectionName)
        return throughput
      }
    })
  )

  await client.resetThroughput()

  Global.ready.createModels = true
  Global.ready.createCollections = true
}

/**
 * @param {object} input
 * @param {string} input.fullName
 * @param {string} input.shortName
 * @param {string} input.collectionName
 * @param {object} input.schema
 * @param {string} input.modelName
 * @param {object} input.Model
 * @param {number[]} input.recordSizes
 * @param {string} input.mode
 * @param {string} input.retryStrategy
 * @param {number} input.throughputStepsize
 * @param {function} input.setClientOptions
 * @param {function} input.resetThroughput
 * @param {function} input.getCurrentThroughput
 */
async function _runSimulationAsync(input) {
  expect(Global.ready).not.toContainValue(false)

  ensureMongooseConnection()
  _memorizeStartTimestampDuringFirstSimulation()

  Global.runningTestsCounter += 1
  if (Global.runningTestsCounter > 1) {
    // eslint-disable-next-line no-console
    console.error('Starting new simulation while others are still processing...', {
      counter: Global.runningTestsCounter,
    })
  }

  const {
    fullName,
    shortName,
    recordSizes,
    mode,
    Model,
    retryStrategy,
    throughputStepsize,
    setClientOptions,
    resetThroughput,
    getCurrentThroughput,
  } = input

  const simulationSetup = { shortName, recordSizes, mode, retryStrategy, throughputStepsize }
  const numberOfUpdateSteps = 500
  const messagesAfterUpdateSteps = [200]

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

    setClientOptions()

    const setup = _prepareSimulationRecords(recordSizes)

    statistics.timestamps.first = new Date().getTime()

    statistics.throughput.first = await getCurrentThroughput()
    if (statistics.throughput.first !== initialThroughput) {
      Global.runningTestsCounter -= 1
      await resetThroughput()
      throw new Error(
        `Initial throughput mismatch - got ${statistics.throughput.first} instead of ${initialThroughput}`
      )
    }

    for (let updateStep = 1; updateStep <= numberOfUpdateSteps; updateStep++) {
      statistics.items = updateStep
      statistics.kilobytes += await _useRecordAsync({ setup, model: Model, mode, updateStep })
      statistics.throughput.current = await getCurrentThroughput()
      statistics.timestamps.current = new Date().getTime()
      statistics.seconds =
        Math.round((statistics.timestamps.current - statistics.timestamps.first) / 10) / 100
      statistics.after = `${updateStep} items, ${statistics.kilobytes} kB, ${statistics.seconds} s`
      statistics.speed = Math.round((statistics.items / statistics.seconds) * 10) / 10

      if (statistics.throughput.current !== statistics.throughput.first) {
        if (statistics.throughput.current < initialThroughput + throughputStepsize) {
          Global.runningTestsCounter -= 1
          await resetThroughput()
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
          { after: statistics.after, increase }
        )
        _memorizeSimulationResult({ ...simulationSetup, ...statistics, increase })

        Global.runningTestsCounter -= 1
        await resetThroughput()
        return
      }

      if (messagesAfterUpdateSteps.includes(updateStep)) {
        // eslint-disable-next-line no-console
        console.log(
          `\nRunning simulation ${fullName}:\n  Already updated ${updateStep} items without increase - still working...\n `,
          { after: statistics.after }
        )
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`\nRunning simulation ${fullName}:\n  Error occured - simulation failed\n `, {
      after: statistics.after,
      error: error.message,
      // details: error,
    })
    const shortErrorText = error.code === 16500 ? 'RU error' : 'failed'
    _memorizeSimulationResult({ ...simulationSetup, ...statistics, increase: shortErrorText })

    Global.runningTestsCounter -= 1
    try {
      await resetThroughput()
      // eslint-disable-next-line no-empty
    } catch (error2) {}
    return
  }

  // eslint-disable-next-line no-console
  console.log(
    `\nRunning simulation ${fullName}:\n  Collection throughput was not increased - simulation aborted\n `,
    { after: statistics.after }
  )
  _memorizeSimulationResult({ ...simulationSetup, ...statistics, increase: 'no change' })
  Global.runningTestsCounter -= 1
  try {
    await resetThroughput()
    // eslint-disable-next-line no-empty
  } catch (error2) {}
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
  let query

  switch (mode) {
    case 'update':
      updateData.updateStep = updateStep
      query = model.findOneAndUpdate({ name }, updateData)
      document = await query.exec()
      break

    case 'update+':
      updateData.updateStep = updateStep
      await model.findOneAndUpdate({ name }, updateData)
      document = await model.findOne({ name })
      if (document == null) {
        throw new Error(
          `Update of test record failed - findOne({ name: "${name}" }) returned nothing`
        )
      }
      if (document.updateStep !== updateStep) {
        throw new Error(
          `Update of test record failed - expected updateStep to be ${updateStep}, but got ${document.updateStep}`
        )
      }
      break

    case 'save':
      document = await model.findOne({ name })
      if (document == null) {
        throw new Error(
          `Update of test record failed - findOne({ name: "${name}" }) returned nothing`
        )
      }
      document.updateStep = updateStep
      await document.save()
      break

    case 'save-0':
    case 'failing save 2':
      document = await model.findOne({ name })
      if (document == null) {
        throw new Error(
          `Update of test record failed - findOne({ name: "${name}" }) returned nothing`
        )
      }
      await document.save()
      break

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

function _memorizeStartTimestampDuringFirstSimulation() {
  if (Global.timestamps.start == null) {
    Global.timestamps.start = new Date().getTime()
  }
}

function _saveSimulationResultsIntoMarkdown(done) {
  if (Global.results.length === 0) {
    done()
    return
  }
  expect(Global.timestamps.start).not.toBeNull()

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

async function _disconnectMongoose() {
  if (Global.runningTestsCounter > 0) {
    // eslint-disable-next-line no-console
    console.error("Won't disconnect Mongoose while there are still some tests running", {
      counter: Global.runningTestsCounter,
    })
    return
  }

  await disconnectMongoose()
}
