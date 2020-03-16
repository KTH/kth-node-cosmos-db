/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

const cosmosDb = require('./cosmosDb')
const handleError = require('./handleError')
const options = require('./options')
const url = require('./url')
const useMongoNative = require('./useMongoNative')

module.exports = {
  cosmosDb,
  handleError,
  options,
  url,
  useMongoNative
}
