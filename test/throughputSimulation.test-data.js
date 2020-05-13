/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

module.exports = {
  getConfiguration,
  getThroughputSimulations,
  composeSimulationReport,
}

const prettier = require('prettier')

/**
 * @returns {object}
 */
function getConfiguration() {
  const initialThroughput = 400

  const mongoose = {
    _templateModelName: 'UpdateSimulation',
    modelDefinition: { name: String, updateStep: Number, data: String },
    documentTemplate: { name: 'Test, Integration', updateStep: -1, data: 'abcdefg' },
    shardKey: { name: 1 },
  }

  const cosmos = {
    fallbackDatabaseName: 'integrationTests',
    initialThroughput,
    maxThroughput: 20000,
    _collectionTemplate: {
      name: 'updatesimulations',
      throughput: initialThroughput,
      partitionKey: ['/name'],
    },
  }

  const configuration = { mongoose, cosmos }
  return configuration
}

/**
 * @param {boolean} fullSet
 *
 * @returns {Array<Array>}
 */
function getThroughputSimulations(fullSet = false) {
  const recordsets = fullSet
    ? {
        small: [2, 2],
        medium: [10, 10],
        large: [100, 100],
        'x-large': [1000, 1000],
        mixed: [2, 10, 100, 1000],
      }
    : {
        medium: [10, 10],
        mixed: [2, 10, 100, 1000],
      }
  const recordsetList = Object.keys(recordsets)

  const modeList = fullSet
    ? [
        'update',
        'update+',
        'save',
        'save-0',
        //
      ]
    : [
        'update',
        'update+',
        'save',
        'save-0',
        //
      ]

  const retryStrategyList = fullSet
    ? [
        'fastest',
        'fast',
        'good',
        'cheapest',
        'fourAttemptsOnly',
        //
      ]
    : ['good']

  const throughputStepsizeList = fullSet
    ? [
        100,
        200,
        //
      ]
    : [200]

  const testDataList = []

  recordsetList.forEach(recordsetName => {
    const recordSizes = recordsets[recordsetName]
    const shortName = recordsetName
    throughputStepsizeList.forEach(throughputStepsize => {
      modeList.forEach(mode => {
        retryStrategyList.forEach(retryStrategy => {
          const fullName = `with ${
            recordsetName === 'medium' ? 'mediumsize' : recordsetName
          } recordsets (strategy "${retryStrategy}", operation "${mode}", stepsize ${throughputStepsize})`
          testDataList.push([
            fullName,
            {
              fullName,
              shortName,
              recordSizes,
              retryStrategy,
              mode,
              throughputStepsize,
            },
          ])
        })
      })
    })
  })

  return testDataList
}

function composeSimulationReport({ results, start, duration }) {
  const config = getConfiguration()

  const output = `
# Throughput simulation

The last simulations were run on ${start}.

In total, it took ${duration} seconds.

## Results

${results}

## Configuration

\`\`\`json
${JSON.stringify(config)}
\`\`\`
`

  return prettier.format(output, { parser: 'markdown' })
}
