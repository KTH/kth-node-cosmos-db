/* eslint-disable no-use-before-define */

module.exports = testBasicFunctionExport

function testBasicFunctionExport(callback, prefix = '') {
  const adaptedPrefix = prefix === '' ? '' : `${prefix} `

  it(`${adaptedPrefix}is available`, () => {
    expect(callback).toBeDefined()
  })
  it(`${adaptedPrefix}is a function`, () => {
    expect(callback).toBeFunction()
  })
}
