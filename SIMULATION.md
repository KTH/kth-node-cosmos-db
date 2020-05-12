# Throughput simulation

The last simulations were run on Tue May 12 2020 12:27:56 GMT+0200 (Central European Summer Time).

In total, it took 78.2 seconds.

## Results

| #   | data size | records (kB)  | mode    | strategy | stepsize | increase   | after                        | items/s |
| --- | --------- | ------------- | ------- | -------- | -------- | ---------- | ---------------------------- | ------- |
| 1   | medium    | 10,10         | update  | good     | 200      | 400 -> 600 | 128 items, 1280 kB, 7.65 s   | 16.7    |
| 2   | medium    | 10,10         | update+ | good     | 200      | 400 -> 600 | 40 items, 400 kB, 2.99 s     | 13.4    |
| 3   | medium    | 10,10         | save    | good     | 200      | failed     | 213 items, 2130 kB, 14.41 s  | 14.8    |
| 4   | medium    | 10,10         | save-0  | good     | 200      | failed     | 235 items, 2350 kB, 14.46 s  | 16.3    |
| 5   | mixed     | 2,10,100,1000 | update  | good     | 200      | 400 -> 800 | 5 items, 1114 kB, 1.14 s     | 4.4     |
| 6   | mixed     | 2,10,100,1000 | update+ | good     | 200      | 400 -> 800 | 4 items, 1112 kB, 1.11 s     | 3.6     |
| 7   | mixed     | 2,10,100,1000 | save    | good     | 200      | failed     | 204 items, 56712 kB, 13.35 s | 15.3    |

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
