/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

const collectAllInternalMethods = require('./collectAllInternalMethods')
const Environment = require('./Environment')
const Mongoose = require('./Mongoose')
const getObjectKeysWithDifferentValues = require('./getObjectKeysWithDifferentValues')
const removeCodeCoveragePollution = require('./removeCodeCoveragePollution')
const testBasicFunctionExport = require('./testBasicFunctionExport')

module.exports = {
  collectAllInternalMethods,
  Environment,
  Mongoose,
  getObjectKeysWithDifferentValues,
  removeCodeCoveragePollution,
  testBasicFunctionExport
}
