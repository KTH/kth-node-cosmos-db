# kth-node-cosmos-db

Node.js module for projects using Azure Cosmos Db.

## How it works

When an "Too many requests" error ocurs this module will increase the throughput of the specific collection with a set amount and then try the query again.

When the import is done the module will reset all collections throughput to their default value.

The "Too many requests" error will mainly ocur when importing data.

The module can also set the batchSize to avoid Cursor timeout errors.

## Client Params

```json
{
  "host": "String",
  "db": "String",
  "collections": "[String]",
  "defaultThroughput": "Number",
  "password": "String",
  "username": "String",
  "maxThroughput": "Number",
  "throughputStepsize": "Number",
  "batchSize": "Number"
}
```

| Name               | Description                                                                                                                                       | Required | Default |
| ------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------ | -------: | ------- |
| host               | The hostname of the database                                                                                                                      |     true | -       |
| db                 | The name of the database                                                                                                                          |     true | -       |
| password           | Auth credentials                                                                                                                                  |     true | -       |
| username           | Auth credentials                                                                                                                                  |     true | -       |
| collections        | A array of the names of the collections                                                                                                           |     true | -       |
| defaultThroughput  | The default throughput in RU/s which each collection will be created with. This is also the value each collection will return to after an import. |    false | 400     |
| maxThroughput      | The maximum amount of RU/s a collection is allowed to reach                                                                                       |     true | -       |
| throughputStepsize | The increase in RU/s when a write fails                                                                                                           |    false | 200     |
| batchSize          | BatchSize of querys (Decrease this in order to avoid cursor timeout)                                                                              |    false | 10000   |

## Client functions

| Name                                                   | Description                                                                      |
| ------------------------------------------------------ | :------------------------------------------------------------------------------- |
| increaseCollectionThroughput(collectionName)           | Increase the specific collections throughput with the value of defaultThroughput |
| updateCollectionThroughput(collectionName, throughput) | Update specific collection throughput to a value of choice                       |
| updateAllCollectionsThroughput(throughput)             | Update all collections throughput to a value of choice                           |
| listCollectionsWithThroughput()                        | List the name and throughput of each collection                                  |
| getCollectionThroughput(collectionName)                | Get throughput of specific collection                                            |

---

## Usage

### Init client

Create your client by adding the following code to your server.js file:

```javascript
const { initClient } = require('kth-node-cosmos-db')
const models = require('./models')

initClient({
  username: config.db.username,
  password: config.db.password,
  host: config.db.host,
  db: config.db.db,
  defaultThroughput: 400,
  maxThroughput: 2000,
  collections: Object.keys(models).map(key => {
    return models[key].collection.name
  })
})
```

The collections is simply an array with the names of the collections which will be created by mongoose.

In the code above one was able to import the mongoose models and iterate over each model to extract the collection name.

---

### Get Client

If one need to get the client instance to call a specific client function one will get it like this.

One can also use the await syntax instead of then.

```javascript
const { getClient } = require('kth-node-cosmos-db')

// With .then()
getClient().then(client => {
  //Use client functions
})

// With await (function needs to be async)
const client = await getClient()
```

---

### Wrap mongoose model

When defining a mongoose model dont forget to wrap the model before exporting it.

This allows the db to use retry functionality when Error 'Too many requests'.

```javascript
const mongoose = require('mongoose')
const { wrap } = require('kth-node-cosmos-db')

const schema = mongoose.Schema({
  name: String,
  value: Number
})

const Model = mongoose.model('Model', schema)

module.exports = {
  Model: wrap(Model),
  schema: schema
}
```

---

## Todo

* Support more mongoose querys in the wrap function.

## Done

* Currently supporting find, findOne, findOneAndUpdate, update and save querys
