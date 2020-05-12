# Throughput simulation

The last simulations were run on Tue May 12 2020 20:02:21 GMT+0200 (Central European Summer Time).

In total, it took 33.8 seconds.

## Results

| #   | data size | records (kB)  | mode    | strategy | stepsize | increase    | after                        | items/s |
| --- | --------- | ------------- | ------- | -------- | -------- | ----------- | ---------------------------- | ------- |
| 1   | medium    | 10,10         | update  | good     | 200      | 400 -> 600  | 38 items, 380 kB, 1.65 s     | 23      |
| 2   | medium    | 10,10         | update+ | good     | 200      | 400 -> 600  | 10 items, 100 kB, 0.68 s     | 14.7    |
| 3   | medium    | 10,10         | save    | good     | 200      | 400 -> 600  | 16 items, 160 kB, 0.95 s     | 16.8    |
| 4   | medium    | 10,10         | save-0  | good     | 200      | 400 -> 600  | 151 items, 1510 kB, 6.87 s   | 22      |
| 5   | mixed     | 2,10,100,1000 | update  | good     | 200      | 400 -> 1000 | 5 items, 1114 kB, 1.29 s     | 3.9     |
| 6   | mixed     | 2,10,100,1000 | update+ | good     | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.27 s     | 3.1     |
| 7   | mixed     | 2,10,100,1000 | save    | good     | 200      | 400 -> 600  | 37 items, 10010 kB, 1.88 s   | 19.7    |
| 8   | mixed     | 2,10,100,1000 | save-0  | good     | 200      | 400 -> 600  | 257 items, 71170 kB, 11.15 s | 23      |

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
