jest.mock('@azure/cosmos')

const optionsUtilsTest = require('./utils/optionsUtils.test')

const { createClient, getClient } = require('./cosmosClientWrapper')

test('When passing valid options, createClient({..}) returns a CosmosClientWrapper.', () => {
  process.env.NODE_ENV = 'production'
  const cosmosClientWrapper = createClient(optionsUtilsTest.MOCK_OPTIONS.valid)
  expect(cosmosClientWrapper).not.toBeUndefined()
})

test('Dont break when calling updateAllCollectionsThroughput in development', () => {
  process.env.NODE_ENV = 'development'

  const client = getClient()
  let error

  try {
    client.updateAllCollectionsThroughput()
  } catch (e) {
    error = e
  }

  expect(error).toBe(undefined)
})

describe('Functions', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'production'

    const config = {
      host: 'localhost',
      db: 'test',
      collections: [{ name: 'test', throughput: 1500 }, { name: 'test2' }],
      password: '123',
      username: 'test',
      maxThroughput: 1000
    }

    createClient(config)
  })

  test('After a client is created. You should be able to create databases and collections.', async () => {
    await getClient().init()
  })

  test.skip("You can increase a named collection's throughput, by a default increase.", async () => {
    const client = getClient()

    const throughput = await client.increaseCollectionThroughput('test')
    expect(throughput).toEqual(600)
  })

  test.skip('You can increase a named collections throughput, by a specific increase.', async () => {
    const client = getClient()

    const throughput = await client.updateCollectionThroughput('test', 800)
    expect(throughput).toEqual(800)
  })

  test.skip('You can get a named collections throughput.', async () => {
    const client = getClient()

    const offer = await client.getCollectionThroughput('test')
    expect(offer.content.offerThroughput).toEqual(400)
  })

  test.skip('You can increase all collections throughput, by a default increase.', async () => {
    const client = getClient()

    await client.updateAllCollectionsThroughput()
  })

  test.todo('updateAllCollectionsThroughput increases throughput')

  test.skip('listCollectionsWithThroughput', async () => {
    const client = getClient()

    const collections = await client.listCollectionsWithThroughput()
    expect(collections.length).toEqual(2)
    expect(collections[0]).to.eql({ collection: 'test', throughput: 400 })
    expect(collections[1]).to.eql({ collection: 'test2', throughput: 400 })
  })

  test.skip('resetThroughput', async () => {
    const client = getClient()

    await client.resetThroughput()
  })

  test.todo('resetThrought decreases throughput')
})
