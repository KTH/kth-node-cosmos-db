/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

const mocks = {
  createDatabase: jest.fn(),
  createContainer: jest.fn(),
  getOneContainerByClient: jest.fn(),
  getContainerByDatabase: jest.fn(),
  getContainerThroughput: jest.fn(),
  setContainerThroughput: jest.fn()
}

_resetAllMocks()

module.exports = {
  ...mocks,
  _resetAllMocks,
  _listAllCalls,
  _clearAllCalls
}

function _resetAllMocks() {
  Object.values(mocks).forEach(func => func.mockReset())

  mocks.createDatabase.mockResolvedValue({ id: 'testDatabase ' })
  mocks.createContainer.mockResolvedValue({ id: 'testContainer' })
  mocks.getOneContainerByClient.mockResolvedValue({ id: 'testContainer' })
  mocks.getContainerByDatabase.mockResolvedValue({ id: 'testContainer' })
  mocks.getContainerThroughput.mockResolvedValue(700)
  mocks.setContainerThroughput.mockResolvedValue(null)
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
