# Throughput simulation

The last simulations were run on Mon May 11 2020 12:38:07 GMT+0200 (Central European Summer Time).

In total, it took 138.9 seconds.

## Results

| #   | data size | records (kB)  | mode    | strategy         | stepsize | increase    | after                      | items/s |
| --- | --------- | ------------- | ------- | ---------------- | -------- | ----------- | -------------------------- | ------- |
| 1   | small     | 2,2           | update  | fastest          | 200      | 400 -> 600  | 63 items, 126 kB, 2.34 s   | 26.9    |
| 2   | small     | 2,2           | update  | fast             | 200      | 400 -> 600  | 22 items, 44 kB, 1 s       | 22      |
| 3   | small     | 2,2           | update  | good             | 200      | 400 -> 600  | 21 items, 42 kB, 0.92 s    | 22.8    |
| 4   | small     | 2,2           | update  | cheapest         | 200      | 400 -> 600  | 22 items, 44 kB, 0.97 s    | 22.7    |
| 5   | small     | 2,2           | update  | fourAttemptsOnly | 200      | 400 -> 600  | 22 items, 44 kB, 0.95 s    | 23.2    |
| 6   | small     | 2,2           | update+ | fastest          | 200      | 400 -> 600  | 12 items, 24 kB, 0.67 s    | 17.9    |
| 7   | small     | 2,2           | update+ | fast             | 200      | 400 -> 600  | 11 items, 22 kB, 0.68 s    | 16.2    |
| 8   | small     | 2,2           | update+ | good             | 200      | 400 -> 600  | 12 items, 24 kB, 0.7 s     | 17.1    |
| 9   | small     | 2,2           | update+ | cheapest         | 200      | 400 -> 600  | 12 items, 24 kB, 0.69 s    | 17.4    |
| 10  | small     | 2,2           | update+ | fourAttemptsOnly | 200      | 400 -> 600  | 13 items, 26 kB, 0.77 s    | 16.9    |
| 11  | small     | 2,2           | save    | fastest          | 200      | 400 -> 600  | 13 items, 26 kB, 0.7 s     | 18.6    |
| 12  | small     | 2,2           | save    | fast             | 200      | 400 -> 600  | 10 items, 20 kB, 0.62 s    | 16.1    |
| 13  | small     | 2,2           | save    | good             | 200      | 400 -> 600  | 12 items, 24 kB, 0.71 s    | 16.9    |
| 14  | small     | 2,2           | save    | cheapest         | 200      | 400 -> 600  | 13 items, 26 kB, 0.75 s    | 17.3    |
| 15  | small     | 2,2           | save    | fourAttemptsOnly | 200      | 400 -> 600  | 12 items, 24 kB, 0.73 s    | 16.4    |
| 16  | medium    | 10,10         | update  | fastest          | 200      | 400 -> 600  | 12 items, 120 kB, 0.55 s   | 21.8    |
| 17  | medium    | 10,10         | update  | fast             | 200      | 400 -> 600  | 10 items, 100 kB, 0.55 s   | 18.2    |
| 18  | medium    | 10,10         | update  | good             | 200      | 400 -> 600  | 12 items, 120 kB, 0.61 s   | 19.7    |
| 19  | medium    | 10,10         | update  | cheapest         | 200      | 400 -> 600  | 12 items, 120 kB, 0.58 s   | 20.7    |
| 20  | medium    | 10,10         | update  | fourAttemptsOnly | 200      | 400 -> 600  | 11 items, 110 kB, 0.59 s   | 18.6    |
| 21  | medium    | 10,10         | update+ | fastest          | 200      | 400 -> 600  | 8 items, 80 kB, 0.54 s     | 14.8    |
| 22  | medium    | 10,10         | update+ | fast             | 200      | 400 -> 600  | 8 items, 80 kB, 0.58 s     | 13.8    |
| 23  | medium    | 10,10         | update+ | good             | 200      | 400 -> 600  | 8 items, 80 kB, 0.58 s     | 13.8    |
| 24  | medium    | 10,10         | update+ | cheapest         | 200      | 400 -> 600  | 9 items, 90 kB, 0.58 s     | 15.5    |
| 25  | medium    | 10,10         | update+ | fourAttemptsOnly | 200      | 400 -> 600  | 9 items, 90 kB, 0.61 s     | 14.8    |
| 26  | medium    | 10,10         | save    | fastest          | 200      | 400 -> 600  | 11 items, 110 kB, 0.59 s   | 18.6    |
| 27  | medium    | 10,10         | save    | fast             | 200      | 400 -> 600  | 10 items, 100 kB, 0.64 s   | 15.6    |
| 28  | medium    | 10,10         | save    | good             | 200      | 400 -> 600  | 13 items, 130 kB, 0.77 s   | 16.9    |
| 29  | medium    | 10,10         | save    | cheapest         | 200      | 400 -> 600  | 11 items, 110 kB, 0.66 s   | 16.7    |
| 30  | medium    | 10,10         | save    | fourAttemptsOnly | 200      | 400 -> 600  | 11 items, 110 kB, 0.66 s   | 16.7    |
| 31  | large     | 100,100       | update  | fastest          | 200      | 400 -> 800  | 4 items, 400 kB, 0.48 s    | 8.3     |
| 32  | large     | 100,100       | update  | fast             | 200      | 400 -> 600  | 3 items, 300 kB, 0.35 s    | 8.6     |
| 33  | large     | 100,100       | update  | good             | 200      | 400 -> 600  | 3 items, 300 kB, 0.36 s    | 8.3     |
| 34  | large     | 100,100       | update  | cheapest         | 200      | 400 -> 600  | 3 items, 300 kB, 0.37 s    | 8.1     |
| 35  | large     | 100,100       | update  | fourAttemptsOnly | 200      | 400 -> 600  | 3 items, 300 kB, 0.37 s    | 8.1     |
| 36  | large     | 100,100       | update+ | fastest          | 200      | 400 -> 800  | 3 items, 300 kB, 0.5 s     | 6       |
| 37  | large     | 100,100       | update+ | fast             | 200      | 400 -> 600  | 4 items, 400 kB, 0.65 s    | 6.2     |
| 38  | large     | 100,100       | update+ | good             | 200      | 400 -> 600  | 3 items, 300 kB, 0.4 s     | 7.5     |
| 39  | large     | 100,100       | update+ | cheapest         | 200      | 400 -> 600  | 3 items, 300 kB, 0.44 s    | 6.8     |
| 40  | large     | 100,100       | update+ | fourAttemptsOnly | 200      | 400 -> 600  | 3 items, 300 kB, 0.38 s    | 7.9     |
| 41  | large     | 100,100       | save    | fastest          | 200      | 400 -> 600  | 18 items, 1800 kB, 1.05 s  | 17.1    |
| 42  | large     | 100,100       | save    | fast             | 200      | 400 -> 600  | 16 items, 1600 kB, 0.91 s  | 17.6    |
| 43  | large     | 100,100       | save    | good             | 200      | 400 -> 600  | 18 items, 1800 kB, 0.97 s  | 18.6    |
| 44  | large     | 100,100       | save    | cheapest         | 200      | 400 -> 600  | 18 items, 1800 kB, 0.98 s  | 18.4    |
| 45  | large     | 100,100       | save    | fourAttemptsOnly | 200      | 400 -> 600  | 18 items, 1800 kB, 1 s     | 18      |
| 46  | x-large   | 1000,1000     | update  | fastest          | 200      | 400 -> 1200 | 2 items, 2000 kB, 0.87 s   | 2.3     |
| 47  | x-large   | 1000,1000     | update  | fast             | 200      | 400 -> 800  | 2 items, 2000 kB, 0.83 s   | 2.4     |
| 48  | x-large   | 1000,1000     | update  | good             | 200      | 400 -> 1000 | 2 items, 2000 kB, 1.25 s   | 1.6     |
| 49  | x-large   | 1000,1000     | update  | cheapest         | 200      | 400 -> 800  | 2 items, 2000 kB, 0.72 s   | 2.8     |
| 50  | x-large   | 1000,1000     | update  | fourAttemptsOnly | 200      | 400 -> 800  | 2 items, 2000 kB, 0.84 s   | 2.4     |
| 51  | x-large   | 1000,1000     | update+ | fastest          | 200      | 400 -> 1200 | 1 items, 1000 kB, 0.69 s   | 1.4     |
| 52  | x-large   | 1000,1000     | update+ | fast             | 200      | 400 -> 800  | 1 items, 1000 kB, 0.75 s   | 1.3     |
| 53  | x-large   | 1000,1000     | update+ | good             | 200      | 400 -> 800  | 1 items, 1000 kB, 0.63 s   | 1.6     |
| 54  | x-large   | 1000,1000     | update+ | cheapest         | 200      | 400 -> 800  | 1 items, 1000 kB, 0.62 s   | 1.6     |
| 55  | x-large   | 1000,1000     | update+ | fourAttemptsOnly | 200      | 400 -> 800  | 1 items, 1000 kB, 0.81 s   | 1.2     |
| 56  | x-large   | 1000,1000     | save    | fastest          | 200      | 400 -> 600  | 37 items, 37000 kB, 1.7 s  | 21.8    |
| 57  | x-large   | 1000,1000     | save    | fast             | 200      | 400 -> 600  | 34 items, 34000 kB, 1.6 s  | 21.3    |
| 58  | x-large   | 1000,1000     | save    | good             | 200      | 400 -> 600  | 37 items, 37000 kB, 1.76 s | 21      |
| 59  | x-large   | 1000,1000     | save    | cheapest         | 200      | 400 -> 600  | 37 items, 37000 kB, 1.76 s | 21      |
| 60  | x-large   | 1000,1000     | save    | fourAttemptsOnly | 200      | 400 -> 600  | 36 items, 36000 kB, 1.69 s | 21.3    |
| 61  | mixed     | 2,10,100,1000 | update  | fastest          | 200      | 400 -> 1400 | 5 items, 1114 kB, 1.09 s   | 4.6     |
| 62  | mixed     | 2,10,100,1000 | update  | fast             | 200      | 400 -> 1200 | 5 items, 1114 kB, 1.4 s    | 3.6     |
| 63  | mixed     | 2,10,100,1000 | update  | good             | 200      | 400 -> 1200 | 5 items, 1114 kB, 1.62 s   | 3.1     |
| 64  | mixed     | 2,10,100,1000 | update  | cheapest         | 200      | 400 -> 1000 | 5 items, 1114 kB, 1.83 s   | 2.7     |
| 65  | mixed     | 2,10,100,1000 | update  | fourAttemptsOnly | 200      | 400 -> 1000 | 5 items, 1114 kB, 1.7 s    | 2.9     |
| 66  | mixed     | 2,10,100,1000 | update+ | fastest          | 200      | 400 -> 1600 | 4 items, 1112 kB, 1.15 s   | 3.5     |
| 67  | mixed     | 2,10,100,1000 | update+ | fast             | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.1 s    | 3.6     |
| 68  | mixed     | 2,10,100,1000 | update+ | good             | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.18 s   | 3.4     |
| 69  | mixed     | 2,10,100,1000 | update+ | cheapest         | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.93 s   | 2.1     |
| 70  | mixed     | 2,10,100,1000 | update+ | fourAttemptsOnly | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.65 s   | 2.4     |
| 71  | mixed     | 2,10,100,1000 | save    | fastest          | 200      | 400 -> 600  | 38 items, 10020 kB, 1.79 s | 21.2    |
| 72  | mixed     | 2,10,100,1000 | save    | fast             | 200      | 400 -> 600  | 38 items, 10020 kB, 1.89 s | 20.1    |
| 73  | mixed     | 2,10,100,1000 | save    | good             | 200      | 400 -> 600  | 35 items, 9008 kB, 1.66 s  | 21.1    |
| 74  | mixed     | 2,10,100,1000 | save    | cheapest         | 200      | 400 -> 600  | 40 items, 11120 kB, 1.96 s | 20.4    |
| 75  | mixed     | 2,10,100,1000 | save    | fourAttemptsOnly | 200      | 400 -> 600  | 34 items, 8908 kB, 1.55 s  | 21.9    |

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
