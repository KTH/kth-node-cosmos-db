# Throughput simulation

The last simulations were run on Mon May 04 2020 10:46:19 GMT+0200 (Central European Summer Time).

In total, it took 27.7 seconds.

## Results

| #   | data size | records (kB)  | mode        | strategy | stepsize | increase    | after                     | items/s |
| --- | --------- | ------------- | ----------- | -------- | -------- | ----------- | ------------------------- | ------- |
| 1   | medium    | 10,10         | update+find | good     | 200      | 400 -> 600  | 53 items, 530 kB, 4 s     | 13.3    |
| 2   | medium    | 10,10         | find+save   | good     | 200      | RU error    | 118 items, 1180 kB, 7.8 s | 15.1    |
| 3   | x-large   | 1000,1000     | update+find | good     | 200      | 400 -> 800  | 1 items, 1000 kB, 0.78 s  | 1.3     |
| 4   | x-large   | 1000,1000     | find+save   | good     | 200      | RU error    | 64 items, 64000 kB, 3.5 s | 18.3    |
| 5   | mixed     | 2,10,100,1000 | update+find | good     | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.34 s  | 3       |
| 6   | mixed     | 2,10,100,1000 | find+save   | good     | 200      | RU error    | 61 items, 16682 kB, 3.3 s | 18.5    |

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
