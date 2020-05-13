# Throughput simulation

The last simulations were run on Thu May 14 2020 01:05:26 GMT+0200 (Central European Summer Time).

In total, it took 458.9 seconds.

## Results

| #   | data size | records (kB)  | mode    | strategy         | stepsize | increase    | after                      | items/s |
| --- | --------- | ------------- | ------- | ---------------- | -------- | ----------- | -------------------------- | ------- |
| 1   | small     | 2,2           | update  | fastest          | 100      | 400 -> 900  | 2 items, 4 kB, 1.1 s       | 1.8     |
| 2   | small     | 2,2           | update  | fast             | 100      | 400 -> 500  | 49 items, 98 kB, 2.17 s    | 22.6    |
| 3   | small     | 2,2           | update  | good             | 100      | 400 -> 500  | 49 items, 98 kB, 2.14 s    | 22.9    |
| 4   | small     | 2,2           | update  | cheapest         | 100      | 400 -> 500  | 56 items, 112 kB, 2.56 s   | 21.9    |
| 5   | small     | 2,2           | update  | fourAttemptsOnly | 100      | 400 -> 500  | 51 items, 102 kB, 2.27 s   | 22.5    |
| 6   | small     | 2,2           | update+ | fastest          | 100      | 400 -> 500  | 27 items, 54 kB, 1.5 s     | 18      |
| 7   | small     | 2,2           | update+ | fast             | 100      | 400 -> 500  | 26 items, 52 kB, 1.45 s    | 17.9    |
| 8   | small     | 2,2           | update+ | good             | 100      | 400 -> 500  | 26 items, 52 kB, 1.43 s    | 18.2    |
| 9   | small     | 2,2           | update+ | cheapest         | 100      | 400 -> 500  | 27 items, 54 kB, 1.55 s    | 17.4    |
| 10  | small     | 2,2           | update+ | fourAttemptsOnly | 100      | 400 -> 500  | 26 items, 52 kB, 1.47 s    | 17.7    |
| 11  | small     | 2,2           | save    | fastest          | 100      | 400 -> 500  | 27 items, 54 kB, 1.47 s    | 18.4    |
| 12  | small     | 2,2           | save    | fast             | 100      | 400 -> 500  | 28 items, 56 kB, 1.6 s     | 17.5    |
| 13  | small     | 2,2           | save    | good             | 100      | 400 -> 500  | 27 items, 54 kB, 1.51 s    | 17.9    |
| 14  | small     | 2,2           | save    | cheapest         | 100      | 400 -> 500  | 28 items, 56 kB, 1.6 s     | 17.5    |
| 15  | small     | 2,2           | save    | fourAttemptsOnly | 100      | 400 -> 500  | 27 items, 54 kB, 1.52 s    | 17.8    |
| 16  | small     | 2,2           | save-0  | fastest          | 100      | 400 -> 500  | 134 items, 268 kB, 6.21 s  | 21.6    |
| 17  | small     | 2,2           | save-0  | fast             | 100      | 400 -> 500  | 142 items, 284 kB, 6.65 s  | 21.4    |
| 18  | small     | 2,2           | save-0  | good             | 100      | 400 -> 500  | 143 items, 286 kB, 6.72 s  | 21.3    |
| 19  | small     | 2,2           | save-0  | cheapest         | 100      | 400 -> 500  | 128 items, 256 kB, 5.91 s  | 21.7    |
| 20  | small     | 2,2           | save-0  | fourAttemptsOnly | 100      | 400 -> 500  | 134 items, 268 kB, 6.22 s  | 21.5    |
| 21  | small     | 2,2           | update  | fastest          | 200      | 400 -> 600  | 46 items, 92 kB, 1.9 s     | 24.2    |
| 22  | small     | 2,2           | update  | fast             | 200      | 400 -> 600  | 46 items, 92 kB, 1.94 s    | 23.7    |
| 23  | small     | 2,2           | update  | good             | 200      | 400 -> 600  | 45 items, 90 kB, 1.89 s    | 23.8    |
| 24  | small     | 2,2           | update  | cheapest         | 200      | 400 -> 600  | 44 items, 88 kB, 1.84 s    | 23.9    |
| 25  | small     | 2,2           | update  | fourAttemptsOnly | 200      | 400 -> 600  | 47 items, 94 kB, 2.03 s    | 23.2    |
| 26  | small     | 2,2           | update+ | fastest          | 200      | 400 -> 600  | 25 items, 50 kB, 1.3 s     | 19.2    |
| 27  | small     | 2,2           | update+ | fast             | 200      | 400 -> 600  | 26 items, 52 kB, 1.43 s    | 18.2    |
| 28  | small     | 2,2           | update+ | good             | 200      | 400 -> 600  | 26 items, 52 kB, 1.41 s    | 18.4    |
| 29  | small     | 2,2           | update+ | cheapest         | 200      | 400 -> 600  | 25 items, 50 kB, 1.36 s    | 18.4    |
| 30  | small     | 2,2           | update+ | fourAttemptsOnly | 200      | 400 -> 600  | 26 items, 52 kB, 1.41 s    | 18.4    |
| 31  | small     | 2,2           | save    | fastest          | 200      | 400 -> 600  | 27 items, 54 kB, 1.45 s    | 18.6    |
| 32  | small     | 2,2           | save    | fast             | 200      | 400 -> 600  | 27 items, 54 kB, 1.49 s    | 18.1    |
| 33  | small     | 2,2           | save    | good             | 200      | 400 -> 600  | 27 items, 54 kB, 1.51 s    | 17.9    |
| 34  | small     | 2,2           | save    | cheapest         | 200      | 400 -> 600  | 26 items, 52 kB, 1.43 s    | 18.2    |
| 35  | small     | 2,2           | save    | fourAttemptsOnly | 200      | 400 -> 600  | 27 items, 54 kB, 1.53 s    | 17.6    |
| 36  | small     | 2,2           | save-0  | fastest          | 200      | 400 -> 600  | 133 items, 266 kB, 6.14 s  | 21.7    |
| 37  | small     | 2,2           | save-0  | fast             | 200      | 400 -> 600  | 134 items, 268 kB, 6.24 s  | 21.5    |
| 38  | small     | 2,2           | save-0  | good             | 200      | 400 -> 600  | 136 items, 272 kB, 6.34 s  | 21.5    |
| 39  | small     | 2,2           | save-0  | cheapest         | 200      | 400 -> 600  | 131 items, 262 kB, 6.09 s  | 21.5    |
| 40  | small     | 2,2           | save-0  | fourAttemptsOnly | 200      | 400 -> 600  | 126 items, 252 kB, 5.82 s  | 21.6    |
| 41  | medium    | 10,10         | update  | fastest          | 100      | 400 -> 500  | 31 items, 310 kB, 1.43 s   | 21.7    |
| 42  | medium    | 10,10         | update  | fast             | 100      | 400 -> 500  | 30 items, 300 kB, 1.4 s    | 21.4    |
| 43  | medium    | 10,10         | update  | good             | 100      | 400 -> 500  | 30 items, 300 kB, 1.39 s   | 21.6    |
| 44  | medium    | 10,10         | update  | cheapest         | 100      | 400 -> 500  | 29 items, 290 kB, 1.33 s   | 21.8    |
| 45  | medium    | 10,10         | update  | fourAttemptsOnly | 100      | 400 -> 500  | 29 items, 290 kB, 1.35 s   | 21.5    |
| 46  | medium    | 10,10         | update+ | fastest          | 100      | 400 -> 500  | 19 items, 190 kB, 1.09 s   | 17.4    |
| 47  | medium    | 10,10         | update+ | fast             | 100      | 400 -> 500  | 18 items, 180 kB, 1.1 s    | 16.4    |
| 48  | medium    | 10,10         | update+ | good             | 100      | 400 -> 500  | 18 items, 180 kB, 1.08 s   | 16.7    |
| 49  | medium    | 10,10         | update+ | cheapest         | 100      | 400 -> 500  | 19 items, 190 kB, 1.14 s   | 16.7    |
| 50  | medium    | 10,10         | update+ | fourAttemptsOnly | 100      | 400 -> 500  | 18 items, 180 kB, 1.07 s   | 16.8    |
| 51  | medium    | 10,10         | save    | fastest          | 100      | 400 -> 500  | 19 items, 190 kB, 1.08 s   | 17.6    |
| 52  | medium    | 10,10         | save    | fast             | 100      | 400 -> 500  | 19 items, 190 kB, 1.13 s   | 16.8    |
| 53  | medium    | 10,10         | save    | good             | 100      | 400 -> 500  | 20 items, 200 kB, 1.24 s   | 16.1    |
| 54  | medium    | 10,10         | save    | cheapest         | 100      | 400 -> 500  | 20 items, 200 kB, 1.21 s   | 16.5    |
| 55  | medium    | 10,10         | save    | fourAttemptsOnly | 100      | 400 -> 500  | 20 items, 200 kB, 1.23 s   | 16.3    |
| 56  | medium    | 10,10         | save-0  | fastest          | 100      | 400 -> 500  | 105 items, 1050 kB, 4.95 s | 21.2    |
| 57  | medium    | 10,10         | save-0  | fast             | 100      | 400 -> 500  | 105 items, 1050 kB, 5 s    | 21      |
| 58  | medium    | 10,10         | save-0  | good             | 100      | 400 -> 500  | 97 items, 970 kB, 4.55 s   | 21.3    |
| 59  | medium    | 10,10         | save-0  | cheapest         | 100      | 400 -> 500  | 99 items, 990 kB, 4.66 s   | 21.2    |
| 60  | medium    | 10,10         | save-0  | fourAttemptsOnly | 100      | 400 -> 500  | 101 items, 1010 kB, 4.77 s | 21.2    |
| 61  | medium    | 10,10         | update  | fastest          | 200      | 400 -> 600  | 30 items, 300 kB, 1.39 s   | 21.6    |
| 62  | medium    | 10,10         | update  | fast             | 200      | 400 -> 600  | 29 items, 290 kB, 1.36 s   | 21.3    |
| 63  | medium    | 10,10         | update  | good             | 200      | 400 -> 600  | 30 items, 300 kB, 1.42 s   | 21.1    |
| 64  | medium    | 10,10         | update  | cheapest         | 200      | 400 -> 600  | 29 items, 290 kB, 1.35 s   | 21.5    |
| 65  | medium    | 10,10         | update  | fourAttemptsOnly | 200      | 400 -> 600  | 28 items, 280 kB, 1.26 s   | 22.2    |
| 66  | medium    | 10,10         | update+ | fastest          | 200      | 400 -> 600  | 18 items, 180 kB, 1.01 s   | 17.8    |
| 67  | medium    | 10,10         | update+ | fast             | 200      | 400 -> 600  | 19 items, 190 kB, 1.14 s   | 16.7    |
| 68  | medium    | 10,10         | update+ | good             | 200      | 400 -> 600  | 19 items, 190 kB, 1.13 s   | 16.8    |
| 69  | medium    | 10,10         | update+ | cheapest         | 200      | 400 -> 600  | 18 items, 180 kB, 1.08 s   | 16.7    |
| 70  | medium    | 10,10         | update+ | fourAttemptsOnly | 200      | 400 -> 600  | 19 items, 190 kB, 1.17 s   | 16.2    |
| 71  | medium    | 10,10         | save    | fastest          | 200      | 400 -> 600  | 20 items, 200 kB, 1.16 s   | 17.2    |
| 72  | medium    | 10,10         | save    | fast             | 200      | 400 -> 600  | 18 items, 180 kB, 1.07 s   | 16.8    |
| 73  | medium    | 10,10         | save    | good             | 200      | 400 -> 600  | 19 items, 190 kB, 1.12 s   | 17      |
| 74  | medium    | 10,10         | save    | cheapest         | 200      | 400 -> 600  | 20 items, 200 kB, 1.23 s   | 16.3    |
| 75  | medium    | 10,10         | save    | fourAttemptsOnly | 200      | 400 -> 600  | 18 items, 180 kB, 1.07 s   | 16.8    |
| 76  | medium    | 10,10         | save-0  | fastest          | 200      | 400 -> 600  | 101 items, 1010 kB, 4.73 s | 21.4    |
| 77  | medium    | 10,10         | save-0  | fast             | 200      | 400 -> 600  | 109 items, 1090 kB, 5.23 s | 20.8    |
| 78  | medium    | 10,10         | save-0  | good             | 200      | 400 -> 600  | 103 items, 1030 kB, 4.86 s | 21.2    |
| 79  | medium    | 10,10         | save-0  | cheapest         | 200      | 400 -> 600  | 99 items, 990 kB, 4.66 s   | 21.2    |
| 80  | medium    | 10,10         | save-0  | fourAttemptsOnly | 200      | 400 -> 600  | 103 items, 1030 kB, 4.88 s | 21.1    |
| 81  | large     | 100,100       | update  | fastest          | 100      | 400 -> 500  | 6 items, 600 kB, 0.5 s     | 12      |
| 82  | large     | 100,100       | update  | fast             | 100      | 400 -> 500  | 6 items, 600 kB, 0.53 s    | 11.3    |
| 83  | large     | 100,100       | update  | good             | 100      | 400 -> 500  | 6 items, 600 kB, 0.57 s    | 10.5    |
| 84  | large     | 100,100       | update  | cheapest         | 100      | 400 -> 500  | 6 items, 600 kB, 0.55 s    | 10.9    |
| 85  | large     | 100,100       | update  | fourAttemptsOnly | 100      | 400 -> 500  | 6 items, 600 kB, 0.53 s    | 11.3    |
| 86  | large     | 100,100       | update+ | fastest          | 100      | 400 -> 500  | 4 items, 400 kB, 0.41 s    | 9.8     |
| 87  | large     | 100,100       | update+ | fast             | 100      | 400 -> 500  | 4 items, 400 kB, 0.46 s    | 8.7     |
| 88  | large     | 100,100       | update+ | good             | 100      | 400 -> 500  | 4 items, 400 kB, 0.49 s    | 8.2     |
| 89  | large     | 100,100       | update+ | cheapest         | 100      | 400 -> 500  | 4 items, 400 kB, 0.47 s    | 8.5     |
| 90  | large     | 100,100       | update+ | fourAttemptsOnly | 100      | 400 -> 500  | 4 items, 400 kB, 0.45 s    | 8.9     |
| 91  | large     | 100,100       | save    | fastest          | 100      | 400 -> 600  | 5 items, 500 kB, 0.54 s    | 9.3     |
| 92  | large     | 100,100       | save    | fast             | 100      | 400 -> 600  | 5 items, 500 kB, 0.63 s    | 7.9     |
| 93  | large     | 100,100       | save    | good             | 100      | 400 -> 500  | 5 items, 500 kB, 0.46 s    | 10.9    |
| 94  | large     | 100,100       | save    | cheapest         | 100      | 400 -> 600  | 5 items, 500 kB, 0.64 s    | 7.8     |
| 95  | large     | 100,100       | save    | fourAttemptsOnly | 100      | 400 -> 600  | 5 items, 500 kB, 0.64 s    | 7.8     |
| 96  | large     | 100,100       | save-0  | fastest          | 100      | 400 -> 500  | 27 items, 2700 kB, 1.36 s  | 19.9    |
| 97  | large     | 100,100       | save-0  | fast             | 100      | 400 -> 500  | 31 items, 3100 kB, 1.74 s  | 17.8    |
| 98  | large     | 100,100       | save-0  | good             | 100      | 400 -> 500  | 30 items, 3000 kB, 1.65 s  | 18.2    |
| 99  | large     | 100,100       | save-0  | cheapest         | 100      | 400 -> 500  | 30 items, 3000 kB, 1.68 s  | 17.9    |
| 100 | large     | 100,100       | save-0  | fourAttemptsOnly | 100      | 400 -> 500  | 28 items, 2800 kB, 1.55 s  | 18.1    |
| 101 | large     | 100,100       | update  | fastest          | 200      | 400 -> 800  | 6 items, 600 kB, 0.63 s    | 9.5     |
| 102 | large     | 100,100       | update  | fast             | 200      | 400 -> 600  | 6 items, 600 kB, 0.53 s    | 11.3    |
| 103 | large     | 100,100       | update  | good             | 200      | 400 -> 600  | 6 items, 600 kB, 0.52 s    | 11.5    |
| 104 | large     | 100,100       | update  | cheapest         | 200      | 400 -> 600  | 6 items, 600 kB, 0.52 s    | 11.5    |
| 105 | large     | 100,100       | update  | fourAttemptsOnly | 200      | 400 -> 600  | 6 items, 600 kB, 0.51 s    | 11.8    |
| 106 | large     | 100,100       | update+ | fastest          | 200      | 400 -> 600  | 4 items, 400 kB, 0.42 s    | 9.5     |
| 107 | large     | 100,100       | update+ | fast             | 200      | 400 -> 600  | 4 items, 400 kB, 0.48 s    | 8.3     |
| 108 | large     | 100,100       | update+ | good             | 200      | 400 -> 600  | 4 items, 400 kB, 0.48 s    | 8.3     |
| 109 | large     | 100,100       | update+ | cheapest         | 200      | 400 -> 600  | 4 items, 400 kB, 0.48 s    | 8.3     |
| 110 | large     | 100,100       | update+ | fourAttemptsOnly | 200      | 400 -> 600  | 4 items, 400 kB, 0.48 s    | 8.3     |
| 111 | large     | 100,100       | save    | fastest          | 200      | 400 -> 600  | 5 items, 500 kB, 0.48 s    | 10.4    |
| 112 | large     | 100,100       | save    | fast             | 200      | 400 -> 600  | 5 items, 500 kB, 0.55 s    | 9.1     |
| 113 | large     | 100,100       | save    | good             | 200      | 400 -> 600  | 5 items, 500 kB, 0.56 s    | 8.9     |
| 114 | large     | 100,100       | save    | cheapest         | 200      | 400 -> 600  | 5 items, 500 kB, 0.54 s    | 9.3     |
| 115 | large     | 100,100       | save    | fourAttemptsOnly | 200      | 400 -> 600  | 5 items, 500 kB, 0.56 s    | 8.9     |
| 116 | large     | 100,100       | save-0  | fastest          | 200      | 400 -> 600  | 28 items, 2800 kB, 1.48 s  | 18.9    |
| 117 | large     | 100,100       | save-0  | fast             | 200      | 400 -> 600  | 30 items, 3000 kB, 1.68 s  | 17.9    |
| 118 | large     | 100,100       | save-0  | good             | 200      | 400 -> 600  | 29 items, 2900 kB, 1.59 s  | 18.2    |
| 119 | large     | 100,100       | save-0  | cheapest         | 200      | 400 -> 600  | 29 items, 2900 kB, 1.59 s  | 18.2    |
| 120 | large     | 100,100       | save-0  | fourAttemptsOnly | 200      | 400 -> 600  | 27 items, 2700 kB, 1.44 s  | 18.8    |
| 121 | x-large   | 1000,1000     | update  | fastest          | 100      | 400 -> 900  | 2 items, 2000 kB, 1.09 s   | 1.8     |
| 122 | x-large   | 1000,1000     | update  | fast             | 100      | 400 -> 800  | 2 items, 2000 kB, 1.47 s   | 1.4     |
| 123 | x-large   | 1000,1000     | update  | good             | 100      | 400 -> 700  | 2 items, 2000 kB, 1.29 s   | 1.6     |
| 124 | x-large   | 1000,1000     | update  | cheapest         | 100      | 400 -> 700  | 2 items, 2000 kB, 1.92 s   | 1       |
| 125 | x-large   | 1000,1000     | update  | fourAttemptsOnly | 100      | 400 -> 700  | 2 items, 2000 kB, 1.73 s   | 1.2     |
| 126 | x-large   | 1000,1000     | update+ | fastest          | 100      | 400 -> 1800 | 1 items, 1000 kB, 2.43 s   | 0.4     |
| 127 | x-large   | 1000,1000     | update+ | fast             | 100      | 400 -> 1200 | 1 items, 1000 kB, 2.59 s   | 0.4     |
| 128 | x-large   | 1000,1000     | update+ | good             | 100      | 400 -> 1000 | 1 items, 1000 kB, 2.39 s   | 0.4     |
| 129 | x-large   | 1000,1000     | update+ | cheapest         | 100      | 400 -> 800  | 1 items, 1000 kB, 2.97 s   | 0.3     |
| 130 | x-large   | 1000,1000     | update+ | fourAttemptsOnly | 100      | failed      | (during preparation)       |         |
| 131 | x-large   | 1000,1000     | save    | fastest          | 100      | 400 -> 2300 | 3 items, 3000 kB, 3.34 s   | 0.9     |
| 132 | x-large   | 1000,1000     | save    | fast             | 100      | 400 -> 1400 | 3 items, 3000 kB, 3.35 s   | 0.9     |
| 133 | x-large   | 1000,1000     | save    | good             | 100      | 400 -> 1200 | 3 items, 3000 kB, 3.31 s   | 0.9     |
| 134 | x-large   | 1000,1000     | save    | cheapest         | 100      | 400 -> 1000 | 3 items, 3000 kB, 3.67 s   | 0.8     |
| 135 | x-large   | 1000,1000     | save    | fourAttemptsOnly | 100      | failed      | 2 items, 2000 kB, 0.25 s   | 8       |
| 136 | x-large   | 1000,1000     | save-0  | fastest          | 100      | 400 -> 600  | 4 items, 4000 kB, 0.61 s   | 6.6     |
| 137 | x-large   | 1000,1000     | save-0  | fast             | 100      | 400 -> 500  | 4 items, 4000 kB, 0.5 s    | 8       |
| 138 | x-large   | 1000,1000     | save-0  | good             | 100      | 400 -> 500  | 4 items, 4000 kB, 0.5 s    | 8       |
| 139 | x-large   | 1000,1000     | save-0  | cheapest         | 100      | 400 -> 500  | 4 items, 4000 kB, 0.49 s   | 8.2     |
| 140 | x-large   | 1000,1000     | save-0  | fourAttemptsOnly | 100      | 400 -> 500  | 4 items, 4000 kB, 0.52 s   | 7.7     |
| 141 | x-large   | 1000,1000     | update  | fastest          | 200      | 400 -> 3200 | 2 items, 2000 kB, 2.49 s   | 0.8     |
| 142 | x-large   | 1000,1000     | update  | fast             | 200      | 400 -> 1800 | 2 items, 2000 kB, 2.36 s   | 0.8     |
| 143 | x-large   | 1000,1000     | update  | good             | 200      | 400 -> 1600 | 2 items, 2000 kB, 2.45 s   | 0.8     |
| 144 | x-large   | 1000,1000     | update  | cheapest         | 200      | 400 -> 1200 | 2 items, 2000 kB, 3.04 s   | 0.7     |
| 145 | x-large   | 1000,1000     | update  | fourAttemptsOnly | 200      | failed      | 1 items, 1000 kB, 0.18 s   | 5.6     |
| 146 | x-large   | 1000,1000     | update+ | fastest          | 200      | 400 -> 3200 | 1 items, 1000 kB, 2.43 s   | 0.4     |
| 147 | x-large   | 1000,1000     | update+ | fast             | 200      | 400 -> 2000 | 1 items, 1000 kB, 2.53 s   | 0.4     |
| 148 | x-large   | 1000,1000     | update+ | good             | 200      | 400 -> 1600 | 1 items, 1000 kB, 2.32 s   | 0.4     |
| 149 | x-large   | 1000,1000     | update+ | cheapest         | 200      | 400 -> 1200 | 1 items, 1000 kB, 2.91 s   | 0.3     |
| 150 | x-large   | 1000,1000     | update+ | fourAttemptsOnly | 200      | failed      | (during preparation)       |         |
| 151 | x-large   | 1000,1000     | save    | fastest          | 200      | 400 -> 4000 | 3 items, 3000 kB, 3.17 s   | 0.9     |
| 152 | x-large   | 1000,1000     | save    | fast             | 200      | 400 -> 2400 | 3 items, 3000 kB, 3.28 s   | 0.9     |
| 153 | x-large   | 1000,1000     | save    | good             | 200      | 400 -> 2000 | 3 items, 3000 kB, 3.36 s   | 0.9     |
| 154 | x-large   | 1000,1000     | save    | cheapest         | 200      | 400 -> 1200 | 3 items, 3000 kB, 3.12 s   | 1       |
| 155 | x-large   | 1000,1000     | save    | fourAttemptsOnly | 200      | failed      | 2 items, 2000 kB, 0.33 s   | 6.1     |
| 156 | x-large   | 1000,1000     | save-0  | fastest          | 200      | 400 -> 800  | 4 items, 4000 kB, 0.59 s   | 6.8     |
| 157 | x-large   | 1000,1000     | save-0  | fast             | 200      | 400 -> 600  | 4 items, 4000 kB, 0.5 s    | 8       |
| 158 | x-large   | 1000,1000     | save-0  | good             | 200      | 400 -> 600  | 4 items, 4000 kB, 0.49 s   | 8.2     |
| 159 | x-large   | 1000,1000     | save-0  | cheapest         | 200      | 400 -> 600  | 4 items, 4000 kB, 0.5 s    | 8       |
| 160 | x-large   | 1000,1000     | save-0  | fourAttemptsOnly | 200      | 400 -> 600  | 4 items, 4000 kB, 0.52 s   | 7.7     |
| 161 | mixed     | 2,10,100,1000 | update  | fastest          | 100      | 400 -> 900  | 2 items, 12 kB, 0.92 s     | 2.2     |
| 162 | mixed     | 2,10,100,1000 | update  | fast             | 100      | 400 -> 700  | 2 items, 12 kB, 0.96 s     | 2.1     |
| 163 | mixed     | 2,10,100,1000 | update  | good             | 100      | 400 -> 700  | 2 items, 12 kB, 1.09 s     | 1.8     |
| 164 | mixed     | 2,10,100,1000 | update  | cheapest         | 100      | 400 -> 700  | 2 items, 12 kB, 1.78 s     | 1.1     |
| 165 | mixed     | 2,10,100,1000 | update  | fourAttemptsOnly | 100      | 400 -> 700  | 2 items, 12 kB, 1.6 s      | 1.3     |
| 166 | mixed     | 2,10,100,1000 | update+ | fastest          | 100      | 400 -> 1000 | 4 items, 1112 kB, 1.26 s   | 3.2     |
| 167 | mixed     | 2,10,100,1000 | update+ | fast             | 100      | 400 -> 700  | 4 items, 1112 kB, 1.16 s   | 3.4     |
| 168 | mixed     | 2,10,100,1000 | update+ | good             | 100      | 400 -> 700  | 4 items, 1112 kB, 1.25 s   | 3.2     |
| 169 | mixed     | 2,10,100,1000 | update+ | cheapest         | 100      | 400 -> 700  | 4 items, 1112 kB, 1.92 s   | 2.1     |
| 170 | mixed     | 2,10,100,1000 | update+ | fourAttemptsOnly | 100      | 400 -> 700  | 4 items, 1112 kB, 1.78 s   | 2.2     |
| 171 | mixed     | 2,10,100,1000 | save    | fastest          | 100      | 400 -> 2100 | 2 items, 12 kB, 2.92 s     | 0.7     |
| 172 | mixed     | 2,10,100,1000 | save    | fast             | 100      | 400 -> 1300 | 2 items, 12 kB, 2.91 s     | 0.7     |
| 173 | mixed     | 2,10,100,1000 | save    | good             | 100      | 400 -> 1100 | 2 items, 12 kB, 2.86 s     | 0.7     |
| 174 | mixed     | 2,10,100,1000 | save    | cheapest         | 100      | 400 -> 800  | 2 items, 12 kB, 3.07 s     | 0.7     |
| 175 | mixed     | 2,10,100,1000 | save    | fourAttemptsOnly | 100      | failed      | 1 items, 2 kB, 0.16 s      | 6.3     |
| 176 | mixed     | 2,10,100,1000 | save-0  | fastest          | 100      | 400 -> 600  | 4 items, 1112 kB, 0.61 s   | 6.6     |
| 177 | mixed     | 2,10,100,1000 | save-0  | fast             | 100      | 400 -> 500  | 4 items, 1112 kB, 0.55 s   | 7.3     |
| 178 | mixed     | 2,10,100,1000 | save-0  | good             | 100      | 400 -> 500  | 4 items, 1112 kB, 0.48 s   | 8.3     |
| 179 | mixed     | 2,10,100,1000 | save-0  | cheapest         | 100      | 400 -> 500  | 4 items, 1112 kB, 0.52 s   | 7.7     |
| 180 | mixed     | 2,10,100,1000 | save-0  | fourAttemptsOnly | 100      | 400 -> 500  | 4 items, 1112 kB, 0.49 s   | 8.2     |
| 181 | mixed     | 2,10,100,1000 | update  | fastest          | 200      | 400 -> 1400 | 2 items, 12 kB, 0.97 s     | 2.1     |
| 182 | mixed     | 2,10,100,1000 | update  | fast             | 200      | 400 -> 1000 | 2 items, 12 kB, 1 s        | 2       |
| 183 | mixed     | 2,10,100,1000 | update  | good             | 200      | 400 -> 1000 | 2 items, 12 kB, 1.08 s     | 1.9     |
| 184 | mixed     | 2,10,100,1000 | update  | cheapest         | 200      | 400 -> 1000 | 2 items, 12 kB, 1.81 s     | 1.1     |
| 185 | mixed     | 2,10,100,1000 | update  | fourAttemptsOnly | 200      | 400 -> 1000 | 2 items, 12 kB, 1.57 s     | 1.3     |
| 186 | mixed     | 2,10,100,1000 | update+ | fastest          | 200      | 400 -> 1600 | 4 items, 1112 kB, 1.22 s   | 3.3     |
| 187 | mixed     | 2,10,100,1000 | update+ | fast             | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.12 s   | 3.6     |
| 188 | mixed     | 2,10,100,1000 | update+ | good             | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.22 s   | 3.3     |
| 189 | mixed     | 2,10,100,1000 | update+ | cheapest         | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.93 s   | 2.1     |
| 190 | mixed     | 2,10,100,1000 | update+ | fourAttemptsOnly | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.72 s   | 2.3     |
| 191 | mixed     | 2,10,100,1000 | save    | fastest          | 200      | 400 -> 3400 | 2 items, 12 kB, 2.68 s     | 0.7     |
| 192 | mixed     | 2,10,100,1000 | save    | fast             | 200      | 400 -> 2000 | 2 items, 12 kB, 2.71 s     | 0.7     |
| 193 | mixed     | 2,10,100,1000 | save    | good             | 200      | 400 -> 1800 | 2 items, 12 kB, 2.91 s     | 0.7     |
| 194 | mixed     | 2,10,100,1000 | save    | cheapest         | 200      | 400 -> 1200 | 2 items, 12 kB, 3.04 s     | 0.7     |
| 195 | mixed     | 2,10,100,1000 | save    | fourAttemptsOnly | 200      | failed      | 1 items, 2 kB, 0.17 s      | 5.9     |
| 196 | mixed     | 2,10,100,1000 | save-0  | fastest          | 200      | 400 -> 800  | 4 items, 1112 kB, 0.61 s   | 6.6     |
| 197 | mixed     | 2,10,100,1000 | save-0  | fast             | 200      | 400 -> 600  | 4 items, 1112 kB, 0.51 s   | 7.8     |
| 198 | mixed     | 2,10,100,1000 | save-0  | good             | 200      | 400 -> 600  | 4 items, 1112 kB, 0.5 s    | 8       |
| 199 | mixed     | 2,10,100,1000 | save-0  | cheapest         | 200      | 400 -> 600  | 4 items, 1112 kB, 0.5 s    | 8       |
| 200 | mixed     | 2,10,100,1000 | save-0  | fourAttemptsOnly | 200      | 400 -> 600  | 4 items, 1112 kB, 0.5 s    | 8       |

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
