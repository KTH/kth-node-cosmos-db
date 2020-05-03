# Developing `kth-node-cosmos-db`

## Content

- [Ideas for improvement](#ideas-for-improvement)
- [Dependency graphs](#dependency-graphs)
- [Unit tests](#unit-tests)
  - [Mockup "@azure/cosmos"](#mockup-azurecosmos)
  - [Running agains real Cosmos DB database](#running-against-real-cosmos-db-database)
  - [UNIT_TEST_COSMOSDB_CONNECTION](#UNIT_TEST_COSMOSDB_CONNECTION)
  - [UNIT_TEST_COSMOSDB_DATABASE](#UNIT_TEST_COSMOSDB_DATABASE)
  - [Using Cosmos DB Emulator on Windows](#using-cosmos-db-emulator-on-windows)
- [Integration tests](#integration-tests)
  - [INTEGRATION_TEST_COSMOSDB_CONNECTION](#INTEGRATION_TEST_COSMOSDB_CONNECTION)
  - [INTEGRATION_TEST_COSMOSDB_DATABASE](#INTEGRATION_TEST_COSMOSDB_DATABASE)

## Ideas for improvement

Let's hope that the package already does a good job. There might be some improvements worth implementing in near future:

- Enable throughput management on database level!

- Give the Mongoose schemas directly to `createClient()` as part of option "collections" instead of waiting for the application to call `client.createMongooseModel()`.

## Dependency graphs

The package contains SVG-files with graphical representation of the source files' dependencies. You might want to update the images after you changed some code:

```sh
npm run dependency-graph:update
```

_It's generally a good idea to avoid dependency cycles - ensure that no file is marked red in the images._

## Unit tests

The package comes with a lot of unit tests.

- **coverage:**
  You can get a coverage report on standard output as well as in the directory "coverage". Use this command:
  ```sh
  npm run test:coverage
  ```
- **mockups:**
  The "\_\_mocks\_\_" directories contain mockup version of some source files (e.g. "utils/cosmosDb.js") and packages (e.g. "@azure/cosmos"). Those mockups will be used during some of the unit tests.

### Mockup "@azure/cosmos"

The project contains a more advanced mockup of package "@azure/cosmos". This way is should be easy to test the functionality which is based on Azure services without needing a Cosmos DB test connection.

The mockup can be found in the directory "\_\_mocks\_\_/@azure/cosmos".

_Please be aware that the mockup might be erroneous or missing some important functions._

Especially after changing the mockup, e.g. because of added unit tests, you should also run the tests with a real Cosmos DB connection.

### Running against real Cosmos DB database

The unit tests are prepared to be run with a real Cosmos DB connection instead of the mockup of "@azure/cosmos".

**Please note:** If you configured the unit tests to locally run against a real Cosmos DB connection, you should still ensure that the tests work with the mockups as well. One possibility to do so is to use this command:

```sh
npm run test:mockup
```

The Cosmos DB connection for the unit tests follows two environment variables which can be set, e.g. through a .env-file:

- UNIT_TEST_COSMOSDB_CONNECTION
- UNIT_TEST_COSMOSDB_DATABASE

### UNIT_TEST_COSMOSDB_CONNECTION

By default, the unit tests only use the internal mockup of "@azure/cosmos".

```sh
# Use internal mockup (default)
UNIT_TEST_COSMOSDB_CONNECTION=false
```

You can use this variable to give a full "Primary Connection String" to an Azure Cosmos DB instance which will than be used.

```sh
# Use remote Azure Cosmos DB instance (Beware of possible data loss!)
UNIT_TEST_COSMOSDB_CONNECTION="AccountEndpoint=...;AccountKey=..."
```

```sh
# Use Azure Cosmos DB Emulator (available for Windows)
UNIT_TEST_COSMOSDB_CONNECTION="AccountEndpoint=https://localhost:8081/;AccountKey=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw=="
```

### UNIT_TEST_COSMOSDB_DATABASE

If you don't configure this variable, the database name "testDatabase" is used with the real Cosmos DB connection during unit tests.

```sh
# Default database name
UNIT_TEST_COSMOSDB_DATABASE=testDatabase
```

You can give another valid database name which shall be used. This is especially useful together with a remote Azure Cosmos DB instance.

```sh
# Change database name used for tests (Beware of possible data loss!)
UNIT_TEST_COSMOSDB_DATABASE=kthNodeUnitTests
```

### Using Cosmos DB Emulator on Windows

If you are using Azure Cosmos DB Emulator on Windows for running the tests, ensure that you start it with the argument "/EnableMongoDbEndpoint=3.6".

## Integration tests

The package contains integration tests in the "test" directory. They run simulations of Mongoose operations, especially to check the mechanism to automatically increase throughput values.

**Please note:** The integration tests can't be run with the mockup-version of "@azure/cosmos". You need a real Cosmos DB connection.

The Cosmos DB connection for the integration tests is configured with two environment variables:

- INTEGRATION_TEST_COSMOSDB_CONNECTION
- INTEGRATION_TEST_COSMOSDB_DATABASE

### INTEGRATION_TEST_COSMOSDB_CONNECTION

This variable must contain a full "Primary Connection String" to an Azure Cosmos DB instance. This connection will be used for the integration tests.

```sh
# Use remote Azure Cosmos DB instance (Beware of possible data loss!)
INTEGRATION_TEST_COSMOSDB_CONNECTION="AccountEndpoint=...;AccountKey=..."
```

```sh
# Use Azure Cosmos DB Emulator (available for Windows)
INTEGRATION_TEST_COSMOSDB_CONNECTION="AccountEndpoint=https://localhost:8081/;AccountKey=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw=="
```

### INTEGRATION_TEST_COSMOSDB_DATABASE

By default, a database named "testDatabase" will be created in Cosmos DB. It will be used and possibly removed during tests. You can give another valid database name which shall be used using this variable:

```sh
# Change database name used for tests (Beware of possible data loss!)
INTEGRATION_TEST_COSMOSDB_DATABASE=kthNodeUnitTests
```

### Results

Some simulation-results are saved into files for later access:

- [SIMULATION.md](https://github.com/KTH/kth-node-cosmos-db/blob/master/SIMULATION.md) - Last basic throughput simulation
- [SIMULATION-full.md](https://github.com/KTH/kth-node-cosmos-db/blob/master/SIMULATION-full.md) - Last complete throughput simulation
