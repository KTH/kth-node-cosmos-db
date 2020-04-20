/* eslint no-use-before-define: ["error", "nofunc"] */
/* eslint require-await: "error" */

// @ts-check

jest.unmock('@azure/cosmos')

// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose')

const { CosmosDb: _CosmosDbTestUtils, Environment } = require('./lib')

const { parseConnectionStringIntoUrl, composeUrlIntoMongoConnectionString } = _CosmosDbTestUtils

// const { cosmosDb: CosmosDbUtils } = require('../lib/utils')
const { createClient } = require('../lib/client')
// const wrap = require('../lib/utils/wrap')

const ONE_MINUTE_TIMEOUT = 60000
const LONG_TIMEOUT = 60 * ONE_MINUTE_TIMEOUT
const ENV_DATABASE_CONNECTION = 'INTEGRATION_TEST_COSMOSDB_CONNECTION'
const ENV_DATABASE_NAME = 'INTEGRATION_TEST_COSMOSDB_DATABASE'

const ONE_KILOBYTE = 1024

const Global = {
  isMongooseConnected: false
}

describe('Mongoose model wrapper function wrap()', () => {
  beforeAll(Environment.saveState)
  beforeAll(Environment.simulateProduction)
  beforeAll(_connectMongoose, ONE_MINUTE_TIMEOUT)

  // it.skip('my test', async () => {
  //   const initialThroughput = 400
  //   const collections = [{ name: 'updateSimulation', throughput: initialThroughput }]
  //   const maxThroughput = 1000
  //   const throughputStepsize = 200
  //
  //   const client = await _prepareTestDatabase({
  //     collections,
  //     maxThroughput,
  //     throughputStepsize
  //   })
  //
  //   const container = await CosmosDbUtils.getOneContainerByClient(
  //     'updateSimulation',
  //     client.cosmosClient
  //   )
  //   const partitionKey1 = await CosmosDbUtils.getContainerPartitionKey(container)
  //   expect(partitionKey1).toEqual(['/name'])
  //
  //   await CosmosDbUtils.setContainerPartitionKey(container, ['/age'])
  //
  //   const partitionKey2 = await CosmosDbUtils.getContainerPartitionKey(container)
  //   expect(partitionKey2).toEqual(['/age'])
  // })

  runTestsAboutHandleError()

  afterAll(_disconnectionMongoose)
  afterAll(Environment.restoreState)
})

function runTestsAboutHandleError() {
  describe('activates internal handleError() that', () => {
    beforeAll(_ensureMongooseIsConnected)

    const initialThroughput = 400
    // const collections = [
    //   { name: 'updatesimulations', throughput: initialThroughput, partitionKey: ['/name'] }
    // ]
    // const collections = [{ name: 'updatesimulations', throughput: initialThroughput }]
    const collections = [{ name: 'updateSimulation', throughput: initialThroughput }]
    const maxThroughput = 6000
    const throughputStepsize = 200

    it(
      'automatically increases throughput if needed',
      async () => {
        const clientData = { collections, maxThroughput, throughputStepsize }
        const client = await _prepareTestDatabase(clientData)
        const model = await _getPreparedTestModelWithOneDocument(client)

        await _runSimulationAsync({
          client,
          model,
          maxSteps: 2000,
          recordSizes: [149, 1490],
          initialThroughput,
          throughputStepsize
        })
      },
      LONG_TIMEOUT
    )
  })
}

async function _connectMongoose() {
  if (Global.isMongooseConnected) {
    return
  }

  let connectOptions
  try {
    const connectionString = process.env[ENV_DATABASE_CONNECTION]
    const databaseName = process.env[ENV_DATABASE_NAME] || 'integrationTests'

    const { url } = parseConnectionStringIntoUrl(connectionString)
    const composeData = { url, databaseName, disableSslRejection: true }
    connectOptions = composeUrlIntoMongoConnectionString(composeData)
  } catch (error) {
    throw new Error(`Real CosmosDB connection needed for integration tests: Configure valid connection string as ${ENV_DATABASE_CONNECTION} - got error: ${error.message}'
    `)
  }

  const { fullString } = connectOptions
  const useNewUrlParser = true
  const useUnifiedTopology = true

  await mongoose.connect(fullString, { useNewUrlParser, useUnifiedTopology })

  Global.isMongooseConnected = true
}

function _ensureMongooseIsConnected() {
  if (Global.isMongooseConnected) {
    return
  }
  throw new Error('Mongoose error during integration test: Missing connection to CosmosDB')
}

async function _disconnectionMongoose() {
  if (!Global.isMongooseConnected) {
    return
  }

  await new Promise((resolve, reject) => {
    mongoose.connection.on('close', resolve)
    mongoose.connection.on('error', reject)
    mongoose.connection.close()
  })

  Global.isMongooseConnected = false
}

async function _getPreparedTestModelWithOneDocument(client) {
  const modelDefinition = { name: String, updateStep: Number, data: String }
  const documentTemplate = { name: 'Test, Integration', updateStep: 79, data: 'abcdefg' }

  // const testSchema = new mongoose.Schema(modelDefinition, { shardKey: { name: 1 } })
  const testSchema = new mongoose.Schema(modelDefinition, { collection: 'updateSimulation' })

  const Model = client.createMongooseModel('UpdateSimulation', testSchema, mongoose)
  // const Model = mongoose.model('updateSimulation', testSchema, 'updateSimulation')

  const newDocument = new Model(documentTemplate)
  await newDocument.save()

  return Model
}

async function _prepareTestDatabase({
  collections = [],
  maxThroughput = 1000,
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
  const index = updateStep % setup.testRecords.length
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
  maxSteps,
  recordSizes,
  initialThroughput,
  throughputStepsize
}) {
  await client.resetThroughput()

  const setup = _prepareSimulationRecords(recordSizes)

  const throughputInfo1 = await client.listCollectionsWithThroughput()
  const { throughput: throughput1 } = throughputInfo1[0]
  expect(throughput1).toBe(initialThroughput)

  const numberOfUpdateSteps = maxSteps
  const percentageOutputSteps = 5

  let kilobytes = 0

  // eslint-disable-next-line no-console
  console.log(`Starting simulating of up to ${numberOfUpdateSteps} document updates...`)

  const absolutOutputSteps = (percentageOutputSteps * numberOfUpdateSteps) / 100
  for (
    let updateStep = 1, nextOutputStep = absolutOutputSteps, nextPercentage = percentageOutputSteps;
    updateStep <= numberOfUpdateSteps;
    updateStep++
  ) {
    kilobytes += await _useRecordAsync({ setup, model, updateStep })

    const throughputInfo2 = await client.listCollectionsWithThroughput()
    const { throughput: throughput2 } = throughputInfo2[0]

    if (throughput2 !== throughput1) {
      expect(throughput2).toBeGreaterThanOrEqual(initialThroughput + throughputStepsize)
      // eslint-disable-next-line no-console
      console.log(
        `Collection throughput was just automatically increased from ${throughput1} to ${throughput2}\n` +
          `- aborting simulation after updating ${updateStep + 1} items ` +
          `with a total of ${kilobytes} kilobytes`
      )
      return
    }

    if (updateStep >= nextOutputStep) {
      // eslint-disable-next-line no-console
      console.log(
        `${updateStep + 1} ready (${nextPercentage} %) ` +
          `- collection throughput is still at ${throughput2}`
      )

      nextPercentage += percentageOutputSteps
      nextOutputStep += absolutOutputSteps
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
