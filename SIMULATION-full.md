# Throughput simulation

The last simulations were run on Tue May 12 2020 20:03:25 GMT+0200 (Central European Summer Time).

In total, it took 141 seconds.

## Results

| #   | data size | records (kB)  | mode    | strategy         | stepsize | increase    | after                      | items/s |
| --- | --------- | ------------- | ------- | ---------------- | -------- | ----------- | -------------------------- | ------- |
| 1   | small     | 2,2           | update  | fastest          | 200      | 400 -> 600  | 70 items, 140 kB, 2.7 s    | 25.9    |
| 2   | small     | 2,2           | update  | fast             | 200      | 400 -> 600  | 27 items, 54 kB, 1.18 s    | 22.9    |
| 3   | small     | 2,2           | update  | good             | 200      | 400 -> 600  | 27 items, 54 kB, 1.16 s    | 23.3    |
| 4   | small     | 2,2           | update  | cheapest         | 200      | 400 -> 600  | 25 items, 50 kB, 1.09 s    | 22.9    |
| 5   | small     | 2,2           | update  | fourAttemptsOnly | 200      | 400 -> 600  | 22 items, 44 kB, 1 s       | 22      |
| 6   | small     | 2,2           | update+ | fastest          | 200      | 400 -> 600  | 14 items, 28 kB, 0.77 s    | 18.2    |
| 7   | small     | 2,2           | update+ | fast             | 200      | 400 -> 600  | 10 items, 20 kB, 0.62 s    | 16.1    |
| 8   | small     | 2,2           | update+ | good             | 200      | 400 -> 600  | 14 items, 28 kB, 0.84 s    | 16.7    |
| 9   | small     | 2,2           | update+ | cheapest         | 200      | 400 -> 600  | 14 items, 28 kB, 0.84 s    | 16.7    |
| 10  | small     | 2,2           | update+ | fourAttemptsOnly | 200      | 400 -> 600  | 16 items, 32 kB, 0.94 s    | 17      |
| 11  | small     | 2,2           | save    | fastest          | 200      | 400 -> 600  | 16 items, 32 kB, 0.87 s    | 18.4    |
| 12  | small     | 2,2           | save    | fast             | 200      | 400 -> 600  | 12 items, 24 kB, 0.76 s    | 15.8    |
| 13  | small     | 2,2           | save    | good             | 200      | 400 -> 600  | 15 items, 30 kB, 0.91 s    | 16.5    |
| 14  | small     | 2,2           | save    | cheapest         | 200      | 400 -> 600  | 17 items, 34 kB, 0.97 s    | 17.5    |
| 15  | small     | 2,2           | save    | fourAttemptsOnly | 200      | 400 -> 600  | 13 items, 26 kB, 0.82 s    | 15.9    |
| 16  | medium    | 10,10         | update  | fastest          | 200      | 400 -> 600  | 15 items, 150 kB, 0.75 s   | 20      |
| 17  | medium    | 10,10         | update  | fast             | 200      | 400 -> 600  | 11 items, 110 kB, 0.6 s    | 18.3    |
| 18  | medium    | 10,10         | update  | good             | 200      | 400 -> 600  | 14 items, 140 kB, 0.7 s    | 20      |
| 19  | medium    | 10,10         | update  | cheapest         | 200      | 400 -> 600  | 13 items, 130 kB, 0.7 s    | 18.6    |
| 20  | medium    | 10,10         | update  | fourAttemptsOnly | 200      | 400 -> 600  | 13 items, 130 kB, 0.68 s   | 19.1    |
| 21  | medium    | 10,10         | update+ | fastest          | 200      | 400 -> 600  | 10 items, 100 kB, 0.69 s   | 14.5    |
| 22  | medium    | 10,10         | update+ | fast             | 200      | 400 -> 600  | 11 items, 110 kB, 0.79 s   | 13.9    |
| 23  | medium    | 10,10         | update+ | good             | 200      | 400 -> 600  | 8 items, 80 kB, 0.54 s     | 14.8    |
| 24  | medium    | 10,10         | update+ | cheapest         | 200      | 400 -> 600  | 9 items, 90 kB, 0.63 s     | 14.3    |
| 25  | medium    | 10,10         | update+ | fourAttemptsOnly | 200      | 400 -> 600  | 12 items, 120 kB, 0.79 s   | 15.2    |
| 26  | medium    | 10,10         | save    | fastest          | 200      | 400 -> 600  | 13 items, 130 kB, 0.76 s   | 17.1    |
| 27  | medium    | 10,10         | save    | fast             | 200      | 400 -> 600  | 12 items, 120 kB, 0.74 s   | 16.2    |
| 28  | medium    | 10,10         | save    | good             | 200      | 400 -> 600  | 14 items, 140 kB, 0.84 s   | 16.7    |
| 29  | medium    | 10,10         | save    | cheapest         | 200      | 400 -> 600  | 16 items, 160 kB, 0.96 s   | 16.7    |
| 30  | medium    | 10,10         | save    | fourAttemptsOnly | 200      | 400 -> 600  | 14 items, 140 kB, 0.83 s   | 16.9    |
| 31  | large     | 100,100       | update  | fastest          | 200      | 400 -> 600  | 4 items, 400 kB, 0.36 s    | 11.1    |
| 32  | large     | 100,100       | update  | fast             | 200      | 400 -> 600  | 3 items, 300 kB, 0.35 s    | 8.6     |
| 33  | large     | 100,100       | update  | good             | 200      | 400 -> 800  | 4 items, 400 kB, 0.7 s     | 5.7     |
| 34  | large     | 100,100       | update  | cheapest         | 200      | 400 -> 600  | 4 items, 400 kB, 0.39 s    | 10.3    |
| 35  | large     | 100,100       | update  | fourAttemptsOnly | 200      | 400 -> 600  | 3 items, 300 kB, 0.38 s    | 7.9     |
| 36  | large     | 100,100       | update+ | fastest          | 200      | 400 -> 600  | 2 items, 200 kB, 0.31 s    | 6.5     |
| 37  | large     | 100,100       | update+ | fast             | 200      | 400 -> 600  | 2 items, 200 kB, 0.32 s    | 6.3     |
| 38  | large     | 100,100       | update+ | good             | 200      | 400 -> 600  | 3 items, 300 kB, 0.41 s    | 7.3     |
| 39  | large     | 100,100       | update+ | cheapest         | 200      | 400 -> 600  | 2 items, 200 kB, 0.34 s    | 5.9     |
| 40  | large     | 100,100       | update+ | fourAttemptsOnly | 200      | 400 -> 800  | 3 items, 300 kB, 0.72 s    | 4.2     |
| 41  | large     | 100,100       | save    | fastest          | 200      | 400 -> 600  | 24 items, 2400 kB, 1.25 s  | 19.2    |
| 42  | large     | 100,100       | save    | fast             | 200      | 400 -> 600  | 21 items, 2100 kB, 1.2 s   | 17.5    |
| 43  | large     | 100,100       | save    | good             | 200      | 400 -> 600  | 19 items, 1900 kB, 1.03 s  | 18.4    |
| 44  | large     | 100,100       | save    | cheapest         | 200      | 400 -> 600  | 19 items, 1900 kB, 1.03 s  | 18.4    |
| 45  | large     | 100,100       | save    | fourAttemptsOnly | 200      | 400 -> 600  | 18 items, 1800 kB, 1.01 s  | 17.8    |
| 46  | x-large   | 1000,1000     | update  | fastest          | 200      | 400 -> 1200 | 2 items, 2000 kB, 0.9 s    | 2.2     |
| 47  | x-large   | 1000,1000     | update  | fast             | 200      | 400 -> 800  | 2 items, 2000 kB, 0.74 s   | 2.7     |
| 48  | x-large   | 1000,1000     | update  | good             | 200      | 400 -> 800  | 2 items, 2000 kB, 0.75 s   | 2.7     |
| 49  | x-large   | 1000,1000     | update  | cheapest         | 200      | 400 -> 800  | 2 items, 2000 kB, 0.75 s   | 2.7     |
| 50  | x-large   | 1000,1000     | update  | fourAttemptsOnly | 200      | 400 -> 800  | 2 items, 2000 kB, 0.78 s   | 2.6     |
| 51  | x-large   | 1000,1000     | update+ | fastest          | 200      | 400 -> 1000 | 1 items, 1000 kB, 0.59 s   | 1.7     |
| 52  | x-large   | 1000,1000     | update+ | fast             | 200      | 400 -> 800  | 1 items, 1000 kB, 0.67 s   | 1.5     |
| 53  | x-large   | 1000,1000     | update+ | good             | 200      | 400 -> 800  | 1 items, 1000 kB, 0.64 s   | 1.6     |
| 54  | x-large   | 1000,1000     | update+ | cheapest         | 200      | 400 -> 800  | 1 items, 1000 kB, 0.64 s   | 1.6     |
| 55  | x-large   | 1000,1000     | update+ | fourAttemptsOnly | 200      | 400 -> 800  | 1 items, 1000 kB, 0.65 s   | 1.5     |
| 56  | x-large   | 1000,1000     | save    | fastest          | 200      | 400 -> 600  | 40 items, 40000 kB, 1.94 s | 20.6    |
| 57  | x-large   | 1000,1000     | save    | fast             | 200      | 400 -> 600  | 35 items, 35000 kB, 1.67 s | 21      |
| 58  | x-large   | 1000,1000     | save    | good             | 200      | 400 -> 600  | 39 items, 39000 kB, 1.97 s | 19.8    |
| 59  | x-large   | 1000,1000     | save    | cheapest         | 200      | 400 -> 600  | 40 items, 40000 kB, 1.98 s | 20.2    |
| 60  | x-large   | 1000,1000     | save    | fourAttemptsOnly | 200      | 400 -> 600  | 39 items, 39000 kB, 1.94 s | 20.1    |
| 61  | mixed     | 2,10,100,1000 | update  | fastest          | 200      | 400 -> 1600 | 5 items, 1114 kB, 1.17 s   | 4.3     |
| 62  | mixed     | 2,10,100,1000 | update  | fast             | 200      | 400 -> 1200 | 5 items, 1114 kB, 1.41 s   | 3.5     |
| 63  | mixed     | 2,10,100,1000 | update  | good             | 200      | 400 -> 1200 | 5 items, 1114 kB, 1.55 s   | 3.2     |
| 64  | mixed     | 2,10,100,1000 | update  | cheapest         | 200      | 400 -> 1000 | 5 items, 1114 kB, 1.89 s   | 2.6     |
| 65  | mixed     | 2,10,100,1000 | update  | fourAttemptsOnly | 200      | 400 -> 1000 | 5 items, 1114 kB, 1.74 s   | 2.9     |
| 66  | mixed     | 2,10,100,1000 | update+ | fastest          | 200      | 400 -> 1600 | 4 items, 1112 kB, 1.18 s   | 3.4     |
| 67  | mixed     | 2,10,100,1000 | update+ | fast             | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.1 s    | 3.6     |
| 68  | mixed     | 2,10,100,1000 | update+ | good             | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.18 s   | 3.4     |
| 69  | mixed     | 2,10,100,1000 | update+ | cheapest         | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.9 s    | 2.1     |
| 70  | mixed     | 2,10,100,1000 | update+ | fourAttemptsOnly | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.75 s   | 2.3     |
| 71  | mixed     | 2,10,100,1000 | save    | fastest          | 200      | 400 -> 600  | 38 items, 10020 kB, 1.8 s  | 21.1    |
| 72  | mixed     | 2,10,100,1000 | save    | fast             | 200      | 400 -> 600  | 33 items, 8898 kB, 1.56 s  | 21.2    |
| 73  | mixed     | 2,10,100,1000 | save    | good             | 200      | 400 -> 600  | 40 items, 11120 kB, 2 s    | 20      |
| 74  | mixed     | 2,10,100,1000 | save    | cheapest         | 200      | 400 -> 600  | 41 items, 11122 kB, 2.05 s | 20      |
| 75  | mixed     | 2,10,100,1000 | save    | fourAttemptsOnly | 200      | 400 -> 600  | 40 items, 11120 kB, 1.97 s | 20.3    |

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
