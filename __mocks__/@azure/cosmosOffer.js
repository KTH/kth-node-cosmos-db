/* eslint no-use-before-define: ["error", "nofunc"] */

/**
 * "Each Azure Cosmos DB collection is provisioned with an associated
 *  performance level represented as an Offer resource."
 * (https://docs.microsoft.com/en-us/rest/api/cosmos-db/offers)
 */

// @ts-check

const { v1: uuid } = require('uuid')
const assert = require('assert')

const { throwReducedMockupApiError } = require('./cosmosError')

module.exports = {
  mockOffer,
  findMockedOffer,
  mockOffers
}

const Global = { offersPerClient: {} }

function mockOffer({ client, containerResourceId, throughput }) {
  assert(client != null && typeof client === 'object')
  assert(typeof containerResourceId === 'string' && containerResourceId !== '')
  assert(typeof throughput === 'number' && throughput > 0)

  const clientId = client.__mock.id

  if (Global.offersPerClient[clientId] == null) {
    Global.offersPerClient[clientId] = {}
  }

  if (Global.offersPerClient[clientId][containerResourceId] == null) {
    const resourceId = uuid()

    const replace = offerDefinition => {
      assert(
        offerDefinition != null && typeof offerDefinition === 'object',
        'Mockup: Invalid offer definition'
      )
      const { content } = offerDefinition
      assert(content != null && typeof content === 'object', 'Mockup: Invalid offer definition')
      assert(
        content.offerThroughput == null || content.offerThroughput > 0,
        'Mockup: Invalid throughput in offer definition'
      )
      Global.offersPerClient[clientId][containerResourceId].content = { ...content }
    }

    const newOffer = {
      client,
      id: resourceId,

      offerVersion: 'V2',
      offerType: 'Invalid',
      _rid: resourceId,
      content: {
        offerThroughput: throughput
      },
      resource: '',
      offerResourceId: containerResourceId,
      _self: '',
      _etag: '',
      _ts: new Date().getTime(),
      replace,

      read: throwReducedMockupApiError,
      url: throwReducedMockupApiError
    }

    Global.offersPerClient[clientId][containerResourceId] = newOffer
  }

  return Global.offersPerClient[clientId][containerResourceId]
}

function findMockedOffer({ client, offerResourceId }) {
  assert(client != null && typeof client === 'object')
  assert(typeof offerResourceId === 'string' && offerResourceId !== '')

  const clientId = client.__mock.id

  if (Global.offersPerClient[clientId] == null) {
    throwReducedMockupApiError()
  }

  const offerList = Object.values(Global.offersPerClient[clientId])

  const offer = offerList.find(item => item.id === offerResourceId)

  if (offer == null) {
    throwReducedMockupApiError()
  }

  return offer
}

function mockOffers({ client }) {
  assert(client != null && typeof client === 'object')

  const clientId = client.__mock.id

  const readAll = () => {
    const listOfAllOffers = Object.values(Global.offersPerClient[clientId])
    const _feedResponse = { resources: listOfAllOffers }
    const _queryIterator = { fetchAll: () => Promise.resolve(_feedResponse) }
    return _queryIterator
  }

  const offers = {
    client,
    readAll,

    query: throwReducedMockupApiError
  }

  return offers
}
