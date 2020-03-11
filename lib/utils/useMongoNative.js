/* eslint-disable no-use-before-define */

module.exports = useMongoNative

function useMongoNative() {
  return process.env.NODE_ENV === 'development' && process.env.USE_COSMOS_DB !== 'true'
}
