/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

module.exports = {
  ensureValidPrimitive,
  ensureValidObject,
  ensureValidClass,
  ensureValidArray,
  ensureNotMissing,
  ensureObjectFollowsSchema
}

const assert = require('assert')

/**
 * @param {object} options
 * @param {*} options.input
 * @param {string} [options.prefix]
 * @param {string} [options.text]
 * @param {boolean|Function} [options.check]
 *      e.g. typeof input === "string"
 *      or   input => typeof input === "string"
 *
 * @throws if input is invalid
 */
function ensureValidPrimitive({ input, prefix, text = 'argument', check }) {
  const _prefix = prefix ? `${prefix}: ` : ''
  ensureNotMissing({ input, text })
  assert(
    typeof input !== 'object',
    `${_prefix}Invalid ${text} (expected primitive, but got instance of ${input.constructor.name} ` +
      `with keys "${Object.keys(input).join('","')}")`
  )
  _ensurePassingCheck({ input, prefix, text, check })
}

/**
 * @param {object} options
 * @param {*} options.input
 * @param {string} [options.prefix]
 * @param {string} [options.text]
 * @param {boolean|Function} [options.check]
 *      e.g. input => input.name === "..."
 *
 * @throws if input is invalid
 */
function ensureValidObject({ input, prefix, text = 'argument', check }) {
  const _prefix = prefix ? `${prefix}: ` : ''
  ensureNotMissing({ input, prefix, text })
  assert(
    typeof input === 'object',
    `${_prefix}Invalid ${text} (expected object, but got ${typeof input})`
  )
  _ensurePassingCheck({ input, prefix, text, check })
}

/**
 * @param {object} options
 * @param {*} options.input
 * @param {string} [options.prefix]
 * @param {string} [options.text]
 * @param {string} [options.className]
 * @param {boolean|Function} [options.check]
 *      e.g. input => typeof input.getName === "function"
 *
 * @throws if input is invalid
 */
function ensureValidClass({ input, prefix, text = 'argument', className, check }) {
  const _prefix = prefix ? `${prefix}: ` : ''
  ensureNotMissing({ input, prefix, text })
  assert(
    typeof input === 'object' || typeof input === 'function',
    `${_prefix}Invalid ${text} (expected class, but got ${typeof input})`
  )
  if (typeof className === 'string' && className !== '') {
    assert(
      input.constructor.name === className,
      `${_prefix}Invalid ${text} (expected ${className}, but got ${input.constructor.name})`
    )
  }
  _ensurePassingCheck({ input, prefix, text, check })
}

/**
 * @param {object} options
 * @param {*} options.input
 * @param {string} [options.prefix]
 * @param {string} [options.text]
 * @param {boolean|Function} [options.check]
 *      e.g. input => input.length > 2
 *
 * @throws if input is invalid
 */
function ensureValidArray({ input, prefix, text = 'argument', check }) {
  const _prefix = prefix ? `${prefix}: ` : ''
  ensureNotMissing({ input, prefix, text })
  assert(
    Array.isArray(input),
    `${_prefix}Invalid ${text} (expected array, but got ${typeof input})`
  )
  _ensurePassingCheck({ input, prefix, text, check })
}

/**
 * @param {object} options
 * @param {*} options.input
 * @param {string} [options.prefix]
 * @param {string} options.text
 */
function ensureNotMissing({ input, prefix, text = 'argument' }) {
  const _prefix = prefix ? `${prefix}: ` : ''
  assert(input != null, `${_prefix}Missing ${text}`)
  assert(
    !(input instanceof Promise),
    `${_prefix}Missing ${text} (got Promise - did you forgot to "await" somewhere)`
  )
}

function _ensurePassingCheck({ input, prefix, text, check }) {
  const _prefix = prefix ? `${prefix}: ` : ''
  if (['boolean', 'function'].includes(typeof check)) {
    const _check = typeof check === 'function' ? check(input) : check
    assert(_check, `${_prefix}Invalid ${text} (got ${JSON.stringify(input)})`)
  }
}

/**
 * @param {object} options
 * @param {object} options.input e.g. { host: "kth.se", port: 30 }
 * @param {object} options.schema e.g.
 *      { host: { type: "string", match: "hostname", required: true }.
 *        port: { type: "number" } }
 * @param {boolean} [options.checkForInvalidKeys]
 *      Set to true if only properties from schema are allowed in input
 * @param {boolean} [options.ignoreMissingKeys]
 *      Set to true if required keys may be missing,
 *      e.g. when only testing a subset of the schema in connection with setOption()
 *
 * @throws if input is not valid
 */
