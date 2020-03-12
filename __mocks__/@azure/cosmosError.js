/* eslint-disable no-use-before-define */

// @ts-check

module.exports = {
  throwReducedMockupApiError
}

function throwReducedMockupApiError() {
  throw new Error(
    'You are using a Azure API mockup with very reduced functionality. ' +
      'You tried to access some API part which is not supported by the mockup. ' +
      'You might want to try fixing or extending the mockup accordingly...'
  )
}
