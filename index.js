'use strict'

module.exports = {
  createClient: require('./lib/client').createClient,
  getClient: require('./lib/client').getClient,
  wrap: require('./lib/mongooseModelWrapper').wrap
}
