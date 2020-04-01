/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

const MODE_DEVELOPMENT = 'development'
const MODE_PRODUCTION = 'production'

module.exports = {
  saveState,
  restoreState,
  simulate,
  simulateDevelopment,
  simulateProduction,
  ensure,
  ensureDevelopment,
  ensureProduction,
  MODE_DEVELOPMENT,
  MODE_PRODUCTION
}

const assert = require('assert')

const Global = {
  saveCounter: 0
}

function saveState() {
  const hasSavedStateWhichWasNotRestoredYet = Global.saveCounter > 0

  if (hasSavedStateWhichWasNotRestoredYet) {
    Global.saveCounter += 1
    return
  }

  Global.NODE_ENV = process.env.NODE_ENV
  Global.USE_COSMOS_DB = process.env.USE_COSMOS_DB
  Global.saveCounter = 1
}

function restoreState() {
  const hasSavedStateWhichWasNotRestoredYet = Global.saveCounter > 0

  if (hasSavedStateWhichWasNotRestoredYet) {
    process.env.NODE_ENV = Global.NODE_ENV
    process.env.USE_COSMOS_DB = Global.USE_COSMOS_DB
    Global.saveCounter -= 1
  }
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

function ensure(mode) {
  switch (mode) {
    case MODE_DEVELOPMENT:
      ensureDevelopment()
      break
    case MODE_PRODUCTION:
      ensureProduction()
      break
    default:
      throw new Error(`Unknown environment mode (${mode})`)
  }
}

function ensureDevelopment() {
  assert(process.env.NODE_ENV === MODE_DEVELOPMENT)
  assert(process.env.USE_COSMOS_DB === 'false')
}

function ensureProduction() {
  assert(process.env.NODE_ENV === MODE_PRODUCTION)
  assert(process.env.USE_COSMOS_DB === 'false')
}
