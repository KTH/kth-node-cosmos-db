'use strict'

const { createClient, getClient } = require('./lib/cosmosClientWrapper')
const { wrap } = require('./lib/mongooseModelWrapper')

module.exports = {
  createClient,
  getClient,
  wrap
}
