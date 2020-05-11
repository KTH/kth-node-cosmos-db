# Throughput simulation

The last simulations were run on Mon May 11 2020 12:44:12 GMT+0200 (Central European Summer Time).

In total, it took 22.6 seconds.

## Results

| #   | data size | records (kB)  | mode    | strategy | stepsize | increase    | after                       | items/s |
| --- | --------- | ------------- | ------- | -------- | -------- | ----------- | --------------------------- | ------- |
| 1   | medium    | 10,10         | update  | good     | 200      | 400 -> 600  | 35 items, 350 kB, 1.48 s    | 23.6    |
| 2   | medium    | 10,10         | update+ | good     | 200      | 400 -> 600  | 10 items, 100 kB, 0.65 s    | 15.4    |
| 3   | medium    | 10,10         | save    | good     | 200      | 400 -> 600  | 14 items, 140 kB, 0.8 s     | 17.5    |
| 4   | medium    | 10,10         | save-0  | good     | 200      | 400 -> 600  | 59 items, 590 kB, 2.62 s    | 22.5    |
| 5   | mixed     | 2,10,100,1000 | update  | good     | 200      | 400 -> 1000 | 5 items, 1114 kB, 1.24 s    | 4       |
| 6   | mixed     | 2,10,100,1000 | update+ | good     | 200      | 400 -> 1200 | 4 items, 1112 kB, 1.57 s    | 2.5     |
| 7   | mixed     | 2,10,100,1000 | save    | good     | 200      | 400 -> 600  | 38 items, 10020 kB, 1.82 s  | 20.9    |
| 8   | mixed     | 2,10,100,1000 | save-0  | good     | 200      | 400 -> 600  | 159 items, 43480 kB, 6.62 s | 24      |

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
