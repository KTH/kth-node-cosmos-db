# Unit tests in `kth-node-cosmos-db`

## Running tests against real CosmosDB?!

The project contains a mockup of package "@azure/cosmosdb" as an easy way to unit test the functionality which is based on Azure connections.

The mockup can be found in the directory "\_\_mocks\_\_/azure". Please be aware that it might be erroneous or missing some important functions.

Especially after changing the mockup, e.g. because of added unit tests, you should also run the tests with a real Azure CosmosDB connection.

### Preparation

If you are using Azure CosmosDB Emulator on Windows for running the tests, ensure that you start it in argument "/EnableMongoDbEndpoint=3.6".

### Configuration

The unit tests follow some environment variables which can be set, e.g. through a .env-file:

1. Variable **UNIT_TEST_COSMOSDB_CONNECTION**

   - (Default) Set to false so that the internal mockup of "@azure/cosmosdb" will be used; or
     ```sh
     # Use internal mockup
     UNIT_TEST_COSMOSDB_CONNECTION=false
     ```
   - Give a full "Primary Connection String" to an Azure CosmosDB instance which can be used for the unit tests.
     ```sh
     # Use Azure Cosmos DB Emulator (available for Windows)
     UNIT_TEST_COSMOSDB_CONNECTION="AccountEndpoint=https://localhost:8081/;AccountKey=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw=="
     ```
     ```sh
     # Use remote Azure Cosmos DB instance (Beware of possible data loss!)
     UNIT_TEST_COSMOSDB_CONNECTION="AccountEndpoint=...;AccountKey=..."
     ```

1. Variable **UNIT_TEST_COSMOSDB_DATABASE**

   - (Default) Set to 'testDatabase' as the name of the CosmosDB database which will be created, used and possibly removed during tests; or
   - Give another valid database name which shall be used, e.g. together with a remote Azure CosmosDB instance.
     ```sh
     # Change database name used for tests (Beware of possible data loss!)
     UNIT_TEST_COSMOSDB_DATABASE=kthNodeUnitTests
     ```
