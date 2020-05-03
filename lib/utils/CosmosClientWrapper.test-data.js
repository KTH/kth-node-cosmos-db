/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

const CosmosClientWrapper = require('./CosmosClientWrapper')

// eslint-disable-next-line import/newline-after-import
const MockedCosmosDbUtils = require('./cosmosDb')
const { _clearAllCalls: clearAllCosmosDbCalls } = MockedCosmosDbUtils

module.exports = {
  getTestOptions,
  getAsyncRunner,
}

function getTestOptions(target = 'all') {
  const optionSets = {}

  optionSets.valid = {
    host: 'localhost',
    db: 'test',
    collections: [{ name: 'test', throughput: 500 }],
    password: '123',
    username: 'test',
    maxThroughput: 1000,
  }

  optionSets.withTwoCollections = {
    host: 'localhost',
    db: 'test',
    collections: [{ name: 'test', throughput: 500 }, { name: 'test-2' }],
    password: '123',
    username: 'test',
    maxThroughput: 1000,
  }

  optionSets.missingUsername = {
    host: 'localhost',
    db: 'test',
    collections: [
      { name: 'test', throughput: 500 },
      { name: undefined, throughput: undefined },
    ],
    password: '123',
    maxThroughput: 1000,
    // username: 'test'
  }

  optionSets.invalidCollection = {
    host: 'localhost',
    db: 'test',
    collections: [{ name: 'test', throughput: 500 }, {}],
    password: '123',
    username: 'test',
    maxThroughput: 1000,
  }

  if (target === 'all') {
    return optionSets
  }

  if (optionSets[target] == null) {
    throw new Error(`Can't find test data for target "${target}"`)
  }

  return optionSets[target]
}

function getAsyncRunner(methodName) {
  switch (methodName) {
    case 'init':
      return _asyncRunnerOfInit()
    case 'getCollectionThroughput':
      return _asyncRunnerOfGetCollectionThroughput()
    case 'listCollectionsWithThroughput':
      return _asyncRunnerOfListCollectionsWithThroughput()
    case 'increaseCollectionThroughput':
      return _asyncRunnerOfIncreaseCollectionThroughput()
    case 'updateCollectionThroughput':
      return _asyncRunnerOfUpdateCollectionThroughput()
    case 'updateAllCollectionsThroughput':
      return _asyncRunnerOfUpdateAllCollectionsThroughput()
    case 'resetThroughput':
      return _asyncRunnerOfResetThroughput()
    default:
      throw new Error(`getAsyncRunner(): Invalid method name "${methodName}"`)
  }
}

function _asyncRunnerOfInit() {
  const asyncRunner = async input => {
    const preparations = await _getClientWrapperAndOptions(false, 'withTwoCollections')

    const { client } = preparations

    if (input != null && typeof input === 'object') {
      _applyMockupAdaptions(input.mockupAdaptions)
    }
    clearAllCosmosDbCalls()

    await client.init()

    return preparations
  }
  return asyncRunner
}

function _asyncRunnerOfGetCollectionThroughput() {
  const asyncRunner = async input => {
    const preparations = await _getClientWrapperAndOptions(true)

    const { client, collections } = preparations
    const { name: collectionName } = collections[0]

    if (input != null && typeof input === 'object') {
      _applyMockupAdaptions(input.mockupAdaptions)
    }
    clearAllCosmosDbCalls()

    const result = await client.getCollectionThroughput(collectionName)

    return { ...preparations, result }
  }
  return asyncRunner
}

function _asyncRunnerOfListCollectionsWithThroughput() {
  const asyncRunner = async input => {
    const preparations = await _getClientWrapperAndOptions(true, 'withTwoCollections')

    const { client, collections } = preparations
    const { name: collectionName1 } = collections[0]
    const { name: collectionName2 } = collections[1]

    if (input != null && typeof input === 'object') {
      _applyMockupAdaptions(input.mockupAdaptions)
    }
    clearAllCosmosDbCalls()

    const result = await client.listCollectionsWithThroughput()

    return { ...preparations, result, collectionName1, collectionName2 }
  }
  return asyncRunner
}

