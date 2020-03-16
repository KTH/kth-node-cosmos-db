/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

module.exports = {
  useTls
}

function useTls(endpoint) {
  let washedHost = endpoint.replace('http://', '')
  washedHost = washedHost.replace('https://', '')
  washedHost = washedHost.replace('//', '')
  washedHost = washedHost.replace(/:\d*/, '')

  return `https://${washedHost}`
}
