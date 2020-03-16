/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

module.exports = useMongoNative

function useMongoNative() {
  return process.env.NODE_ENV === 'development' && process.env.USE_COSMOS_DB !== 'true'
}
