/* eslint-disable import/no-extraneous-dependencies */
/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

module.exports = { start, stop, getTestModel, getTestObjectId }

const assert = require('assert')

const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

const Global = {
  server: null,
  testModelSerialNumber: 1
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
