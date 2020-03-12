const collectAllInternalMethods = require('./collectAllInternalMethods')
const Environment = require('./Environment')
const getDummyMongooseModel = require('./getDummyMongooseModel')
const getObjectKeysWithDifferentValues = require('./getObjectKeysWithDifferentValues')
const removeCodeCoveragePollution = require('./removeCodeCoveragePollution')

module.exports = {
  collectAllInternalMethods,
  Environment,
  getDummyMongooseModel,
  getObjectKeysWithDifferentValues,
  removeCodeCoveragePollution
}
