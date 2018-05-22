'use strict'

module.exports = {
  initClient: require('./lib/client').initClient,
  getClient: require('./lib/client').getClient,
  wrap: require('./lib/wrapper')
}
