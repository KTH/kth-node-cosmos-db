# kth-node-cosmos-db ![Build](https://travis-ci.org/KTH/kth-node-cosmos-db.svg?branch=master 'Build')

Node.js module for projects using Azure Cosmos Db.

## How it works

When an "Too many requests" error ocurs this module will increase the throughput of the specific collection with a set amount and then try the query again.

When the import is done the module will reset all collections throughput to their default value.

The "Too many requests" error will mainly ocur when importing data.

The module can also set the batchSize to avoid Cursor timeout errors.

## Local development

By default this package wont be used when developing locally (using a local database). If one wish to use this package when developing locally one can add `USE_COSMOS_DB=true` in the .ENV file.

## Client Params

```json
{
  "host": "String",
  "db": "String",
  "collections": "[{
      name: String,
      throughput: Number (optional)
    }]",
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
| collections        | An Array of objects containing collection name and optional throughput                                                                            |     true | -       |
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
| resetThroughput()                                      | Reset throughput to default for each collection                                  |

---

## Usage

### Create client

Create your client by adding the following code to your server.js file:

```javascript
const { createClient } = require('@kth/kth-node-cosmos-db')
const models = require('./models')

createClient({
  username: config.db.username,
  password: config.db.password,
  host: config.db.host,
  db: config.db.db,
  defaultThroughput: 400,
  maxThroughput: 2000,
  collections: [{ name: 'users', throughput: 800 }, { name: 'emails' }],
  logger: console
}).init()
```

The collections option is an array of objects.
Each object must have the name attribute while the throughput attribute is optional.
The throughput attribute makes it possible to have different default throughputs for each collections.
If no throughput attribute is added it will default to the defaultThroughput option.

### Get Client

If one need to get the client instance to call a specific client function one will get it like this.

```javascript
const { getClient } = require('kth-node-cosmos-db')

const client = getClient()
```

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

## Todo

- Support more mongoose querys in the wrap function.

## Done

- Currently supporting find, findOne, findOneAndUpdate, update and save querys
