/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

jest.mock('./cosmosDb')

const { createClient } = require('../client')

const { getTestOptions } = require('./CosmosClientWrapper.test-data')

const { wrapCallbackWithRetryOnError } = require('./wrapCallback')

const Global = {
  client: null,
  callback: jest.fn(),
  errorHandler: jest.fn(),
  stopAction: jest.fn(),
}

describe('Callback wrapper utilities', () => {
  _initClient()
  runTestsAboutWrapCallbackWithRetryOnError()
})

function runTestsAboutWrapCallbackWithRetryOnError() {
  runBasicTestsAboutWrapCallbackWithRetryOnError()
  runDetailedTestsAboutWrapCallbackWithRetryOnError()
}

function runBasicTestsAboutWrapCallbackWithRetryOnError() {
  describe('have wrapCallbackWithRetryOnError() that', () => {
    const { client, errorHandler } = Global

    it('is accessible', () => {
      expect(wrapCallbackWithRetryOnError).toBeFunction()
    })

    it('- when used w/o arguments - FAILS', () => {
      expect(wrapCallbackWithRetryOnError).toThrow('Cannot destructure property')
    })

    it('- when used with invalid arguments, e.g. a "number" - FAILS', () => {
      // @ts-ignore
      const runner = () => wrapCallbackWithRetryOnError(79)
      expect(runner).toThrow('Missing')
    })

    it('- when used w/o client - FAILS', () => {
      // @ts-ignore
      const runner = () => wrapCallbackWithRetryOnError({ errorHandler })
      expect(runner).toThrow('Missing client')
    })

    it('- when used w/o error-handler - FAILS', () => {
      // @ts-ignore
      const runner = () => wrapCallbackWithRetryOnError({ client })
      expect(runner).toThrow('Missing error-handler')
    })

    it('- when used with valid arguments - returns an async function', () => {
      const wrapper = wrapCallbackWithRetryOnError({ client, errorHandler })
      expect(wrapper).toBeFunction()
      expect(wrapper.constructor.name).toBe('AsyncFunction')
    })

    it('- when used with valid arguments - does not invoke the error-handler directly', () => {
      wrapCallbackWithRetryOnError({ client, errorHandler })
      expect(errorHandler).not.toHaveBeenCalled()
    })
  })
}

function runDetailedTestsAboutWrapCallbackWithRetryOnError() {
  describe('have wrapCallbackWithRetryOnError() that returns a function which', () => {
    const { client, callback, errorHandler, stopAction } = Global

    const wrapper = wrapCallbackWithRetryOnError({ client, errorHandler, stopAction })

    const callbackError = new Error('test-error callback')
    const handlerError = new Error('test-error handler')

    it('- when the callback resolves - works as expected', async () => {
      _mockResults(callback, { resolve: 'testResult' })

      const result = await wrapper(callback)

      expect(callback.mock.calls).toEqual([[]])
      expect(errorHandler).not.toHaveBeenCalled()
      expect(stopAction).not.toHaveBeenCalled()
      expect(result).toBe('testResult')
    })

    it('- when the callback rejects and the error-handler signals "stop" - works as expected', async () => {
      _mockResults(callback, { reject: callbackError })
      _mockResults(errorHandler, { return: 'stop' })
      _mockResults(stopAction, { return: 'wrapper stopped w/o result' })

      const result = await wrapper(callback)
      expect(result).toBe('wrapper stopped w/o result')

      expect(callback.mock.calls).toEqual([[]])
      expect(errorHandler.mock.calls).toEqual([[callbackError]])
      expect(stopAction.mock.calls).toEqual([[]])
    })

    it('- when the callback rejects and the error-handler signals "retry" - works as expected', async () => {
      _mockResults(callback, { reject: callbackError }, { resolve: 'test-result' })
      _mockResults(errorHandler, { return: 'retry' })

      const result = await wrapper(callback)
      expect(result).toBe('test-result')

      expect(callback.mock.calls).toEqual([[], []])
      expect(errorHandler.mock.calls).toEqual([[callbackError]])
      expect(stopAction).not.toHaveBeenCalled()
    })

    it('- when the callback rejects and the error-handler signals nothing - works as expected', async () => {
      _mockResults(callback, { reject: callbackError })

      await expect(wrapper(callback)).rejects.toThrow(callbackError)
    })

    it('- when the callback rejects and the error-handler rejects - works as expected', async () => {
      _mockResults(callback, { reject: callbackError })
      _mockResults(errorHandler, { reject: handlerError })

      await expect(wrapper(callback)).rejects.toThrow(handlerError)
    })

    it('manages more than one retry as expected', async () => {
      _mockResults(
        callback,
        { reject: callbackError },
        { reject: callbackError },
        { reject: callbackError },
        { resolve: 'test-result' }
      )
      _mockResults(errorHandler, { return: 'retry' }, { return: 'retry' }, { return: 'retry' })

      client.setOption('retryStrategy', 'good')
      const before = new Date().getTime()

      const result = await wrapper(callback)
      expect(result).toBe('test-result')

      const after = new Date().getTime()
      const duration = after - before
      expect(duration).toBeWithin(500, 800)

      expect(callback.mock.calls).toEqual([[], [], [], []])
      expect(errorHandler.mock.calls).toEqual([[callbackError], [callbackError], [callbackError]])
    })

    it('takes less time with retry-strategy "fastest" instead of "good"', async () => {
      _mockResults(
        callback,
        { reject: callbackError },
        { reject: callbackError },
        { reject: callbackError },
        { resolve: 'test-result' }
      )
      _mockResults(errorHandler, { return: 'retry' }, { return: 'retry' }, { return: 'retry' })

      client.setOption('retryStrategy', 'fastest')
      const before = new Date().getTime()

      const result = await wrapper(callback)
      expect(result).toBe('test-result')

      const after = new Date().getTime()
      const duration = after - before
      expect(duration).toBeWithin(100, 300)

      expect(callback.mock.calls).toEqual([[], [], [], []])
      expect(errorHandler.mock.calls).toEqual([[callbackError], [callbackError], [callbackError]])
    })
  })
}

function _initClient() {
  const clientOptions = getTestOptions('valid')
  Global.client = createClient(clientOptions)
}

function _mockResults(mockup, ...results) {
  mockup.mockReset()
  results.forEach(item => {
    if (item.return !== undefined) {
      mockup.mockReturnValueOnce(item.return)
    } else if (item.throw !== undefined) {
      mockup.mockImplementationOnce(() => {
        throw item.throw
      })
    } else if (item.resolve !== undefined) {
      mockup.mockResolvedValueOnce(item.resolve)
    } else if (item.reject !== undefined) {
      mockup.mockRejectedValueOnce(item.reject)
    } else {
      // eslint-disable-next-line no-console
      console.error('Invalid mockup result', { item })
      throw new Error('Invalid mockup result')
    }
  })
}
