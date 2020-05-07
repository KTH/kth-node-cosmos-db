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
  transformResult: jest.fn(item => item),
  stopAction: jest.fn(),
}

describe('Callback wrapper utilities', () => {
  _initClient()
  runTestsAboutWrapCallbackWithRetryOnError()
})

function runTestsAboutWrapCallbackWithRetryOnError() {
  describe('have wrapCallbackWithRetryOnError() that', () => {
    runBasicTestsAboutWrapCallbackWithRetryOnError()
    runSynchronousTestsAboutWrapCallbackWithRetryOnError()
    runAsynchronousTestsAboutWrapCallbackWithRetryOnError()
  })
}

function runBasicTestsAboutWrapCallbackWithRetryOnError() {
  describe('basically', () => {
    const { client, errorHandler, transformResult, stopAction } = Global
    const runActionAsync = true

    it('is accessible', () => {
      expect(wrapCallbackWithRetryOnError).toBeFunction()
    })

    it('- when used w/o arguments - FAILS', () => {
      expect(wrapCallbackWithRetryOnError).toThrow('Missing arguments')
    })

    it('- when used with invalid arguments, e.g. a "number" - FAILS', () => {
      // @ts-ignore
      const runner = () => wrapCallbackWithRetryOnError(79)
      expect(runner).toThrow('Invalid arguments')
    })

    it('- when used w/o client - FAILS', () => {
      const input = { errorHandler, runActionAsync, transformResult, stopAction }
      // @ts-ignore
      const runner = () => wrapCallbackWithRetryOnError(input)
      expect(runner).toThrow('Missing client')
    })

    it('- when used w/o error-handler - FAILS', () => {
      const input = { client, runActionAsync, transformResult, stopAction }
      // @ts-ignore
      const runner = () => wrapCallbackWithRetryOnError(input)
      expect(runner).toThrow('Missing error-handler')
    })

    it('- when used w/o async-switch - succeeds', () => {
      const input = { client, errorHandler, transformResult, stopAction }
      // @ts-ignore
      wrapCallbackWithRetryOnError(input)
    })

    it('- when used w/o transform-callback - succeeds', () => {
      const input = { client, errorHandler, runActionAsync, stopAction }
      // @ts-ignore
      wrapCallbackWithRetryOnError(input)
    })

    it('- when used w/o stop-action - succeeds', () => {
      const input = { client, errorHandler, runActionAsync, transformResult }
      // @ts-ignore
      wrapCallbackWithRetryOnError(input)
    })

    it('- when used with minimal arguments - returns an async function', () => {
      const input = { client, errorHandler }
      const wrapper = wrapCallbackWithRetryOnError(input)
      expect(wrapper).toBeFunction()
      expect(wrapper.constructor.name).toBe('AsyncFunction')
    })

    it('- when used with all possible arguments - returns an async function', () => {
      const input = { client, errorHandler, runActionAsync, transformResult, stopAction }
      const wrapper = wrapCallbackWithRetryOnError(input)
      expect(wrapper).toBeFunction()
      expect(wrapper.constructor.name).toBe('AsyncFunction')
    })

    it('- when used with all possible arguments - does not invoke the given callbacks directly', () => {
      const input = { client, errorHandler, runActionAsync, transformResult, stopAction }
      wrapCallbackWithRetryOnError(input)
      expect(errorHandler).not.toHaveBeenCalled()
      expect(transformResult).not.toHaveBeenCalled()
      expect(stopAction).not.toHaveBeenCalled()
    })
  })
}

