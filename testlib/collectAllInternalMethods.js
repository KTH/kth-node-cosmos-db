/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

module.exports = collectAllInternalMethods

function collectAllInternalMethods(input) {
  if (typeof input !== 'object' && typeof input !== 'function') {
    return {}
  }

  const keys = Object.keys(input)
  const prototype = Object.getPrototypeOf(input)
  const prototypeKeys = Object.keys(prototype)

  const result = {}

  keys.forEach(key => {
    const value = input[key]
    if (typeof value === 'function') {
      result[key] = value
    }
  })

  prototypeKeys.forEach(key => {
    const value = prototype[key]
    if (typeof value === 'function') {
      result[`prototype/${key}`] = value
    }
  })

  return result
}
