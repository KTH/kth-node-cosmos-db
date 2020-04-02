# kth-node-cosmos-db ![Build](https://travis-ci.org/KTH/kth-node-cosmos-db.svg?branch=master 'Build')

Our Node.js applications at KTH in Stockholm use Mongoose to access CosmosDB in Azure.
This module is a wrapper around "@azure/cosmos" designed for those applications.

### Contents

- [Upgrading from version 3](#upgrading-from-version-3)
- [Intended use](#intended-use)
- [Remarks on local development](#remarks-on-local-development)
- [How It Works](#how-it-works)
- [Usage](#usage)
- [Client options](#client-options)
- [Client methods](#client-methods)
- [Further reading](#further-reading)

## Upgrading from version 3

The interface was changed with version 4 of this module. Previously there was a function `wrap()` which changed an already created Mongoose model in place. This function was replaced by `client.createMongooseModel()` which instead completely wraps `mongoose.model()`, now.

```js
// Old interface (until v3):
const User = mongoose.model('users', mongooseSchema)
wrap(User)

// New interface (since v4):
const User = client.createMongooseModel('users', mongooseSchema)
```

### Please note

- Ensure to use the Mongoose schema as second input to `client.createMongooseModel()`!
- Ensure that your application runs `createClient()` and `await client.init()`, before!

## Intended use

Using this module instead of directly including "@azure/cosmos" into a project has the following benefits:

- Any Mongoose action will automatically manage Azure's provision throughput, too.

  _Especially when a "Too many requests" error occurs during a database action, the wrapper will increase the throughput of the related collection with a fixed amount and then retry the action. The "Too many requests" error will mainly occur when importing foreign data, e.g. into an API project. When an import is done, the application should reset all collections throughput to their default value using `client.resetThroughput()`._

- The module can also set a batchSize to avoid Cursor Timeout errors during find-operations.

## Remarks on local development

By default, the wrapper won't be active during local development, e.g. when using a local database. Your application will still work but it will only produce logging outputs like "Not available in native MongoDB" when it comes to the functions of this module.

If you wish to use the full wrapper functionality also locally, set the environment variable `USE_COSMOS_DB`, e.g. in the .env file:

```sh
USE_COSMOS_DB=true
```

## How it works

1. `createClient()` and `await client.init()` prepare the needed database and it's collections in Cosmos DB.

1. `getClient()` helps you access the module's methods, later.

1. `client.createMongooseModel()` has to be used instead of `mongoose.model()` to prepare any Mongoose model and add the automatic throughput management to it.

1. `await client.resetThroughput()` is especially useful after data imports to avoid the throughput value to stay high for a longer time. _You might save money this way in Azure._

## Usage

### `createClient( options )`

**Prepare database and collections**

Use `createClient()` and `await client.init()` on application startup, e.g. in file "server.js":

```js
// Example
const { createClient } = require('@kth/kth-node-cosmos-db')
const config = require("./config/server")

...

const cosmosDbOptions = {
  host: config.db.host,
  db: config.db.db,
  username: config.db.username,
  password: config.db.password,
  defaultThroughput: 400,
  maxThroughput: 2000,
  collections: [{ name: 'users', throughput: 600 }, { name: 'emails' }],
  logger: console
}
const client = createClient(cosmosDbOptions)

await client.init()
```

The option "collections" is an array of objects. Each object must have the "name" attribute while the "throughput" attribute is optional.

The throughput attribute makes it possible to have different default throughputs for each collections. If no throughput attribute is added it will default to the global defaultThroughput option.

### `getClient()`

You can use `getClient()` whenever you need access to the module's methods, e.g. to manually update throughput values.

### `client.createMongooseModel( collectionName, mongooseSchema )`

**Prepare a Mongoose model**

When defining a Mongoose model don't use `mongoose.model()` - use `client.createMongooseModel()` instead. This allows "kth-node-cosmos-db" to automatically handle "Too many requests" errors from CosmosDB and retry your Mongoose operation after increasing the throughput value.

`client.createMongooseModel()` internally uses `mongoose.model()` and returns the model. The result can then be used like any other Mongoose model.

_Please ensure to initialize the module with `createClient()` and `await client.init()` before using `client.createMongooseModel()`._

```javascript
// Example
const { getClient } = require('kth-node-cosmos-db')
const mongoose = require('mongoose')

...

const userSchema = mongoose.Schema({ name: String, age: Number })

const client = getClient()
const User = client.createMongooseModel('users', userSchema)

...

const testUser = await User.findOne({ name: "Test" })
```

### `client.resetThroughput()`

When you setup the module and start using your Mongoose models, the CosmosDB throughput value will be increased whenever needed. In order to avoid unneccessarily high costs in Azure, the throughput values should be lowered, again. This must be done manually in your application, e.g. with `client.resetThroughput()` after a bigger data import.

_Please be sure to manually lower the throughput values on a regular basis._

```javascript
// Example
const { getClient } = require('kth-node-cosmos-db')

...

const client = getClient()
await client.resetThroughput()
```

## Client options

### Required

The following options must be given to `createClient()`:

|        Option | Content                                                             |     Type      | Mutable |
| ------------: | ------------------------------------------------------------------- | :-----------: | :-----: |
|          host | The hostname of the Cosmos DB server                                |    string     |    -    |
|      username | Auth credentials                                                    |    string     |    -    |
|      password | Auth credentials (Azure key)                                        |    string     |    -    |
|            db | The name of the database                                            |    string     |    -    |
|   collections | An Array of objects with information<br/>about the used collections | (see remarks) |    -    |
| maxThroughput | The maximum amount of RU/s<br/>a collection is allowed to reach     |    number     |   yes   |

### Optional

|                        Option | Content                                                                                          |  Type   | Default  | Mutable |
| ----------------------------: | ------------------------------------------------------------------------------------------------ | :-----: | :------: | :-----: |
|             defaultThroughput | The default throughput in RU/s<br/>which each collection will be<br/>created with.               | number  |  `400`   |   yes   |
|            throughputStepsize | The increase in RU/s<br/>when a write fails                                                      | number  |  `200`   |   yes   |
|                     batchSize | Batch size of find()-querys                                                                      | number  | `10000`  |   yes   |
|                          port | The SSL port used<br/>by the Cosmos DB server                                                    | number  |    -     |    -    |
|           disableSslRejection | Allow self signed certificates<br/>when accessing Cosmos DB server                               | boolean | `false`  |    -    |
| createCollectionsWithMongoose | Don't create unexisting<br/>containers during init()                                             | boolean | `false`  |    -    |
|                 retryStrategy | Name of predefined set<br/>of retry-timeouts which is used<br/>when handling throughput problems | string  | `"good"` |   yes   |

### Remarks

- You can change mutable options with `client.setOption()`.

- **collections:**

  - `[item, item, ...]`
    - The option "collections" must be given as an array of objects.
  - `item.name` **(required)**
    - Each item has to state the collection's name, e.g. `"users"`.
  - `item.throughput` (optional)
    - You can determine a distinct default throughput value for every collection, e.g. `500`.
  - `item.partitionKey` _(experimental feature)_
    - You can also set the partition-key which shall be used when the Cosmos DB container is created, e.g. `[ "/name" ]`. The partition-key can't be changed on already existing containers.
    - In order to make this feature work you might have to set the option "shardKey" accordingly when creating the related Mongoose schema with `mongoose.schema()`, e.g. `shardKey: { name: 1 }`.

- **batchSize:**

  - Try to decrease the option "batchSize" in case of "Cursor Timeout" errors.

- **disableSslRejection:**

  - This option might only be needed when running Cosmos DB emulator locally during integration tests.

- **createCollectionsWithMongoose:** _(experimental feature)_

  - If you get an error from Mongoose regarding misconfigured "shard keys" ("partition keys" in Cosmos DB), it might help to wait with the creation of your containers until you create your Mongoose models.

- **retryStrategy:**

  - You will find the available sets as a constant `KNOWN_RETRY_STRATEGIES` in the file "utils/strategy.js".

## Client methods

### Descriptions

|                             Name | Description                                                                        |
| -------------------------------: | :--------------------------------------------------------------------------------- |
|                           init() | Prepare database and containers in Cosmos DB                                       |
|            createMongooseModel() | Prepare one Mongoose model that will automatically increase throughput values, too |
|                      getOption() | Get the value of any option                                                        |
|                      setOption() | Change the value of a mutable option                                               |
|        getCollectionThroughput() | Get throughput of specific collection                                              |
|  listCollectionsWithThroughput() | List the name and throughput of each collection                                    |
|   increaseCollectionThroughput() | Increase the specific collections throughput with the value of defaultThroughput   |
|     updateCollectionThroughput() | Update specific collection throughput to a value of choice                         |
| updateAllCollectionsThroughput() | Update all collections throughput to a value of choice                             |
|                resetThroughput() | Reset throughput to default for each collection                                    |

### Interface

| Async |                         Method | Arguments                        |           Return value           |
| :---: | -----------------------------: | :------------------------------- | :------------------------------: |
| await |                           init | ( )                              |       client<br/>_(this)_        |
|   -   |            createMongooseModel | (collectionName, mongooseSchema) |            new model             |
|   -   |                      getOption | (key)                            |         value of option          |
|   -   |                      setOption | (key, value)                     |       client<br/>_(this)_        |
| await |        getCollectionThroughput | (collectionName)                 |    throughput<br/>_(number)_     |
| await |  listCollectionsWithThroughput | ( )                              |      list<br/>_(object[])_       |
| await |   increaseCollectionThroughput | (collectionName)                 |     increase<br/>_(number)_      |
| await |     updateCollectionThroughput | (collectionName, throughput)     |  new throughput<br/>_(number)_   |
| await | updateAllCollectionsThroughput | (throughput)                     | new throughputs<br/>_(number[])_ |
| await |                resetThroughput | ( )                              | new throughputs<br/>_(number[])_ |

### Remarks

- `client.init()` and `client.createMongooseModel()` are important steps during the setup of your application...

- Call `client.resetThroughput()` regularly, especially after a data import is done. This avoids too high throughput values and helps you save costs in Azure.

## Further reading

- [DEVELOPMENT.md](https://github.com/KTH/kth-node-cosmos-db/blob/master/DEVELOPMENT.md) contains information about testing and changing the module
