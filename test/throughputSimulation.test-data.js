/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

module.exports = {
  getConfiguration,
  getThroughputSimulations,
  composeSimulationReport,
}

const prettier = require('prettier')

function getConfiguration() {
  const initialThroughput = 400
  const collectionName = 'updatesimulations'

  const mongoose = {
    collectionName,
    modelName: 'UpdateSimulation',
    modelDefinition: { name: String, updateStep: Number, data: String },
    documentTemplate: { name: 'Test, Integration', updateStep: -1, data: 'abcdefg' },
    shardKey: { name: 1 },
  }

  const cosmos = {
    fallbackDatabaseName: 'integrationTests',
    initialThroughput,
    maxThroughput: 20000,
    collections: [{ name: collectionName, throughput: initialThroughput, partitionKey: ['/name'] }],
  }

  const configuration = { mongoose, cosmos }
  return configuration
}

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
    ? ['update', 'azureUpdate', 'update+', 'azureUpdate+', 'failing save', 'azureSave', 'azureWrap']
    : ['update+', 'azureUpdate+', 'failing save', 'azureSave', 'azureWrap']

  // modeList.splice(2, 0, 'failing save 2')

  const retryStrategyList = fullSet
    ? ['fastest', 'fast', 'good', 'cheapest', 'fourAttemptsOnly']
    : ['good']

  const throughputStepsizeList = fullSet ? [200] : [200]

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
            { fullName, shortName, recordSizes, retryStrategy, mode, throughputStepsize },
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