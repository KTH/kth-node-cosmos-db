/* eslint-disable import/no-extraneous-dependencies */
/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

module.exports = {
  start,
  stop,
  getTestModel,
  getTestObjectId,
  connectRealServer,
  ensureRealServerConnection,
  disconnectRealServer
}

const assert = require('assert')

const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

const { parseConnectionStringIntoUrl, composeUrlIntoMongoConnectionString } = require('./CosmosDb')

const Global = {
  server: null,
  testModelSerialNumber: 1,

  realConnection: {
    connecting: false,
    established: false
  }
}

async function start() {
  if (Global.server != null) {
    return
  }

  Global.server = new MongoMemoryServer()
  const dbConnectionString = await Global.server.getUri()

  mongoose.Promise = Promise

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }

  mongoose.connection.on('error', error => {
    // eslint-disable-next-line no-console
    console.log('Mongoose mockup:', error)
  })

  mongoose.connection.once('open', () => {
    // eslint-disable-next-line no-console
    console.log(`Mongoose mockup: Connected`)
  })

  await mongoose.connect(dbConnectionString, mongooseOpts)
}

async function stop() {
  if (Global.server == null) {
    return
  }

  await mongoose.disconnect()
  await Global.server.stop()
  Global.server = null
}

async function getTestModel(numberOfInitialDocuments = 1, options = {}) {
  const { definition, template } = options

  assert(Global.server != null, 'Await Mongoose.start(), first')

  const sn = Global.testModelSerialNumber
  Global.testModelSerialNumber += 1

  const schema = new mongoose.Schema(definition || { name: String, age: String })
  const Model = mongoose.model(`Test-${sn}`, schema)

  const addSomeTestDocuments = []
  for (let i = 0; i < numberOfInitialDocuments; i++) {
    const newDocument = new Model(template || { name: 'testName', age: `${i + 1} years` })
    addSomeTestDocuments.push(newDocument.save())
  }
  await Promise.all(addSomeTestDocuments)

  return Model
}

function getTestObjectId() {
  return '507f191e810c19729de860ea'
}

/**
 * @param {object} input
 * @param {string} input.connectionString
 * @param {string} input.databaseName
 * @param {boolean} [input.disableSslRejection]
 *
 * @returns {Promise}
 *      Resolves after a Mongoose connection was established
 */
async function connectRealServer({ connectionString, databaseName, disableSslRejection = false }) {
  const { connecting, established } = Global.realConnection
  if (connecting || established) {
    return
  }
  Global.realConnection.connecting = true

  const { url } = parseConnectionStringIntoUrl(connectionString)
  const composeData = { url, databaseName, disableSslRejection }
  const { fullString } = composeUrlIntoMongoConnectionString(composeData)

  const useNewUrlParser = true
  const useUnifiedTopology = true

  await mongoose.connect(fullString, { useNewUrlParser, useUnifiedTopology })

  Global.realConnection.connecting = false
  Global.realConnection.established = true
}

/**
 * @returns iff a Mongoose connection is established
 * @throws {Error} otherwise
 */
function ensureRealServerConnection() {
  if (!Global.realConnection.established) {
    throw new Error('Missing Mongoose connection')
  }
}

/**
 * @returns {Promise}
 *      Resolves after a current Mongoose connection was closed
 * @throws {Error}
 *      iff module is still establishing a Mongoose connection
 */
async function disconnectRealServer() {
  const { connecting, established } = Global.realConnection
  if (!established) {
    return
  }
  if (connecting) {
    throw new Error("Can't close Mongoose connection right now - still connecting")
  }

  await new Promise((resolve, reject) => {
    mongoose.connection.on('close', resolve)
    mongoose.connection.on('error', reject)
    mongoose.connection.close()
  })

  Global.realConnection.established = false
}
