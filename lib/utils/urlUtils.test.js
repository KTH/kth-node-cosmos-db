/* eslint-env mocha */

'use strict'

const urlUtils = require('./urlUtils')

test('Format strings', () => {
  expect(urlUtils.useTls('localhost')).toBe('https://localhost')
  expect(urlUtils.useTls(':localhost')).toBe('https://localhost')
  expect(urlUtils.useTls('https://localhost')).toBe('https://localhost')
})
