# Throughput simulation

The last simulations were run on Thu May 07 2020 11:38:45 GMT+0200 (Central European Summer Time).

In total, it took 290.8 seconds.

## Results

| #   | data size | records (kB)  | mode         | strategy         | stepsize | increase    | after                      | items/s |
| --- | --------- | ------------- | ------------ | ---------------- | -------- | ----------- | -------------------------- | ------- |
| 1   | small     | 2,2           | update       | fastest          | 200      | 400 -> 600  | 70 items, 140 kB, 2.7 s    | 25.9    |
| 2   | small     | 2,2           | update       | fast             | 200      | 400 -> 600  | 33 items, 66 kB, 1.56 s    | 21.2    |
| 3   | small     | 2,2           | update       | good             | 200      | 400 -> 600  | 28 items, 56 kB, 1.17 s    | 23.9    |
| 4   | small     | 2,2           | update       | cheapest         | 200      | 400 -> 600  | 26 items, 52 kB, 1.16 s    | 22.4    |
| 5   | small     | 2,2           | update       | fourAttemptsOnly | 200      | 400 -> 600  | 22 items, 44 kB, 0.97 s    | 22.7    |
| 6   | small     | 2,2           | azureUpdate  | fastest          | 200      | RU error    | 21 items, 42 kB, 0.74 s    | 28.4    |
| 7   | small     | 2,2           | azureUpdate  | fast             | 200      | RU error    | 5 items, 10 kB, 0.19 s     | 26.3    |
| 8   | small     | 2,2           | azureUpdate  | good             | 200      | RU error    | 6 items, 12 kB, 0.22 s     | 27.3    |
| 9   | small     | 2,2           | azureUpdate  | cheapest         | 200      | RU error    | 7 items, 14 kB, 0.26 s     | 26.9    |
| 10  | small     | 2,2           | azureUpdate  | fourAttemptsOnly | 200      | RU error    | 8 items, 16 kB, 0.33 s     | 24.2    |
| 11  | small     | 2,2           | update+      | fastest          | 200      | 400 -> 600  | 19 items, 38 kB, 0.98 s    | 19.4    |
| 12  | small     | 2,2           | update+      | fast             | 200      | 400 -> 600  | 13 items, 26 kB, 0.81 s    | 16      |
| 13  | small     | 2,2           | update+      | good             | 200      | 400 -> 600  | 15 items, 30 kB, 0.9 s     | 16.7    |
| 14  | small     | 2,2           | update+      | cheapest         | 200      | 400 -> 600  | 13 items, 26 kB, 0.79 s    | 16.5    |
| 15  | small     | 2,2           | update+      | fourAttemptsOnly | 200      | 400 -> 600  | 15 items, 30 kB, 0.91 s    | 16.5    |
| 16  | small     | 2,2           | azureUpdate+ | fastest          | 200      | RU error    | 13 items, 26 kB, 0.59 s    | 22      |
| 17  | small     | 2,2           | azureUpdate+ | fast             | 200      | RU error    | 4 items, 8 kB, 0.2 s       | 20      |
| 18  | small     | 2,2           | azureUpdate+ | good             | 200      | RU error    | 4 items, 8 kB, 0.19 s      | 21.1    |
| 19  | small     | 2,2           | azureUpdate+ | cheapest         | 200      | RU error    | 4 items, 8 kB, 0.19 s      | 21.1    |
| 20  | small     | 2,2           | azureUpdate+ | fourAttemptsOnly | 200      | RU error    | 3 items, 6 kB, 0.15 s      | 20      |
| 21  | small     | 2,2           | failing save | fastest          | 200      | RU error    | 3 items, 6 kB, 0.17 s      | 17.6    |
| 22  | small     | 2,2           | failing save | fast             | 200      | RU error    | 4 items, 8 kB, 0.2 s       | 20      |
| 23  | small     | 2,2           | failing save | good             | 200      | RU error    | 4 items, 8 kB, 0.21 s      | 19      |
| 24  | small     | 2,2           | failing save | cheapest         | 200      | RU error    | 4 items, 8 kB, 0.21 s      | 19      |
| 25  | small     | 2,2           | failing save | fourAttemptsOnly | 200      | RU error    | 4 items, 8 kB, 0.19 s      | 21.1    |
| 26  | small     | 2,2           | azureSave    | fastest          | 200      | RU error    | 5 items, 10 kB, 0.25 s     | 20      |
| 27  | small     | 2,2           | azureSave    | fast             | 200      | RU error    | 6 items, 12 kB, 0.31 s     | 19.4    |
| 28  | small     | 2,2           | azureSave    | good             | 200      | RU error    | 4 items, 8 kB, 0.2 s       | 20      |
| 29  | small     | 2,2           | azureSave    | cheapest         | 200      | RU error    | 4 items, 8 kB, 0.21 s      | 19      |
| 30  | small     | 2,2           | azureSave    | fourAttemptsOnly | 200      | RU error    | 3 items, 6 kB, 0.15 s      | 20      |
| 31  | small     | 2,2           | azureWrap    | fastest          | 200      | RU error    | 8 items, 16 kB, 0.42 s     | 19      |
| 32  | small     | 2,2           | azureWrap    | fast             | 200      | RU error    | 6 items, 12 kB, 0.32 s     | 18.8    |
| 33  | small     | 2,2           | azureWrap    | good             | 200      | RU error    | 5 items, 10 kB, 0.27 s     | 18.5    |
| 34  | small     | 2,2           | azureWrap    | cheapest         | 200      | RU error    | 4 items, 8 kB, 0.21 s      | 19      |
| 35  | small     | 2,2           | azureWrap    | fourAttemptsOnly | 200      | RU error    | 5 items, 10 kB, 0.26 s     | 19.2    |
| 36  | medium    | 10,10         | update       | fastest          | 200      | 400 -> 600  | 8 items, 80 kB, 0.51 s     | 15.7    |
| 37  | medium    | 10,10         | update       | fast             | 200      | 400 -> 600  | 14 items, 140 kB, 0.77 s   | 18.2    |
| 38  | medium    | 10,10         | update       | good             | 200      | 400 -> 600  | 13 items, 130 kB, 0.66 s   | 19.7    |
| 39  | medium    | 10,10         | update       | cheapest         | 200      | 400 -> 600  | 15 items, 150 kB, 0.82 s   | 18.3    |
| 40  | medium    | 10,10         | update       | fourAttemptsOnly | 200      | 400 -> 600  | 15 items, 150 kB, 0.8 s    | 18.8    |
| 41  | medium    | 10,10         | azureUpdate  | fastest          | 200      | RU error    | 14 items, 140 kB, 0.55 s   | 25.5    |
| 42  | medium    | 10,10         | azureUpdate  | fast             | 200      | RU error    | 4 items, 40 kB, 0.19 s     | 21.1    |
| 43  | medium    | 10,10         | azureUpdate  | good             | 200      | RU error    | 4 items, 40 kB, 0.17 s     | 23.5    |
| 44  | medium    | 10,10         | azureUpdate  | cheapest         | 200      | RU error    | 6 items, 60 kB, 0.27 s     | 22.2    |
| 45  | medium    | 10,10         | azureUpdate  | fourAttemptsOnly | 200      | RU error    | 5 items, 50 kB, 0.22 s     | 22.7    |
| 46  | medium    | 10,10         | update+      | fastest          | 200      | 400 -> 600  | 16 items, 160 kB, 0.87 s   | 18.4    |
| 47  | medium    | 10,10         | update+      | fast             | 200      | 400 -> 600  | 8 items, 80 kB, 0.6 s      | 13.3    |
| 48  | medium    | 10,10         | update+      | good             | 200      | 400 -> 600  | 10 items, 100 kB, 0.68 s   | 14.7    |
| 49  | medium    | 10,10         | update+      | cheapest         | 200      | 400 -> 600  | 8 items, 80 kB, 0.55 s     | 14.5    |
| 50  | medium    | 10,10         | update+      | fourAttemptsOnly | 200      | 400 -> 600  | 8 items, 80 kB, 0.54 s     | 14.8    |
| 51  | medium    | 10,10         | azureUpdate+ | fastest          | 200      | RU error    | 7 items, 70 kB, 0.33 s     | 21.2    |
| 52  | medium    | 10,10         | azureUpdate+ | fast             | 200      | RU error    | 2 items, 20 kB, 0.11 s     | 18.2    |
| 53  | medium    | 10,10         | azureUpdate+ | good             | 200      | RU error    | 2 items, 20 kB, 0.11 s     | 18.2    |
| 54  | medium    | 10,10         | azureUpdate+ | cheapest         | 200      | RU error    | 2 items, 20 kB, 0.11 s     | 18.2    |
| 55  | medium    | 10,10         | azureUpdate+ | fourAttemptsOnly | 200      | RU error    | 3 items, 30 kB, 0.15 s     | 20      |
| 56  | medium    | 10,10         | failing save | fastest          | 200      | RU error    | 4 items, 40 kB, 0.18 s     | 22.2    |
| 57  | medium    | 10,10         | failing save | fast             | 200      | RU error    | 4 items, 40 kB, 0.19 s     | 21.1    |
| 58  | medium    | 10,10         | failing save | good             | 200      | RU error    | 3 items, 30 kB, 0.16 s     | 18.8    |
| 59  | medium    | 10,10         | failing save | cheapest         | 200      | RU error    | 3 items, 30 kB, 0.15 s     | 20      |
| 60  | medium    | 10,10         | failing save | fourAttemptsOnly | 200      | RU error    | 3 items, 30 kB, 0.15 s     | 20      |
| 61  | medium    | 10,10         | azureSave    | fastest          | 200      | RU error    | 3 items, 30 kB, 0.15 s     | 20      |
| 62  | medium    | 10,10         | azureSave    | fast             | 200      | RU error    | 4 items, 40 kB, 0.2 s      | 20      |
| 63  | medium    | 10,10         | azureSave    | good             | 200      | RU error    | 4 items, 40 kB, 0.21 s     | 19      |
| 64  | medium    | 10,10         | azureSave    | cheapest         | 200      | RU error    | 5 items, 50 kB, 0.25 s     | 20      |
| 65  | medium    | 10,10         | azureSave    | fourAttemptsOnly | 200      | RU error    | 5 items, 50 kB, 0.25 s     | 20      |
| 66  | medium    | 10,10         | azureWrap    | fastest          | 200      | RU error    | 4 items, 40 kB, 0.21 s     | 19      |
| 67  | medium    | 10,10         | azureWrap    | fast             | 200      | RU error    | 5 items, 50 kB, 0.24 s     | 20.8    |
| 68  | medium    | 10,10         | azureWrap    | good             | 200      | RU error    | 4 items, 40 kB, 0.21 s     | 19      |
| 69  | medium    | 10,10         | azureWrap    | cheapest         | 200      | RU error    | 4 items, 40 kB, 0.19 s     | 21.1    |
| 70  | medium    | 10,10         | azureWrap    | fourAttemptsOnly | 200      | RU error    | 6 items, 60 kB, 0.3 s      | 20      |
| 71  | large     | 100,100       | update       | fastest          | 200      | 400 -> 600  | 3 items, 300 kB, 0.31 s    | 9.7     |
| 72  | large     | 100,100       | update       | fast             | 200      | 400 -> 600  | 3 items, 300 kB, 0.36 s    | 8.3     |
| 73  | large     | 100,100       | update       | good             | 200      | 400 -> 600  | 3 items, 300 kB, 0.36 s    | 8.3     |
| 74  | large     | 100,100       | update       | cheapest         | 200      | 400 -> 600  | 3 items, 300 kB, 0.42 s    | 7.1     |
| 75  | large     | 100,100       | update       | fourAttemptsOnly | 200      | 400 -> 800  | 4 items, 400 kB, 0.72 s    | 5.6     |
| 76  | large     | 100,100       | azureUpdate  | fastest          | 200      | RU error    | 3 items, 300 kB, 0.16 s    | 18.8    |
| 77  | large     | 100,100       | azureUpdate  | fast             | 200      | RU error    | 2 items, 200 kB, 0.12 s    | 16.7    |
| 78  | large     | 100,100       | azureUpdate  | good             | 200      | RU error    | 2 items, 200 kB, 0.12 s    | 16.7    |
| 79  | large     | 100,100       | azureUpdate  | cheapest         | 200      | RU error    | 2 items, 200 kB, 0.12 s    | 16.7    |
| 80  | large     | 100,100       | azureUpdate  | fourAttemptsOnly | 200      | RU error    | 2 items, 200 kB, 0.13 s    | 15.4    |
| 81  | large     | 100,100       | update+      | fastest          | 200      | 400 -> 600  | 5 items, 500 kB, 0.46 s    | 10.9    |
| 82  | large     | 100,100       | update+      | fast             | 200      | 400 -> 600  | 2 items, 200 kB, 0.35 s    | 5.7     |
| 83  | large     | 100,100       | update+      | good             | 200      | 400 -> 800  | 3 items, 300 kB, 0.69 s    | 4.3     |
| 84  | large     | 100,100       | update+      | cheapest         | 200      | 400 -> 800  | 4 items, 400 kB, 0.64 s    | 6.3     |
| 85  | large     | 100,100       | update+      | fourAttemptsOnly | 200      | 400 -> 600  | 3 items, 300 kB, 0.39 s    | 7.7     |
| 86  | large     | 100,100       | azureUpdate+ | fastest          | 200      | RU error    | 1 items, 100 kB, 0.07 s    | 14.3    |
| 87  | large     | 100,100       | azureUpdate+ | fast             | 200      | RU error    | 1 items, 100 kB, 0.09 s    | 11.1    |
| 88  | large     | 100,100       | azureUpdate+ | good             | 200      | RU error    | 1 items, 100 kB, 0.08 s    | 12.5    |
| 89  | large     | 100,100       | azureUpdate+ | cheapest         | 200      | RU error    | 1 items, 100 kB, 0.08 s    | 12.5    |
| 90  | large     | 100,100       | azureUpdate+ | fourAttemptsOnly | 200      | RU error    | 1 items, 100 kB, 0.08 s    | 12.5    |
| 91  | large     | 100,100       | failing save | fastest          | 200      | RU error    | 6 items, 600 kB, 0.25 s    | 24      |
| 92  | large     | 100,100       | failing save | fast             | 200      | RU error    | 6 items, 600 kB, 0.29 s    | 20.7    |
| 93  | large     | 100,100       | failing save | good             | 200      | RU error    | 9 items, 900 kB, 0.43 s    | 20.9    |
| 94  | large     | 100,100       | failing save | cheapest         | 200      | RU error    | 7 items, 700 kB, 0.33 s    | 21.2    |
| 95  | large     | 100,100       | failing save | fourAttemptsOnly | 200      | RU error    | 9 items, 900 kB, 0.43 s    | 20.9    |
| 96  | large     | 100,100       | azureSave    | fastest          | 200      | RU error    | 7 items, 700 kB, 0.34 s    | 20.6    |
| 97  | large     | 100,100       | azureSave    | fast             | 200      | RU error    | 8 items, 800 kB, 0.39 s    | 20.5    |
| 98  | large     | 100,100       | azureSave    | good             | 200      | RU error    | 8 items, 800 kB, 0.38 s    | 21.1    |
| 99  | large     | 100,100       | azureSave    | cheapest         | 200      | RU error    | 7 items, 700 kB, 0.35 s    | 20      |
| 100 | large     | 100,100       | azureSave    | fourAttemptsOnly | 200      | RU error    | 8 items, 800 kB, 0.39 s    | 20.5    |
| 101 | large     | 100,100       | azureWrap    | fastest          | 200      | RU error    | 11 items, 1100 kB, 0.58 s  | 19      |
| 102 | large     | 100,100       | azureWrap    | fast             | 200      | RU error    | 9 items, 900 kB, 0.43 s    | 20.9    |
| 103 | large     | 100,100       | azureWrap    | good             | 200      | RU error    | 9 items, 900 kB, 0.44 s    | 20.5    |
| 104 | large     | 100,100       | azureWrap    | cheapest         | 200      | RU error    | 9 items, 900 kB, 0.46 s    | 19.6    |
| 105 | large     | 100,100       | azureWrap    | fourAttemptsOnly | 200      | RU error    | 9 items, 900 kB, 0.46 s    | 19.6    |
| 106 | x-large   | 1000,1000     | update       | fastest          | 200      | 400 -> 1200 | 2 items, 2000 kB, 0.89 s   | 2.2     |
| 107 | x-large   | 1000,1000     | update       | fast             | 200      | 400 -> 800  | 2 items, 2000 kB, 0.74 s   | 2.7     |
| 108 | x-large   | 1000,1000     | update       | good             | 200      | 400 -> 800  | 2 items, 2000 kB, 0.73 s   | 2.7     |
| 109 | x-large   | 1000,1000     | update       | cheapest         | 200      | 400 -> 800  | 2 items, 2000 kB, 0.74 s   | 2.7     |
| 110 | x-large   | 1000,1000     | update       | fourAttemptsOnly | 200      | 400 -> 800  | 2 items, 2000 kB, 0.76 s   | 2.6     |
| 111 | x-large   | 1000,1000     | azureUpdate  | fastest          | 200      | RU error    | 1 items, 1000 kB, 0.15 s   | 6.7     |
| 112 | x-large   | 1000,1000     | azureUpdate  | fast             | 200      | RU error    | 1 items, 1000 kB, 0.13 s   | 7.7     |
| 113 | x-large   | 1000,1000     | azureUpdate  | good             | 200      | RU error    | 1 items, 1000 kB, 0.14 s   | 7.1     |
| 114 | x-large   | 1000,1000     | azureUpdate  | cheapest         | 200      | RU error    | 1 items, 1000 kB, 0.11 s   | 9.1     |
| 115 | x-large   | 1000,1000     | azureUpdate  | fourAttemptsOnly | 200      | RU error    | 1 items, 1000 kB, 0.12 s   | 8.3     |
| 116 | x-large   | 1000,1000     | update+      | fastest          | 200      | 400 -> 1200 | 1 items, 1000 kB, 0.77 s   | 1.3     |
| 117 | x-large   | 1000,1000     | update+      | fast             | 200      | 400 -> 800  | 1 items, 1000 kB, 0.67 s   | 1.5     |
| 118 | x-large   | 1000,1000     | update+      | good             | 200      | 400 -> 800  | 1 items, 1000 kB, 0.66 s   | 1.5     |
| 119 | x-large   | 1000,1000     | update+      | cheapest         | 200      | 400 -> 800  | 1 items, 1000 kB, 0.66 s   | 1.5     |
| 120 | x-large   | 1000,1000     | update+      | fourAttemptsOnly | 200      | 400 -> 800  | 1 items, 1000 kB, 0.63 s   | 1.6     |
| 121 | x-large   | 1000,1000     | azureUpdate+ | fastest          | 200      | RU error    | (during preparation)       |         |
| 122 | x-large   | 1000,1000     | azureUpdate+ | fast             | 200      | RU error    | (during preparation)       |         |
| 123 | x-large   | 1000,1000     | azureUpdate+ | good             | 200      | RU error    | (during preparation)       |         |
| 124 | x-large   | 1000,1000     | azureUpdate+ | cheapest         | 200      | RU error    | (during preparation)       |         |
| 125 | x-large   | 1000,1000     | azureUpdate+ | fourAttemptsOnly | 200      | RU error    | (during preparation)       |         |
| 126 | x-large   | 1000,1000     | failing save | fastest          | 200      | RU error    | 35 items, 35000 kB, 1.48 s | 23.6    |
| 127 | x-large   | 1000,1000     | failing save | fast             | 200      | RU error    | 35 items, 35000 kB, 1.49 s | 23.5    |
| 128 | x-large   | 1000,1000     | failing save | good             | 200      | RU error    | 35 items, 35000 kB, 1.46 s | 24      |
| 129 | x-large   | 1000,1000     | failing save | cheapest         | 200      | RU error    | 36 items, 36000 kB, 1.53 s | 23.5    |
| 130 | x-large   | 1000,1000     | failing save | fourAttemptsOnly | 200      | RU error    | 28 items, 28000 kB, 0.99 s | 28.3    |
| 131 | x-large   | 1000,1000     | azureSave    | fastest          | 200      | RU error    | 30 items, 30000 kB, 1.09 s | 27.5    |
| 132 | x-large   | 1000,1000     | azureSave    | fast             | 200      | RU error    | 40 items, 40000 kB, 1.82 s | 22      |
| 133 | x-large   | 1000,1000     | azureSave    | good             | 200      | RU error    | 41 items, 41000 kB, 1.88 s | 21.8    |
| 134 | x-large   | 1000,1000     | azureSave    | cheapest         | 200      | RU error    | 38 items, 38000 kB, 1.68 s | 22.6    |
| 135 | x-large   | 1000,1000     | azureSave    | fourAttemptsOnly | 200      | RU error    | 38 items, 38000 kB, 1.68 s | 22.6    |
| 136 | x-large   | 1000,1000     | azureWrap    | fastest          | 200      | RU error    | 43 items, 43000 kB, 2.11 s | 20.4    |
| 137 | x-large   | 1000,1000     | azureWrap    | fast             | 200      | RU error    | 42 items, 42000 kB, 1.97 s | 21.3    |
| 138 | x-large   | 1000,1000     | azureWrap    | good             | 200      | RU error    | 51 items, 51000 kB, 2.57 s | 19.8    |
| 139 | x-large   | 1000,1000     | azureWrap    | cheapest         | 200      | RU error    | 43 items, 43000 kB, 2.01 s | 21.4    |
| 140 | x-large   | 1000,1000     | azureWrap    | fourAttemptsOnly | 200      | RU error    | 43 items, 43000 kB, 2.01 s | 21.4    |
| 141 | mixed     | 2,10,100,1000 | update       | fastest          | 200      | 400 -> 1800 | 5 items, 1114 kB, 1.37 s   | 3.6     |
| 142 | mixed     | 2,10,100,1000 | update       | fast             | 200      | 400 -> 1200 | 5 items, 1114 kB, 1.4 s    | 3.6     |
| 143 | mixed     | 2,10,100,1000 | update       | good             | 200      | 400 -> 1200 | 5 items, 1114 kB, 1.62 s   | 3.1     |
| 144 | mixed     | 2,10,100,1000 | update       | cheapest         | 200      | 400 -> 1000 | 5 items, 1114 kB, 1.94 s   | 2.6     |
| 145 | mixed     | 2,10,100,1000 | update       | fourAttemptsOnly | 200      | 400 -> 1000 | 5 items, 1114 kB, 1.67 s   | 3       |
| 146 | mixed     | 2,10,100,1000 | azureUpdate  | fastest          | 200      | RU error    | 4 items, 1112 kB, 0.25 s   | 16      |
| 147 | mixed     | 2,10,100,1000 | azureUpdate  | fast             | 200      | RU error    | 4 items, 1112 kB, 0.21 s   | 19      |
| 148 | mixed     | 2,10,100,1000 | azureUpdate  | good             | 200      | RU error    | 4 items, 1112 kB, 0.27 s   | 14.8    |
| 149 | mixed     | 2,10,100,1000 | azureUpdate  | cheapest         | 200      | RU error    | 4 items, 1112 kB, 0.25 s   | 16      |
| 150 | mixed     | 2,10,100,1000 | azureUpdate  | fourAttemptsOnly | 200      | RU error    | 4 items, 1112 kB, 0.24 s   | 16.7    |
| 151 | mixed     | 2,10,100,1000 | update+      | fastest          | 200      | 400 -> 1400 | 4 items, 1112 kB, 1.05 s   | 3.8     |
| 152 | mixed     | 2,10,100,1000 | update+      | fast             | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.1 s    | 3.6     |
| 153 | mixed     | 2,10,100,1000 | update+      | good             | 200      | 400 -> 1200 | 4 items, 1112 kB, 1.58 s   | 2.5     |
| 154 | mixed     | 2,10,100,1000 | update+      | cheapest         | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.89 s   | 2.1     |
| 155 | mixed     | 2,10,100,1000 | update+      | fourAttemptsOnly | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.68 s   | 2.4     |
| 156 | mixed     | 2,10,100,1000 | azureUpdate+ | fastest          | 200      | RU error    | 3 items, 112 kB, 0.18 s    | 16.7    |
| 157 | mixed     | 2,10,100,1000 | azureUpdate+ | fast             | 200      | RU error    | 3 items, 112 kB, 0.16 s    | 18.8    |
| 158 | mixed     | 2,10,100,1000 | azureUpdate+ | good             | 200      | RU error    | 3 items, 112 kB, 0.16 s    | 18.8    |
| 159 | mixed     | 2,10,100,1000 | azureUpdate+ | cheapest         | 200      | RU error    | 3 items, 112 kB, 0.16 s    | 18.8    |
| 160 | mixed     | 2,10,100,1000 | azureUpdate+ | fourAttemptsOnly | 200      | RU error    | 3 items, 112 kB, 0.16 s    | 18.8    |
| 161 | mixed     | 2,10,100,1000 | failing save | fastest          | 200      | RU error    | 34 items, 8908 kB, 1.46 s  | 23.3    |
| 162 | mixed     | 2,10,100,1000 | failing save | fast             | 200      | RU error    | 31 items, 7896 kB, 1.22 s  | 25.4    |
| 163 | mixed     | 2,10,100,1000 | failing save | good             | 200      | RU error    | 28 items, 7784 kB, 1.13 s  | 24.8    |
| 164 | mixed     | 2,10,100,1000 | failing save | cheapest         | 200      | RU error    | 44 items, 12232 kB, 2.09 s | 21.1    |
| 165 | mixed     | 2,10,100,1000 | failing save | fourAttemptsOnly | 200      | RU error    | 35 items, 9008 kB, 1.48 s  | 23.6    |
| 166 | mixed     | 2,10,100,1000 | azureSave    | fastest          | 200      | RU error    | 41 items, 11122 kB, 1.88 s | 21.8    |
| 167 | mixed     | 2,10,100,1000 | azureSave    | fast             | 200      | RU error    | 36 items, 10008 kB, 1.58 s | 22.8    |
| 168 | mixed     | 2,10,100,1000 | azureSave    | good             | 200      | RU error    | 31 items, 7896 kB, 1.4 s   | 22.1    |
| 169 | mixed     | 2,10,100,1000 | azureSave    | cheapest         | 200      | RU error    | 28 items, 7784 kB, 1.28 s  | 21.9    |
| 170 | mixed     | 2,10,100,1000 | azureSave    | fourAttemptsOnly | 200      | RU error    | 27 items, 6784 kB, 1.19 s  | 22.7    |
| 171 | mixed     | 2,10,100,1000 | azureWrap    | fastest          | 200      | RU error    | 30 items, 7796 kB, 1.41 s  | 21.3    |
| 172 | mixed     | 2,10,100,1000 | azureWrap    | fast             | 200      | RU error    | 32 items, 8896 kB, 1.52 s  | 21.1    |
| 173 | mixed     | 2,10,100,1000 | azureWrap    | good             | 200      | RU error    | 32 items, 8896 kB, 1.52 s  | 21.1    |
| 174 | mixed     | 2,10,100,1000 | azureWrap    | cheapest         | 200      | RU error    | 33 items, 8898 kB, 1.59 s  | 20.8    |
| 175 | mixed     | 2,10,100,1000 | azureWrap    | fourAttemptsOnly | 200      | RU error    | 32 items, 8896 kB, 1.5 s   | 21.3    |

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
