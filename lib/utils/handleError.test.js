/* eslint-env mocha */

'use strict'

const handleError = require('./handleError')

test('Handle all types of Request rate is too large errors', () => {
  process.env.NODE_ENV = 'development'
  process.env.USE_COSMOS_DB = true

  let count = 0

  const client = {
    increaseCollectionThroughput: () => {
      count++
    }
  }

  const model = {
    collection: {
      collectionName: 'test'
    }
  }

  handleError(new Error('Request rate is large'), client, model, () => {
    handleError(new Error('Message: { Errors: ["Request rate is large"] }'), client, model, () => {
      handleError(new Error('Message'), client, model).catch(e => {
        expect(count).toEqual(2)
        expect(e.message).toEqual('Message')
      })
    })
  })
  delete process.env.USE_COSMOS_DB
})
