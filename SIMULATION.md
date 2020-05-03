# Throughput simulation

The last simulations were run on Sun May 03 2020 21:44:21 GMT+0200 (Central European Summer Time).

In total, it took 23.3 seconds.

## Results

| #   | data size | records (kB)  | mode        | strategy | stepsize | increase    | after                      | items/s |
| --- | --------- | ------------- | ----------- | -------- | -------- | ----------- | -------------------------- | ------- |
| 1   | medium    | 10,10         | update+find | good     | 200      | 400 -> 600  | 33 items, 330 kB, 2.14 s   | 15.4    |
| 2   | medium    | 10,10         | find+save   | good     | 200      | RU error    | 75 items, 750 kB, 4.2 s    | 17.9    |
| 3   | x-large   | 1000,1000     | update+find | good     | 200      | 400 -> 800  | 1 items, 1000 kB, 0.72 s   | 1.4     |
| 4   | x-large   | 1000,1000     | find+save   | good     | 200      | RU error    | 74 items, 74000 kB, 4.12 s | 18      |
| 5   | mixed     | 2,10,100,1000 | update+find | good     | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.33 s   | 3       |
| 6   | mixed     | 2,10,100,1000 | find+save   | good     | 200      | RU error    | 77 items, 21130 kB, 4.33 s | 17.8    |

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
