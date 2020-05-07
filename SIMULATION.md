# Throughput simulation

The last simulations were run on Thu May 07 2020 11:47:38 GMT+0200 (Central European Summer Time).

In total, it took 39.1 seconds.

## Results

| #   | data size | records (kB)  | mode         | strategy | stepsize | increase    | after                       | items/s |
| --- | --------- | ------------- | ------------ | -------- | -------- | ----------- | --------------------------- | ------- |
| 1   | medium    | 10,10         | update+      | good     | 200      | 400 -> 600  | 40 items, 400 kB, 2.77 s    | 14.4    |
| 2   | medium    | 10,10         | azureUpdate+ | good     | 200      | RU error    | 18 items, 180 kB, 1.13 s    | 15.9    |
| 3   | medium    | 10,10         | failing save | good     | 200      | RU error    | 15 items, 150 kB, 0.94 s    | 16      |
| 4   | medium    | 10,10         | azureSave    | good     | 200      | RU error    | 26 items, 260 kB, 1.67 s    | 15.6    |
| 5   | medium    | 10,10         | azureWrap    | good     | 200      | RU error    | 33 items, 330 kB, 2.12 s    | 15.6    |
| 6   | mixed     | 2,10,100,1000 | update+      | good     | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.45 s    | 2.8     |
| 7   | mixed     | 2,10,100,1000 | azureUpdate+ | good     | 200      | RU error    | 3 items, 112 kB, 0.25 s     | 12      |
| 8   | mixed     | 2,10,100,1000 | failing save | good     | 200      | RU error    | 78 items, 21140 kB, 4.57 s  | 17.1    |
| 9   | mixed     | 2,10,100,1000 | azureSave    | good     | 200      | RU error    | 105 items, 28914 kB, 6.46 s | 16.3    |
| 10  | mixed     | 2,10,100,1000 | azureWrap    | good     | 200      | RU error    | 146 items, 40044 kB, 9.28 s | 15.7    |

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
