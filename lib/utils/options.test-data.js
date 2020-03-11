/* eslint-disable no-use-before-define */

module.exports = {
  getTestOptions
}

function getTestOptions(id = 'all') {
  const optionSets = {}

  optionSets.valid = {
    host: 'localhost',
    db: 'test',
    collections: [{ name: 'test', throughput: 1500 }, { name: 'test-2' }],
    password: '123',
    username: 'test',
    maxThroughput: 1000
  }

  optionSets.missingKey = {
    host: 'localhost',
    db: 'test',
    collections: [
      { name: 'test', throughput: 1500 },
      { name: undefined, throughput: undefined }
    ],
    password: '123',
    maxThroughput: 1000
    // username: 'test'
  }

  optionSets.invalidCollection = {
    host: 'localhost',
    db: 'test',
    collections: [{ name: 'test', throughput: 1500 }, {}],
    password: '123',
    username: 'test',
    maxThroughput: 1000
  }

  return id === 'all' ? optionSets : optionSets[id]
}