function _asyncRunnerOfIncreaseCollectionThroughput() {
  const asyncRunner = async input => {
    const preparations = await _getClientWrapperAndOptions(true)

    const { client, collections } = preparations
    const { name: collectionName } = collections[0]

    if (input != null && typeof input === 'object') {
      _applyMockupAdaptions(input.mockupAdaptions)
    }
    clearAllCosmosDbCalls()

    const result = await client.increaseCollectionThroughput(collectionName)

    return { ...preparations, result }
  }
  return asyncRunner
}

function _asyncRunnerOfUpdateCollectionThroughput() {
  const asyncRunner = async input => {
    const preparations = await _getClientWrapperAndOptions(true)
    const { client, collections } = preparations

    const { name: collectionName, throughput } = collections[0]
    let newThroughput = throughput + 600

    if (input != null && typeof input === 'object') {
      _applyMockupAdaptions(input.mockupAdaptions)
      if (input.newThroughput != null) {
        newThroughput = input.newThroughput
      }
    }
    clearAllCosmosDbCalls()

    const result = await client.updateCollectionThroughput(collectionName, newThroughput)

    return { ...preparations, result, newThroughput }
  }
  return asyncRunner
}

function _asyncRunnerOfUpdateAllCollectionsThroughput() {
  const asyncRunner = async input => {
    const preparations = await _getClientWrapperAndOptions(true, 'withTwoCollections')

    const { client } = preparations
    let newThroughput = 1100

    if (input != null && typeof input === 'object') {
      _applyMockupAdaptions(input.mockupAdaptions)
      if (input.newThroughput != null) {
        newThroughput = input.newThroughput
      }
    }
    clearAllCosmosDbCalls()

    const result = await client.updateAllCollectionsThroughput(newThroughput)

    return { ...preparations, result }
  }
  return asyncRunner
}

function _asyncRunnerOfResetThroughput() {
  const asyncRunner = async input => {
    const preparations = await _getClientWrapperAndOptions(true, 'withTwoCollections')
    const { client } = preparations

    if (input != null && typeof input === 'object') {
      _applyMockupAdaptions(input.mockupAdaptions)
    }
    clearAllCosmosDbCalls()

    const result = await client.resetThroughput()

    return { ...preparations, result }
  }
  return asyncRunner
}

async function _getClientWrapperAndOptions(runInit, target = 'valid') {
  const options = getTestOptions(target)

  const client = new CosmosClientWrapper(options)

  if (runInit) {
    await client.init()
  }

  return { ...options, client }
}

async function _applyMockupAdaptions(mockupAdaptions) {
  if (mockupAdaptions == null) {
    return
  }
  if (typeof mockupAdaptions !== 'object') {
    throw new Error(
      `_applyMockupAdaptions() failed - invalid input type "${typeof mockupAdaptions}"`
    )
  }

  const funcNameList = Object.keys(mockupAdaptions)
  funcNameList.forEach(funcName => {
    const adaptionList = mockupAdaptions[funcName]

    if (
      !Array.isArray(adaptionList) ||
      adaptionList.some(item => item == null || typeof item !== 'object')
    ) {
      throw new Error(
        `_applyMockupAdaptions failed() - invalid input structure, expected array of objects`
      )
    }

    adaptionList.forEach(adaption => {
      const keys = Object.keys(adaption)
      if (keys.includes('return')) {
        MockedCosmosDbUtils[funcName].mockReturnValueOnce(adaption.return)
      } else if (keys.includes('resolve')) {
        MockedCosmosDbUtils[funcName].mockResolvedValueOnce(adaption.resolve)
      } else if (keys.includes('reject')) {
        MockedCosmosDbUtils[funcName].mockRejectedValueOnce(adaption.reject)
      } else {
        throw new Error('_applyMockupAdaptions failed - invalid adaption object')
      }
    })
  })
}
