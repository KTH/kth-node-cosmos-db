/* eslint-disable no-use-before-define */

module.exports = getObjectKeysWithDifferentValues

function getObjectKeysWithDifferentValues(input1, input2) {
  if (
    input1 == null ||
    typeof input1 !== 'object' ||
    input2 == null ||
    typeof input2 !== 'object'
  ) {
    return []
  }

  const keys1 = Object.keys(input1)
  const diffKeys1 = keys1.filter(key => input1[key] !== input2[key])

  const keys2only = Object.keys(input2).filter(key => input1[key] == null)

  return [...diffKeys1, ...keys2only]
}
