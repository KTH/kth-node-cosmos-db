/* eslint-disable no-use-before-define */

const info = jest.fn()
const error = jest.fn()
const warn = jest.fn()

module.exports = {
  info,
  error,
  warn,
  _listAllCalls,
  _clearAllCalls
}

function _listAllCalls() {
  return [...info.mock.calls, ...error.mock.calls, ...warn.mock.calls]
}

function _clearAllCalls() {
  info.mockClear()
  error.mockClear()
  warn.mockClear()
}
