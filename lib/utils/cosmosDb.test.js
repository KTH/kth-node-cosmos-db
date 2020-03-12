/* eslint-disable no-use-before-define */

jest.fn('@azure/cosmos')
jest.fn('kth-node-log')

const Azure = require('@azure/cosmos')

const { testBasicFunctionExport } = require('../../testlib')

const {
  createDatabase,
  createCollection,
  getCollection,
  getCollectionOffer,
  increaseThroughput
} = require('./cosmosDb')

const Global = {
  cosmosClient: null,
  testData: {
    databaseId: 'testDatabase',
    collectionId: 'testCollection',
    initialThroughput: 700
  }
}

describe('Helper module "cosmosDb"', () => {
  beforeAll(prepareCosmosClient)

  runTestsAboutCreateDatabase()
  runTestsAboutCreateCollection()
  runTestsAboutGetCollection()
  runTestsAboutGetCollectionOffer()
  runTestsAboutIncreaseThroughput()
})

function prepareCosmosClient() {
  if (Global.cosmosClient == null) {
    Global.cosmosClient = new Azure.CosmosClient({})
  }
}

function runTestsAboutCreateDatabase() {
  describe('has createDatabase() that', () => {
    testBasicFunctionExport(createDatabase)

    it('- when called with valid arguments - resolves as expected', async () => {
      const asyncResult = createDatabase(Global.testData.databaseId, Global.cosmosClient)
      expect(asyncResult).toBeInstanceOf(Promise)

      const database = await asyncResult
      expect(database).toBeObject()
      expect(database.client).toBeInstanceOf(Azure.CosmosClient)
      expect(database.id).toBe(Global.testData.databaseId)
    })

    it('- when called with no arguments - REJECTS', async () => {
      const asyncResult = createDatabase()
      expect(asyncResult).toBeInstanceOf(Promise)

      await expect(asyncResult).rejects.toThrow('Cannot read property')
    })

    it.todo('- when called with invalid arguments - REJECTS')
  })
}

function runTestsAboutCreateCollection() {
  describe('has createCollection() that', () => {
    testBasicFunctionExport(createCollection)

    it('- when called with valid arguments - resolves as expected', async () => {
      const database = await createDatabase(Global.testData.databaseId, Global.cosmosClient)

      const asyncResult = createCollection(
        database,
        Global.testData.collectionId,
        Global.testData.initialThroughput
      )
      expect(asyncResult).toBeInstanceOf(Promise)

      const collection = await asyncResult
      expect(collection).toBeObject()
      expect(collection.database).toBe(database)
      expect(collection.id).toBe(Global.testData.collectionId)
    })

    it('- when called with no arguments - REJECTS', async () => {
      const asyncResult = createCollection()
      expect(asyncResult).toBeInstanceOf(Promise)

      await expect(asyncResult).rejects.toThrow('Cannot read property')
    })

    it.todo('- when called with invalid arguments - REJECTS')
  })
}

function runTestsAboutGetCollection() {
  describe('has getCollection() that', () => {
    testBasicFunctionExport(getCollection)

    it('- when called with valid arguments - resolves as expected', async () => {
      const { databaseId, collectionId, initialThroughput } = Global.testData
      const database = await createDatabase(databaseId, Global.cosmosClient)
      const collection = await createCollection(database, collectionId, initialThroughput)

      const asyncResult = getCollection(collectionId, Global.cosmosClient)
      expect(asyncResult).toBeInstanceOf(Promise)

      const result = await asyncResult
      expect(result).toBeObject()
      expect(result).toEqual(collection)
    })

    it('- when called with no arguments - REJECTS', async () => {
      const asyncResult = getCollection()
      expect(asyncResult).toBeInstanceOf(Promise)

      await expect(asyncResult).rejects.toThrow('Cannot read property')
    })

    it.todo('- when called with invalid arguments - REJECTS')
  })
}

function runTestsAboutGetCollectionOffer() {
  describe('has getCollectionOffer() that', () => {
    testBasicFunctionExport(getCollectionOffer)

    it('- when called with valid arguments - resolves as expected', async () => {
      const { databaseId, collectionId, initialThroughput } = Global.testData
      const database = await createDatabase(databaseId, Global.cosmosClient)
      const collection = await createCollection(database, collectionId, initialThroughput)

      const asyncResult = getCollectionOffer(collectionId, Global.cosmosClient)
      expect(asyncResult).toBeInstanceOf(Promise)

      const result = await asyncResult
      expect(result).toBeObject()
      expect(result.client).toBe(Global.cosmosClient)
      expect(result.offerResourceId).toBe(collection._rid)
    })

    it('- when called with no arguments - REJECTS', async () => {
      const asyncResult = getCollectionOffer()
      expect(asyncResult).toBeInstanceOf(Promise)

      await expect(asyncResult).rejects.toThrow('Cannot read property')
    })

    it.todo('- when called with invalid arguments - REJECTS')
  })
}

function runTestsAboutIncreaseThroughput() {
  describe('has increaseThroughput() that', () => {
    testBasicFunctionExport(increaseThroughput)

    it('- when called with valid arguments - resolves as expected', async () => {
      const { databaseId, collectionId, initialThroughput } = Global.testData
      const database = await createDatabase(databaseId, Global.cosmosClient)

      await createCollection(database, collectionId, initialThroughput)

      const asyncResult = increaseThroughput(
        collectionId,
        initialThroughput + 100,
        Global.cosmosClient
      )
      expect(asyncResult).toBeInstanceOf(Promise)

      const result = await asyncResult
      expect(result).toBeUndefined()
    })

    it('- when called with no arguments - REJECTS', async () => {
      const asyncResult = increaseThroughput()
      expect(asyncResult).toBeInstanceOf(Promise)

      await expect(asyncResult).rejects.toThrow('Cannot read property')
    })

    it.todo('- when called with invalid arguments - REJECTS')
  })
}
