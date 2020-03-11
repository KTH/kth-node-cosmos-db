/* eslint-disable no-use-before-define */

// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose')

module.exports = getDummyMongooseModel

const Global = {}

function getDummyMongooseModel() {
  const sn = Global.testModelSerialNumber || 1

  const schema = new mongoose.Schema({ name: 'string', age: 'string' })
  const model = mongoose.model(`Test-${sn}`, schema)

  Global.testModelSerialNumber = sn + 1

  return model
}
