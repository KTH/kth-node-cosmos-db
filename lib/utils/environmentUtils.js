/* eslint-env mocha */

'use strict'

const useMongoNative = () => {
  return process.env.NODE_ENV === 'development' && process.env.USE_COSMOS_DB !== 'true'
}

module.exports = {
  useMongoNative
}
