/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

module.exports = {
  getTestOptions
}

function getTestOptions(target = 'all') {
  const optionSets = {}

  optionSets.valid = {
    host: 'localhost',
    db: 'test',
    collections: [{ name: 'test', throughput: 500 }],
    password: '123',
    username: 'test',
    maxThroughput: 1000
  }

  optionSets.withTwoCollections = {
    host: 'localhost',
    db: 'test',
    collections: [{ name: 'test', throughput: 500 }, { name: 'test-2' }],
    password: '123',
    username: 'test',
    maxThroughput: 1000
  }

  optionSets.missingKey = {
    host: 'localhost',
    db: 'test',
    collections: [
      { name: 'test', throughput: 500 },
      { name: undefined, throughput: undefined }
    ],
    password: '123',
    maxThroughput: 1000
    // username: 'test'
  }

  optionSets.invalidCollection = {
    host: 'localhost',
    db: 'test',
    collections: [{ name: 'test', throughput: 500 }, {}],
    password: '123',
    username: 'test',
    maxThroughput: 1000
  }

  if (target === 'all') {
    return optionSets
  }

  if (optionSets[target] == null) {
    throw new Error(`Can't find test data for target "${target}"`)
  }

  return optionSets[target]
}
