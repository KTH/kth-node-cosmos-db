/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

const mocks = {
  createDatabase: jest.fn().mockResolvedValue({ id: 'testDatabase ' }),
  createContainer: jest.fn().mockResolvedValue({ id: 'testContainer' }),
  getOneContainerByClient: jest.fn().mockResolvedValue({ id: 'testContainer' }),
  getContainerByDatabase: jest.fn().mockResolvedValue({ id: 'testContainer' }),
  getContainerThroughput: jest.fn().mockResolvedValue(700),
  setContainerThroughput: jest.fn().mockResolvedValue(null)
}

module.exports = {
  ...mocks,
  _listAllCalls,
  _clearAllCalls
}

function _listAllCalls() {
  const allCalls = {}
  let foundCall = false

  const mockedFunctions = Object.keys(mocks)

  mockedFunctions.forEach(name => {
    const { calls } = mocks[name].mock
    if (calls.length > 0) {
      foundCall = true
      allCalls[name] = calls
    }
  })

  return foundCall ? allCalls : null
}

function _clearAllCalls() {
  Object.values(mocks).forEach(func => func.mockClear())
}
