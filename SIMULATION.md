# Throughput simulation

The last simulations were run on Mon May 04 2020 15:45:52 GMT+0200 (Central European Summer Time).

In total, it took 28.1 seconds.

## Results

| #   | data size | records (kB)  | mode        | strategy | stepsize | increase    | after                        | items/s |
| --- | --------- | ------------- | ----------- | -------- | -------- | ----------- | ---------------------------- | ------- |
| 1   | medium    | 10,10         | update+find | good     | 200      | 400 -> 600  | 37 items, 370 kB, 2.53 s     | 14.6    |
| 2   | medium    | 10,10         | find+save   | good     | 200      | RU error    | 65 items, 650 kB, 4.03 s     | 16.1    |
| 3   | x-large   | 1000,1000     | update+find | good     | 200      | 400 -> 800  | 1 items, 1000 kB, 0.78 s     | 1.3     |
| 4   | x-large   | 1000,1000     | find+save   | good     | 200      | RU error    | 123 items, 123000 kB, 7.54 s | 16.3    |
| 5   | mixed     | 2,10,100,1000 | update+find | good     | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.39 s     | 2.9     |
| 6   | mixed     | 2,10,100,1000 | find+save   | good     | 200      | RU error    | 95 items, 25688 kB, 5.62 s   | 16.9    |

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
