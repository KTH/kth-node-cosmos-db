# Throughput simulation

The last simulations were run on Tue May 05 2020 22:27:47 GMT+0200 (Central European Summer Time).

In total, it took 43.2 seconds.

## Results

| #   | data size | records (kB)  | mode         | strategy | stepsize | increase    | after                       | items/s |
| --- | --------- | ------------- | ------------ | -------- | -------- | ----------- | --------------------------- | ------- |
| 1   | medium    | 10,10         | update+      | good     | 200      | 400 -> 600  | 39 items, 390 kB, 2.67 s    | 14.6    |
| 2   | medium    | 10,10         | azureUpdate+ | good     | 200      | 400 -> 600  | 18 items, 180 kB, 1.38 s    | 13      |
| 3   | medium    | 10,10         | failing save | good     | 200      | RU error    | 38 items, 380 kB, 2.21 s    | 17.2    |
| 4   | medium    | 10,10         | azureSave    | good     | 200      | 400 -> 600  | 86 items, 860 kB, 5.21 s    | 16.5    |
| 5   | medium    | 10,10         | azureWrap    | good     | 200      | 400 -> 600  | 104 items, 1040 kB, 6.45 s  | 16.1    |
| 6   | mixed     | 2,10,100,1000 | update+      | good     | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.37 s    | 2.9     |
| 7   | mixed     | 2,10,100,1000 | azureUpdate+ | good     | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.37 s    | 2.9     |
| 8   | mixed     | 2,10,100,1000 | failing save | good     | 200      | RU error    | 70 items, 18916 kB, 3.92 s  | 17.9    |
| 9   | mixed     | 2,10,100,1000 | azureSave    | good     | 200      | 400 -> 600  | 70 items, 18916 kB, 4.3 s   | 16.3    |
| 10  | mixed     | 2,10,100,1000 | azureWrap    | good     | 200      | 400 -> 600  | 110 items, 30036 kB, 6.87 s | 16      |

## Configuration

```json
{
  "mongoose": {
    "collectionName": "updatesimulations",
    "modelName": "UpdateSimulation",
    "modelDefinition": {},
    "documentTemplate": {
      "name": "Test, Integration",
      "updateStep": -1,
      "data": "abcdefg"
    },
    "shardKey": { "name": 1 }
  },
  "cosmos": {
    "fallbackDatabaseName": "integrationTests",
    "initialThroughput": 400,
    "maxThroughput": 20000,
    "collections": [
      {
        "name": "updatesimulations",
        "throughput": 400,
        "partitionKey": ["/name"]
      }
    ]
  }
}
```
