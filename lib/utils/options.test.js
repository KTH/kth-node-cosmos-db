jest.mock('kth-node-log')

const { getTestOptions } = require('./options.test-data')

const optionsUtils = require('./options')

test(`The mandatory options are ${optionsUtils.REQUIRED_OPTION_KEYS}.`, () => {
  expect(optionsUtils.REQUIRED_OPTION_KEYS).toMatchInlineSnapshot(`
    Array [
      "host",
      "db",
      "collections",
      "password",
      "username",
      "maxThroughput",
    ]
  `)
})

describe('Helper validate()', () => {
  it('- when used w/o argument - FAILS', () => {
    const callback = () => optionsUtils.validate()

    expect(callback).toThrow()
  })

  it('- when used with valid option object - succeeds', () => {
    const options = getTestOptions('valid')

    optionsUtils.validate(options)
  })

  it('- when used with invalid option object (missing key) - FAILS as expected', () => {
    const options = getTestOptions('missingKey')

    const callback = () => optionsUtils.validate(options)

    expect(callback).toThrow('username')
  })

  it('- when used with invalid option object (invalid collection) - FAILS as expected', () => {
    const options = getTestOptions('invalidCollection')

    const callback = () => optionsUtils.validate(options)

    expect(callback).toThrow('Collections need at least a name')
  })
})
