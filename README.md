# kth-node-cosmos-db ![Build](https://travis-ci.org/KTH/kth-node-cosmos-db.svg?branch=master 'Build')

Our Node.js applications at KTH (Stockholm) use Mongoose to access CosmosDB in Azure.
This module is a wrapper around "@azure/cosmosdb" designed for those applications.

## Intended use

Using this module instead of directly including "@azure/cosmosdb" into a project has the following benefits:

- Any Mongoose action will automatically manage Azure's provision throughput, too.
  _Especially when a "Too many requests" error occurs during a database action, the wrapper will increase the throughput of the related collection with a fixed amount and then retry the action. The "Too many requests" error will mainly occur when importing foreign data, e.g. into an API project. When an import is done, the application should reset all collections throughput to their default value using `resetThroughput()`._
- The module can also set a batchSize to avoid Cursor timeout errors during find-operations.

## Remarks on local development

By default, the wrapper won't be active during local development, e.g. when using a local database. The application still works but it will produce logging outputs like "Not available in native MongoDB".

Set the environment variable `USE_COSMOS_DB=true`, e.g. in the .env file, if you wish to use the full wrapper functionality locally.

## How it works

1. `createClient()` prepares the needed database and it's collections in Azure.
1. `wrap()` prepares any Mongoose model and adds the automatic throughput management.
1. `getClient()` gives access to some methods for manually controlling the throughput management, especially `resetThroughput()`.

### Client parameters

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

| Name               | Description                                                                                                                                           | Required | Default |
| ------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------- | -------: | ------- |
| host               | The hostname of the database                                                                                                                          |     true | -       |
| db                 | The name of the database                                                                                                                              |     true | -       |
| password           | Auth credentials                                                                                                                                      |     true | -       |
| username           | Auth credentials                                                                                                                                      |     true | -       |
| collections        | An Array of objects containing collection name and optional throughput                                                                                |     true | -       |
| defaultThroughput  | The default throughput in RU/s which each collection will be created with.<br/>This is also the value each collection will return to after an import. |    false | 400     |
| maxThroughput      | The maximum amount of RU/s a collection is allowed to reach                                                                                           |     true | -       |
| throughputStepsize | The increase in RU/s when a write fails                                                                                                               |    false | 200     |
| batchSize          | BatchSize of querys (Decrease this in order to avoid cursor timeout)                                                                                  |    false | 10000   |

### Client methods

| Name                                                   | Description                                                                      |
| ------------------------------------------------------ | :------------------------------------------------------------------------------- |
| increaseCollectionThroughput(collectionName)           | Increase the specific collections throughput with the value of defaultThroughput |
| updateCollectionThroughput(collectionName, throughput) | Update specific collection throughput to a value of choice                       |
| updateAllCollectionsThroughput(throughput)             | Update all collections throughput to a value of choice                           |
| listCollectionsWithThroughput()                        | List the name and throughput of each collection                                  |
| getCollectionThroughput(collectionName)                | Get throughput of specific collection                                            |
| resetThroughput()                                      | Reset throughput to default for each collection                                  |

## Usage

### `createClient()` - Prepare database and collections

Use `createClient()` and `await client.init()` on application startup, e.g. in file "server.js":

```js
// Example
const { createClient } = require('@kth/kth-node-cosmos-db')
const models = require('./models')

const cosmosDbOptions = {
  host: config.db.host,
  db: config.db.db,
  username: config.db.username,
  password: config.db.password,
  defaultThroughput: 400,
  maxThroughput: 2000,
  collections: [{ name: 'users', throughput: 800 }, { name: 'emails' }],
  logger: console
}

const client = createClient(cosmosDbOptions)
await client.init()
```

The option "collections" is an array of objects. Each object must have the "name" attribute while the "throughput" attribute is optional.

The throughput attribute makes it possible to have different default throughputs for each collections. If no throughput attribute is added it will default to the defaultThroughput option.

### `wrap()` - Wrap mongoose model

When defining a Mongoose model don't forget to wrap the model before using it. This allows "kth-node-cosmos-db" to automatically handle "Too many requests" errors from CosmosDB and retry your Mongoose action after increasing the throughput value.

`wrap()` changes the given model in place. The wrapped model can then be used like any other Mongoose model.

```javascript
// Example
const mongoose = require('mongoose')
const { wrap } = require('kth-node-cosmos-db')

const personSchema = mongoose.Schema({ name: String, age: Number })
const Person = mongoose.model('Person', personSchema)

wrap(Person)
```

**Please note:** `wrap()` internally uses the CosmosDB client to update throughput values if needed. Please ensure to initialize the module with `createClient()` and `await client.init()` before using the Model.

### `getClient()`

If you want to manually update throughput values, you can use `getClient()` to access the module's CosmosDB client.

```javascript
// Example
const { getClient } = require('kth-node-cosmos-db')

const client = getClient()
await client.resetThroughput()
```