function ensureObjectFollowsSchema({
  input,
  schema,
  checkForInvalidKeys = false,
  ignoreMissingKeys = false
}) {
  const Check = _hoistObjectFollowsSchemaCheck()
  const checkRunner = new Check({ input, schema, checkForInvalidKeys, ignoreMissingKeys })

  checkRunner.checkForMissingKeys()
  checkRunner.checkForInvalidKeys()
  checkRunner.checkInputTypes()
}

function _hoistObjectFollowsSchemaCheck() {
  class ObjectFollowsSchemaCheck {
    constructor({ input, schema, checkForInvalidKeys = false, ignoreMissingKeys = false }) {
      assert(input != null, "Can't check validity: Missing input")
      assert(typeof input === 'object', "Can't check validity: Invalid input")
      this.input = input
      this.inputKeys = Object.keys(this.input)

      assert(schema != null && typeof schema === 'object', "Can't check validity: Invalid schema")
      this.schema = schema
      this.schemaKeys = Object.keys(this.schema)

      assert(
        this.schemaKeys.every(
          key => this.schema[key] != null && typeof this.schema[key] === 'object'
        ),
        "Can't check validity: Invalid schema structure"
      )

      this.switches = { checkForInvalidKeys, ignoreMissingKeys }
    }

    checkForMissingKeys() {
      if (this.switches.ignoreMissingKeys) {
        return
      }

      const requiredKeys = this.schemaKeys.filter(key => this.schema[key].required)

      const missingKeys = _compareArrays({
        list1: requiredKeys,
        list2: this.inputKeys,
        mode: 'only in list 1'
      })

      assert(missingKeys.length === 0, `Required keys missing: ${missingKeys.join(', ')}`)
    }

    checkForInvalidKeys() {
      if (!this.switches.checkForInvalidKeys) {
        return
      }

      const unknownKeys = _compareArrays({
        list1: this.inputKeys,
        list2: this.schemaKeys,
        mode: 'only in list 1'
      })

      assert(unknownKeys.length === 0, `Unknown keys: ${unknownKeys.join(', ')}`)
    }

    checkInputTypes() {
      const _hasInvalidInputType = key => {
        const type = this.schema[key] ? this.schema[key].type : null
        const data = this.input[key]

        if (type == null) {
          return false
        }
        if (typeof type === 'function') {
          return !type(data)
        }
        assert(typeof type === 'string', `Can't check validity: Invalid input type "${type}"`)

        switch (type) {
          case 'object':
            return data == null || typeof data !== 'object'
          case 'boolean':
          case 'number':
          case 'string':
          case 'function':
            // eslint-disable-next-line valid-typeof
            return typeof data !== type
          default:
            return ObjectFollowsSchemaCheck._isValidSpecialInput(data, type) === false
        }
      }

      const invalidKeys = this.inputKeys.filter(_hasInvalidInputType)
      assert(invalidKeys.length === 0, `Properties with invalid data: ${invalidKeys.join(', ')}`)
    }

    static _isValidSpecialInput(data, type) {
      switch (type) {
        case 'hostname':
          return typeof data === 'string' && /^(\w|\w[\w-.]*\w)$/.test(data)
        case 'port':
          return ['number', 'string'].includes(typeof data) && parseInt(data) > 0

        case 'azureKey':
          return typeof data === 'string' && /^[a-zA-Z0-9+/]+={0,2}$/.test(data)
        case 'azureDatabaseName':
          return typeof data === 'string' && /^[^/\\#?]{1,255}$/.test(data)
        case 'azureThroughput':
          return ['number', 'string'].includes(typeof data) && parseInt(data) >= 100
        case 'azureThroughputSteps':
          return (
            ['number', 'string'].includes(typeof data) &&
            parseInt(data) >= 100 &&
            parseInt(data) % 100 === 0
          )

        default:
          throw new Error(`Can't check validity: Unknown input type "${type}"`)
      }
    }
  }

  return ObjectFollowsSchemaCheck
}

/**
 * @param {object} options
 * @param {Array} options.list1 e.g. [1, 2, 3, 4, 5, 6]
 * @param {Array} options.list2 e.g. [3, 4, 5, 6, 7, 8]
 * @param {string} options.mode e.g. "only in list 1"
 *
 * @returns {Array} e.g. [1, 2]
 */
function _compareArrays({ list1, list2, mode }) {
  switch (mode) {
    case 'only in list 1':
      return list1.filter(item => !list2.includes(item))
    default:
      throw new Error(`Unknown mode in _compareArrays() (mode ${mode})`)
  }
}
