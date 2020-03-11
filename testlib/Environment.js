/* eslint-disable no-use-before-define */

const MODE_DEVELOPMENT = 'development'
const MODE_PRODUCTION = 'production'

module.exports = {
  saveState,
  restoreState,
  simulate,
  simulateDevelopment,
  simulateProduction,
  MODE_DEVELOPMENT,
  MODE_PRODUCTION
}

const Global = {}

function saveState() {
  Global.NODE_ENV = process.env.NODE_ENV
  Global.USE_COSMOS_DB = process.env.USE_COSMOS_DB
}

function restoreState() {
  process.env.NODE_ENV = Global.NODE_ENV
  process.env.USE_COSMOS_DB = Global.USE_COSMOS_DB
}

function simulate(mode) {
  switch (mode) {
    case MODE_DEVELOPMENT:
      simulateDevelopment()
      break
    case MODE_PRODUCTION:
      simulateProduction()
      break
    default:
      throw new Error(`Unknown environment mode (${mode})`)
  }
}

function simulateDevelopment() {
  process.env.NODE_ENV = MODE_DEVELOPMENT
  process.env.USE_COSMOS_DB = 'false'
}

function simulateProduction() {
  process.env.NODE_ENV = MODE_PRODUCTION
  process.env.USE_COSMOS_DB = 'false'
}
