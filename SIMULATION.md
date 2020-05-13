# Throughput simulation

The last simulations were run on Thu May 14 2020 01:31:33 GMT+0200 (Central European Summer Time).

In total, it took 15.3 seconds.

## Results

| #   | data size | records (kB)  | mode    | strategy | stepsize | increase    | after                     | items/s |
| --- | --------- | ------------- | ------- | -------- | -------- | ----------- | ------------------------- | ------- |
| 1   | medium    | 10,10         | update  | good     | 200      | 400 -> 1000 | 2 items, 20 kB, 1.29 s    | 1.6     |
| 2   | medium    | 10,10         | update+ | good     | 200      | 400 -> 1000 | 1 items, 10 kB, 1.18 s    | 0.8     |
| 3   | medium    | 10,10         | save    | good     | 200      | 400 -> 1800 | 2 items, 20 kB, 2.99 s    | 0.7     |
| 4   | medium    | 10,10         | save-0  | good     | 200      | 400 -> 600  | 4 items, 40 kB, 0.66 s    | 6.1     |
| 5   | mixed     | 2,10,100,1000 | update  | good     | 200      | 400 -> 1000 | 2 items, 12 kB, 1.28 s    | 1.6     |
| 6   | mixed     | 2,10,100,1000 | update+ | good     | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.46 s  | 2.7     |
| 7   | mixed     | 2,10,100,1000 | save    | good     | 200      | 400 -> 600  | 29 items, 7786 kB, 2.22 s | 13.1    |
| 8   | mixed     | 2,10,100,1000 | save-0  | good     | 200      | 400 -> 600  | 4 items, 1112 kB, 0.7 s   | 5.7     |

## Configuration

```json
{
  "mongoose": {
    "_templateModelName": "UpdateSimulation",
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
    "_collectionTemplate": {
      "name": "updatesimulations",
      "throughput": 400,
      "partitionKey": ["/name"]
    }
  }
}
```
