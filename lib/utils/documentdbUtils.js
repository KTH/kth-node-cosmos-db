const log = require('kth-node-log')

function createDatabase(name, client) {
  return new Promise((resolve, reject) => {
    try {
      client.readDatabase(`dbs/${name}`, readErr => {
        if (readErr && readErr.code === 404) {
          client.createDatabase({ id: name }, createErr => {
            if (createErr) {
              return reject(createErr)
            }

            log.info(`kth-node-cosmos-db: Created database ${name}`)
            return resolve()
          })
        }

        log.info(`kth-node-cosmos-db: Db ${name} does allready exist...`)
        return resolve()
      })
    } catch (e) {
      log.error('kth-node-cosmos-db: Could not initialize database')
      reject(e)
    }
  })
}

function createCollection(db, client, collection, throughput) {
  const dbUrl = `dbs/${db}`
  const collectionUrl = `dbs/${db}/colls/${collection.name}`

  return new Promise((resolve, reject) => {
    client.readCollection(collectionUrl, readErr => {
      if (readErr && readErr.code === 404) {
        client.createCollection(
          dbUrl,
          { id: collection.name },
          { offerThroughput: throughput },
          createErr => {
            if (createErr) {
              return reject(createErr)
            }

            log.info(
              `kth-node-cosmos-db: Creating collection ${collection.name} with throughput: ${throughput}`
            )

            resolve()
          }
        )
      } else {
        resolve()
      }
    })
  })
}

function increaseThroughput(name, offer, client) {
  return new Promise((resolve, reject) => {
    client.replaceOffer(`offers/${offer.d}`, offer, (err, res) => {
      if (err) {
        log.error(`kth-node-cosmos-db: (${name}) Error while updating throughput...`)
        return reject(err)
      }

      if (res.content.offerThroughput !== offer.content.offerThroughput) {
        log.error(`kth-node-cosmos-db: (${name}) Throughput could not be updated`)
      } else {
        log.debug(
          `kth-node-cosmos-db: (${name}) Throughput updated to: `,
          offer.content.offerThroughput
        )
      }
      resolve()
    })
  })
}

function getCollection(db, name, client) {
  const url = `/dbs/${db}/colls/${name}`

  return new Promise((resolve, reject) => {
    client.readCollection(url, (err, result) => {
      if (err) {
        log.error('kth-node-cosmos-db: Error while fetching collection...')
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

function getThroughput(query, client) {
  return new Promise((resolve, reject) => {
    client.queryOffers(query).toArray((err, offers) => {
      if (err) {
        log.error('[COSMOS DB] Error while fetching current throughput...')
        reject(err)
      } else if (offers.length === 0) {
        log.info('[COSMOS DB] No offer found for collection')
      } else {
        resolve(offers[0])
      }
    })
  })
}

module.exports = {
  createDatabase,
  createCollection,
  increaseThroughput,
  getCollection,
  getThroughput
}