function runSynchronousTestsAboutWrapCallbackWithRetryOnError() {
  describe('returns a function which - when the callback is used synchronically', () => {
    const { client, callback, errorHandler, transformResult, stopAction } = Global

    const callbackError = new Error('test-error callback')
    const handlerError = new Error('test-error handler')

    it('and the callback returns - works as expected', async () => {
      _mockResults(callback, { return: 'test-result' })

      const wrapper = _getWrapper({
        runActionAsync: false,
        useTransformResult: false,
        useStopAction: true,
      })
      const result = await wrapper(callback)

      expect(callback.mock.calls).toEqual([[]])
      expect(errorHandler).not.toHaveBeenCalled()
      expect(stopAction).not.toHaveBeenCalled()
      expect(result).toBe('test-result')
    })

    it('and the callback returns + a transform-callback is given - works as expected', async () => {
      _mockResults(callback, { return: 'test-result' })
      _mockResults(transformResult, { implementation: item => `transformed ${item}` })

      const wrapper = _getWrapper({
        runActionAsync: false,
        useTransformResult: true,
        useStopAction: true,
      })
      const result = await wrapper(callback)

      expect(callback.mock.calls).toEqual([[]])
      expect(errorHandler).not.toHaveBeenCalled()
      expect(stopAction).not.toHaveBeenCalled()
      expect(result).toBe('transformed test-result')
    })

    it('and the callback throws + the error-handler signals "stop" - works as expected', async () => {
      _mockResults(callback, { throw: callbackError })
      _mockResults(errorHandler, { return: 'stop' })

      const wrapper = _getWrapper({
        runActionAsync: false,
        useTransformResult: false,
        useStopAction: false,
      })
      const result = await wrapper(callback)
      expect(result).toBeNull()

      expect(callback.mock.calls).toEqual([[]])
      expect(errorHandler.mock.calls).toEqual([[callbackError]])
    })

    it('and the callback throws + the error-handler signals "stop" + a stop-action is given - works as expected', async () => {
      _mockResults(callback, { throw: callbackError })
      _mockResults(errorHandler, { return: 'stop' })
      _mockResults(stopAction, { return: 'wrapper stopped w/o result' })

      const wrapper = _getWrapper({
        runActionAsync: false,
        useTransformResult: false,
        useStopAction: true,
      })
      const result = await wrapper(callback)
      expect(result).toBe('wrapper stopped w/o result')

      expect(callback.mock.calls).toEqual([[]])
      expect(errorHandler.mock.calls).toEqual([[callbackError]])
      expect(stopAction.mock.calls).toEqual([[]])
    })

    it('and the callback throws + the error-handler signals "retry" - works as expected', async () => {
      _mockResults(callback, { throw: callbackError }, { return: 'test-result' })
      _mockResults(errorHandler, { return: 'retry' })

      const wrapper = _getWrapper({
        runActionAsync: false,
        useTransformResult: false,
        useStopAction: true,
      })
      const result = await wrapper(callback)
      expect(result).toBe('test-result')

      expect(callback.mock.calls).toEqual([[], []])
      expect(errorHandler.mock.calls).toEqual([[callbackError]])
      expect(stopAction).not.toHaveBeenCalled()
    })

    it('and the callback throws + the error-handler signals nothing - works as expected', async () => {
      _mockResults(callback, { throw: callbackError })

      const wrapper = _getWrapper({
        runActionAsync: false,
        useTransformResult: false,
        useStopAction: true,
      })
      await expect(wrapper(callback)).rejects.toThrow(callbackError)
    })

    it('and the callback throws + the error-handler rejects - works as expected', async () => {
      _mockResults(callback, { throw: callbackError })
      _mockResults(errorHandler, { reject: handlerError })

      const wrapper = _getWrapper({
        runActionAsync: false,
        useTransformResult: false,
        useStopAction: true,
      })
      await expect(wrapper(callback)).rejects.toThrow(handlerError)
    })

    it('- manages more than one retry as expected', async () => {
      _mockResults(
        callback,
        { throw: callbackError },
        { throw: callbackError },
        { throw: callbackError },
        { return: 'test-result' }
      )
      _mockResults(errorHandler, { return: 'retry' }, { return: 'retry' }, { return: 'retry' })

      client.setOption('retryStrategy', 'good')
      const before = new Date().getTime()

      const wrapper = _getWrapper({
        runActionAsync: false,
        useTransformResult: false,
        useStopAction: true,
      })
      const result = await wrapper(callback)
      expect(result).toBe('test-result')

      const after = new Date().getTime()
      const duration = after - before
      expect(duration).toBeWithin(500, 800)

      expect(callback.mock.calls).toEqual([[], [], [], []])
      expect(errorHandler.mock.calls).toEqual([[callbackError], [callbackError], [callbackError]])
    })

    it('- takes less time with retry-strategy "fastest" instead of "good"', async () => {
      _mockResults(
        callback,
        { throw: callbackError },
        { throw: callbackError },
        { throw: callbackError },
        { return: 'test-result' }
      )
      _mockResults(errorHandler, { return: 'retry' }, { return: 'retry' }, { return: 'retry' })

      client.setOption('retryStrategy', 'fastest')
      const before = new Date().getTime()

      const wrapper = _getWrapper({
        runActionAsync: false,
        useTransformResult: false,
        useStopAction: true,
      })
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

function runAsynchronousTestsAboutWrapCallbackWithRetryOnError() {
  describe('returns a function which - when the callback is used asynchronically', () => {
    const { client, callback, errorHandler, transformResult, stopAction } = Global

    const callbackError = new Error('test-error callback')
    const handlerError = new Error('test-error handler')

    it('and the callback resolves - works as expected', async () => {
      _mockResults(callback, { resolve: 'test-result' })

      const wrapper = _getWrapper({
        runActionAsync: true,
        useTransformResult: false,
        useStopAction: true,
      })
      const result = await wrapper(callback)

      expect(callback.mock.calls).toEqual([[]])
      expect(errorHandler).not.toHaveBeenCalled()
      expect(stopAction).not.toHaveBeenCalled()
      expect(result).toBe('test-result')
    })

    it('and the callback resolves + a transform-callback is given - works as expected', async () => {
      _mockResults(callback, { resolve: 'test-result' })
      _mockResults(transformResult, { implementation: input => `transformed ${input}` })

      const wrapper = _getWrapper({
        runActionAsync: true,
        useTransformResult: true,
        useStopAction: true,
      })
      const result = await wrapper(callback)

      expect(callback.mock.calls).toEqual([[]])
      expect(errorHandler).not.toHaveBeenCalled()
      expect(stopAction).not.toHaveBeenCalled()
      expect(result).toBe('transformed test-result')
    })

    it('and the callback rejects + the error-handler signals "stop" - works as expected', async () => {
      _mockResults(callback, { reject: callbackError })
      _mockResults(errorHandler, { return: 'stop' })

      const wrapper = _getWrapper({
        runActionAsync: true,
        useTransformResult: false,
        useStopAction: false,
      })
      const result = await wrapper(callback)
      expect(result).toBeNull()

      expect(callback.mock.calls).toEqual([[]])
      expect(errorHandler.mock.calls).toEqual([[callbackError]])
    })

    it('and the callback rejects + the error-handler signals "stop" + a stop-action is given - works as expected', async () => {
      _mockResults(callback, { reject: callbackError })
      _mockResults(errorHandler, { return: 'stop' })
      _mockResults(stopAction, { return: 'wrapper stopped w/o result' })

      const wrapper = _getWrapper({
        runActionAsync: true,
        useTransformResult: false,
        useStopAction: true,
      })
      const result = await wrapper(callback)
      expect(result).toBe('wrapper stopped w/o result')

      expect(callback.mock.calls).toEqual([[]])
      expect(errorHandler.mock.calls).toEqual([[callbackError]])
      expect(stopAction.mock.calls).toEqual([[]])
    })

    it('and the callback rejects + the error-handler signals "retry" - works as expected', async () => {
      _mockResults(callback, { reject: callbackError }, { resolve: 'test-result' })
      _mockResults(errorHandler, { return: 'retry' })

      const wrapper = _getWrapper({
        runActionAsync: true,
        useTransformResult: false,
        useStopAction: true,
      })
      const result = await wrapper(callback)
      expect(result).toBe('test-result')

      expect(callback.mock.calls).toEqual([[], []])
      expect(errorHandler.mock.calls).toEqual([[callbackError]])
      expect(stopAction).not.toHaveBeenCalled()
    })

    it('and the callback rejects + the error-handler signals nothing - works as expected', async () => {
      _mockResults(callback, { reject: callbackError })

      const wrapper = _getWrapper({
        runActionAsync: true,
        useTransformResult: false,
        useStopAction: true,
      })

      await expect(wrapper(callback)).rejects.toThrow(callbackError)
    })

    it('and the callback rejects + the error-handler rejects - works as expected', async () => {
      _mockResults(callback, { reject: callbackError })
      _mockResults(errorHandler, { reject: handlerError })

      const wrapper = _getWrapper({
        runActionAsync: true,
        useTransformResult: false,
        useStopAction: true,
      })

      await expect(wrapper(callback)).rejects.toThrow(handlerError)
    })

    it('- manages more than one retry as expected', async () => {
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

      const wrapper = _getWrapper({
        runActionAsync: true,
        useTransformResult: false,
        useStopAction: true,
      })
      const result = await wrapper(callback)
      expect(result).toBe('test-result')

      const after = new Date().getTime()
      const duration = after - before
      expect(duration).toBeWithin(500, 800)

      expect(callback.mock.calls).toEqual([[], [], [], []])
      expect(errorHandler.mock.calls).toEqual([[callbackError], [callbackError], [callbackError]])
    })

    it('- takes less time with retry-strategy "fastest" instead of "good"', async () => {
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

      const wrapper = _getWrapper({
        runActionAsync: true,
        useTransformResult: false,
        useStopAction: true,
      })
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

function _getWrapper({ runActionAsync, useTransformResult, useStopAction }) {
  const { client, errorHandler, transformResult, stopAction } = Global

  const wrapper = wrapCallbackWithRetryOnError({
    client,
    errorHandler,
    runActionAsync,
    transformResult: useTransformResult ? transformResult : null,
    stopAction: useStopAction ? stopAction : null,
  })

  return wrapper
}

function _initClient() {
  const clientOptions = getTestOptions('valid')
  Global.client = createClient(clientOptions)
}

function _mockResults(mockup, ...results) {
  mockup.mockReset()
  results.forEach(item => {
    if (typeof item.implementation === 'function') {
      mockup.mockImplementationOnce(item.implementation)
      return
    }
    if (item.return !== undefined) {
      mockup.mockReturnValueOnce(item.return)
      return
    }
    if (item.throw !== undefined) {
      mockup.mockImplementationOnce(() => {
        throw item.throw
      })
      return
    }
    if (item.resolve !== undefined) {
      mockup.mockResolvedValueOnce(item.resolve)
      return
    }
    if (item.reject !== undefined) {
      mockup.mockRejectedValueOnce(item.reject)
      return
    }
    // eslint-disable-next-line no-console
    console.error('Invalid mockup result', { item })
    throw new Error('Invalid mockup result')
  })
}
