const useTls = endpoint => {
  let washedHost = endpoint.replace('http://', '')
  washedHost = washedHost.replace('https://', '')
  washedHost = washedHost.replace('//', '')
  washedHost = washedHost.replace(/\:\d*/, '')

  return `https://${washedHost}`
}

/**
 * Exports
 */
module.exports = {
  useTls
}
