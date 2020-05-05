# Throughput simulation

The last simulations were run on Tue May 05 2020 22:04:11 GMT+0200 (Central European Summer Time).

In total, it took 347.7 seconds.

## Results

| #   | data size | records (kB)  | mode         | strategy         | stepsize | increase    | after                      | items/s |
| --- | --------- | ------------- | ------------ | ---------------- | -------- | ----------- | -------------------------- | ------- |
| 1   | small     | 2,2           | update       | fastest          | 200      | 400 -> 600  | 59 items, 118 kB, 2.13 s   | 27.7    |
| 2   | small     | 2,2           | update       | fast             | 200      | 400 -> 600  | 18 items, 36 kB, 0.78 s    | 23.1    |
| 3   | small     | 2,2           | update       | good             | 200      | 400 -> 600  | 65 items, 130 kB, 2.48 s   | 26.2    |
| 4   | small     | 2,2           | update       | cheapest         | 200      | 400 -> 600  | 64 items, 128 kB, 2.4 s    | 26.7    |
| 5   | small     | 2,2           | update       | fourAttemptsOnly | 200      | 400 -> 600  | 20 items, 40 kB, 0.88 s    | 22.7    |
| 6   | small     | 2,2           | azureUpdate  | fastest          | 200      | 400 -> 600  | 19 items, 38 kB, 0.79 s    | 24.1    |
| 7   | small     | 2,2           | azureUpdate  | fast             | 200      | 400 -> 600  | 54 items, 108 kB, 1.9 s    | 28.4    |
| 8   | small     | 2,2           | azureUpdate  | good             | 200      | 400 -> 600  | 56 items, 112 kB, 2.01 s   | 27.9    |
| 9   | small     | 2,2           | azureUpdate  | cheapest         | 200      | 400 -> 600  | 52 items, 104 kB, 1.81 s   | 28.7    |
| 10  | small     | 2,2           | azureUpdate  | fourAttemptsOnly | 200      | 400 -> 600  | 64 items, 128 kB, 2.41 s   | 26.6    |
| 11  | small     | 2,2           | update+      | fastest          | 200      | 400 -> 600  | 32 items, 64 kB, 1.42 s    | 22.5    |
| 12  | small     | 2,2           | update+      | fast             | 200      | 400 -> 600  | 31 items, 62 kB, 1.38 s    | 22.5    |
| 13  | small     | 2,2           | update+      | good             | 200      | 400 -> 600  | 31 items, 62 kB, 1.43 s    | 21.7    |
| 14  | small     | 2,2           | update+      | cheapest         | 200      | 400 -> 600  | 33 items, 66 kB, 1.54 s    | 21.4    |
| 15  | small     | 2,2           | update+      | fourAttemptsOnly | 200      | 400 -> 600  | 34 items, 68 kB, 1.61 s    | 21.1    |
| 16  | small     | 2,2           | azureUpdate+ | fastest          | 200      | 400 -> 600  | 36 items, 72 kB, 1.76 s    | 20.5    |
| 17  | small     | 2,2           | azureUpdate+ | fast             | 200      | 400 -> 600  | 41 items, 82 kB, 2.11 s    | 19.4    |
| 18  | small     | 2,2           | azureUpdate+ | good             | 200      | 400 -> 600  | 30 items, 60 kB, 1.32 s    | 22.7    |
| 19  | small     | 2,2           | azureUpdate+ | cheapest         | 200      | 400 -> 600  | 32 items, 64 kB, 1.45 s    | 22.1    |
| 20  | small     | 2,2           | azureUpdate+ | fourAttemptsOnly | 200      | 400 -> 600  | 31 items, 62 kB, 1.39 s    | 22.3    |
| 21  | small     | 2,2           | failing save | fastest          | 200      | RU error    | 31 items, 62 kB, 1.18 s    | 26.3    |
| 22  | small     | 2,2           | failing save | fast             | 200      | RU error    | 40 items, 80 kB, 1.79 s    | 22.3    |
| 23  | small     | 2,2           | failing save | good             | 200      | RU error    | 39 items, 78 kB, 1.74 s    | 22.4    |
| 24  | small     | 2,2           | failing save | cheapest         | 200      | RU error    | 30 items, 60 kB, 1.11 s    | 27      |
| 25  | small     | 2,2           | failing save | fourAttemptsOnly | 200      | RU error    | 27 items, 54 kB, 0.95 s    | 28.4    |
| 26  | small     | 2,2           | azureSave    | fastest          | 200      | 400 -> 600  | 38 items, 76 kB, 1.85 s    | 20.5    |
| 27  | small     | 2,2           | azureSave    | fast             | 200      | 400 -> 600  | 31 items, 62 kB, 1.38 s    | 22.5    |
| 28  | small     | 2,2           | azureSave    | good             | 200      | 400 -> 600  | 32 items, 64 kB, 1.42 s    | 22.5    |
| 29  | small     | 2,2           | azureSave    | cheapest         | 200      | 400 -> 600  | 30 items, 60 kB, 1.33 s    | 22.6    |
| 30  | small     | 2,2           | azureSave    | fourAttemptsOnly | 200      | 400 -> 600  | 10 items, 20 kB, 0.6 s     | 16.7    |
| 31  | small     | 2,2           | azureWrap    | fastest          | 200      | 400 -> 600  | 33 items, 66 kB, 1.43 s    | 23.1    |
| 32  | small     | 2,2           | azureWrap    | fast             | 200      | 400 -> 600  | 35 items, 70 kB, 1.62 s    | 21.6    |
| 33  | small     | 2,2           | azureWrap    | good             | 200      | 400 -> 600  | 13 items, 26 kB, 0.75 s    | 17.3    |
| 34  | small     | 2,2           | azureWrap    | cheapest         | 200      | 400 -> 600  | 38 items, 76 kB, 1.84 s    | 20.7    |
| 35  | small     | 2,2           | azureWrap    | fourAttemptsOnly | 200      | 400 -> 600  | 12 items, 24 kB, 0.69 s    | 17.4    |
| 36  | medium    | 10,10         | update       | fastest          | 200      | 400 -> 600  | 30 items, 300 kB, 1.06 s   | 28.3    |
| 37  | medium    | 10,10         | update       | fast             | 200      | 400 -> 600  | 11 items, 110 kB, 0.6 s    | 18.3    |
| 38  | medium    | 10,10         | update       | good             | 200      | 400 -> 600  | 30 items, 300 kB, 1.14 s   | 26.3    |
| 39  | medium    | 10,10         | update       | cheapest         | 200      | 400 -> 600  | 31 items, 310 kB, 1.16 s   | 26.7    |
| 40  | medium    | 10,10         | update       | fourAttemptsOnly | 200      | 400 -> 600  | 30 items, 300 kB, 1.13 s   | 26.5    |
| 41  | medium    | 10,10         | azureUpdate  | fastest          | 200      | 400 -> 600  | 31 items, 310 kB, 1.12 s   | 27.7    |
| 42  | medium    | 10,10         | azureUpdate  | fast             | 200      | 400 -> 600  | 31 items, 310 kB, 1.16 s   | 26.7    |
| 43  | medium    | 10,10         | azureUpdate  | good             | 200      | 400 -> 600  | 30 items, 300 kB, 1.13 s   | 26.5    |
| 44  | medium    | 10,10         | azureUpdate  | cheapest         | 200      | 400 -> 600  | 11 items, 110 kB, 0.56 s   | 19.6    |
| 45  | medium    | 10,10         | azureUpdate  | fourAttemptsOnly | 200      | 400 -> 600  | 32 items, 320 kB, 1.22 s   | 26.2    |
| 46  | medium    | 10,10         | update+      | fastest          | 200      | 400 -> 600  | 7 items, 70 kB, 0.43 s     | 16.3    |
| 47  | medium    | 10,10         | update+      | fast             | 200      | 400 -> 600  | 6 items, 60 kB, 0.43 s     | 14      |
| 48  | medium    | 10,10         | update+      | good             | 200      | 400 -> 600  | 21 items, 210 kB, 1.05 s   | 20      |
| 49  | medium    | 10,10         | update+      | cheapest         | 200      | 400 -> 600  | 21 items, 210 kB, 1.01 s   | 20.8    |
| 50  | medium    | 10,10         | update+      | fourAttemptsOnly | 200      | 400 -> 600  | 21 items, 210 kB, 1.03 s   | 20.4    |
| 51  | medium    | 10,10         | azureUpdate+ | fastest          | 200      | 400 -> 600  | 22 items, 220 kB, 1.05 s   | 21      |
| 52  | medium    | 10,10         | azureUpdate+ | fast             | 200      | 400 -> 600  | 6 items, 60 kB, 0.42 s     | 14.3    |
| 53  | medium    | 10,10         | azureUpdate+ | good             | 200      | 400 -> 600  | 20 items, 200 kB, 0.94 s   | 21.3    |
| 54  | medium    | 10,10         | azureUpdate+ | cheapest         | 200      | 400 -> 600  | 21 items, 210 kB, 1 s      | 21      |
| 55  | medium    | 10,10         | azureUpdate+ | fourAttemptsOnly | 200      | 400 -> 600  | 20 items, 200 kB, 0.93 s   | 21.5    |
| 56  | medium    | 10,10         | failing save | fastest          | 200      | RU error    | 28 items, 280 kB, 0.99 s   | 28.3    |
| 57  | medium    | 10,10         | failing save | fast             | 200      | RU error    | 31 items, 310 kB, 1.18 s   | 26.3    |
| 58  | medium    | 10,10         | failing save | good             | 200      | RU error    | 32 items, 320 kB, 1.25 s   | 25.6    |
| 59  | medium    | 10,10         | failing save | cheapest         | 200      | RU error    | 3 items, 30 kB, 0.13 s     | 23.1    |
| 60  | medium    | 10,10         | failing save | fourAttemptsOnly | 200      | RU error    | 33 items, 330 kB, 1.35 s   | 24.4    |
| 61  | medium    | 10,10         | azureSave    | fastest          | 200      | 400 -> 600  | 34 items, 340 kB, 1.5 s    | 22.7    |
| 62  | medium    | 10,10         | azureSave    | fast             | 200      | 400 -> 600  | 32 items, 320 kB, 1.42 s   | 22.5    |
| 63  | medium    | 10,10         | azureSave    | good             | 200      | 400 -> 600  | 30 items, 300 kB, 1.32 s   | 22.7    |
| 64  | medium    | 10,10         | azureSave    | cheapest         | 200      | 400 -> 600  | 32 items, 320 kB, 1.41 s   | 22.7    |
| 65  | medium    | 10,10         | azureSave    | fourAttemptsOnly | 200      | 400 -> 600  | 11 items, 110 kB, 0.64 s   | 17.2    |
| 66  | medium    | 10,10         | azureWrap    | fastest          | 200      | 400 -> 600  | 12 items, 120 kB, 0.7 s    | 17.1    |
| 67  | medium    | 10,10         | azureWrap    | fast             | 200      | 400 -> 600  | 35 items, 350 kB, 1.62 s   | 21.6    |
| 68  | medium    | 10,10         | azureWrap    | good             | 200      | 400 -> 600  | 12 items, 120 kB, 0.7 s    | 17.1    |
| 69  | medium    | 10,10         | azureWrap    | cheapest         | 200      | 400 -> 600  | 11 items, 110 kB, 0.64 s   | 17.2    |
| 70  | medium    | 10,10         | azureWrap    | fourAttemptsOnly | 200      | 400 -> 600  | 34 items, 340 kB, 1.59 s   | 21.4    |
| 71  | large     | 100,100       | update       | fastest          | 200      | 400 -> 1000 | 7 items, 700 kB, 0.71 s    | 9.9     |
| 72  | large     | 100,100       | update       | fast             | 200      | 400 -> 600  | 6 items, 600 kB, 0.45 s    | 13.3    |
| 73  | large     | 100,100       | update       | good             | 200      | 400 -> 600  | 6 items, 600 kB, 0.45 s    | 13.3    |
| 74  | large     | 100,100       | update       | cheapest         | 200      | 400 -> 800  | 7 items, 700 kB, 0.78 s    | 9       |
| 75  | large     | 100,100       | update       | fourAttemptsOnly | 200      | 400 -> 600  | 4 items, 400 kB, 0.37 s    | 10.8    |
| 76  | large     | 100,100       | azureUpdate  | fastest          | 200      | 400 -> 800  | 3 items, 300 kB, 0.4 s     | 7.5     |
| 77  | large     | 100,100       | azureUpdate  | fast             | 200      | 400 -> 600  | 6 items, 600 kB, 0.44 s    | 13.6    |
| 78  | large     | 100,100       | azureUpdate  | good             | 200      | 400 -> 600  | 6 items, 600 kB, 0.43 s    | 14      |
| 79  | large     | 100,100       | azureUpdate  | cheapest         | 200      | 400 -> 600  | 3 items, 300 kB, 0.33 s    | 9.1     |
| 80  | large     | 100,100       | azureUpdate  | fourAttemptsOnly | 200      | 400 -> 600  | 6 items, 600 kB, 0.43 s    | 14      |
| 81  | large     | 100,100       | update+      | fastest          | 200      | 400 -> 800  | 5 items, 500 kB, 0.53 s    | 9.4     |
| 82  | large     | 100,100       | update+      | fast             | 200      | 400 -> 800  | 5 items, 500 kB, 0.72 s    | 6.9     |
| 83  | large     | 100,100       | update+      | good             | 200      | 400 -> 600  | 5 items, 500 kB, 0.47 s    | 10.6    |
| 84  | large     | 100,100       | update+      | cheapest         | 200      | 400 -> 800  | 5 items, 500 kB, 0.74 s    | 6.8     |
| 85  | large     | 100,100       | update+      | fourAttemptsOnly | 200      | 400 -> 600  | 3 items, 300 kB, 0.36 s    | 8.3     |
| 86  | large     | 100,100       | azureUpdate+ | fastest          | 200      | 400 -> 800  | 5 items, 500 kB, 0.52 s    | 9.6     |
| 87  | large     | 100,100       | azureUpdate+ | fast             | 200      | 400 -> 600  | 5 items, 500 kB, 0.45 s    | 11.1    |
| 88  | large     | 100,100       | azureUpdate+ | good             | 200      | 400 -> 600  | 2 items, 200 kB, 0.3 s     | 6.7     |
| 89  | large     | 100,100       | azureUpdate+ | cheapest         | 200      | 400 -> 600  | 5 items, 500 kB, 0.48 s    | 10.4    |
| 90  | large     | 100,100       | azureUpdate+ | fourAttemptsOnly | 200      | 400 -> 600  | 2 items, 200 kB, 0.29 s    | 6.9     |
| 91  | large     | 100,100       | failing save | fastest          | 200      | RU error    | 32 items, 3200 kB, 1.25 s  | 25.6    |
| 92  | large     | 100,100       | failing save | fast             | 200      | RU error    | 30 items, 3000 kB, 1.11 s  | 27      |
| 93  | large     | 100,100       | failing save | good             | 200      | RU error    | 28 items, 2800 kB, 0.97 s  | 28.9    |
| 94  | large     | 100,100       | failing save | cheapest         | 200      | RU error    | 5 items, 500 kB, 0.22 s    | 22.7    |
| 95  | large     | 100,100       | failing save | fourAttemptsOnly | 200      | RU error    | 31 items, 3100 kB, 1.19 s  | 26.1    |
| 96  | large     | 100,100       | azureSave    | fastest          | 200      | 400 -> 600  | 32 items, 3200 kB, 1.36 s  | 23.5    |
| 97  | large     | 100,100       | azureSave    | fast             | 200      | 400 -> 600  | 32 items, 3200 kB, 1.39 s  | 23      |
| 98  | large     | 100,100       | azureSave    | good             | 200      | 400 -> 600  | 34 items, 3400 kB, 1.52 s  | 22.4    |
| 99  | large     | 100,100       | azureSave    | cheapest         | 200      | 400 -> 600  | 15 items, 1500 kB, 0.76 s  | 19.7    |
| 100 | large     | 100,100       | azureSave    | fourAttemptsOnly | 200      | 400 -> 600  | 32 items, 3200 kB, 1.41 s  | 22.7    |
| 101 | large     | 100,100       | azureWrap    | fastest          | 200      | 400 -> 600  | 35 items, 3500 kB, 1.56 s  | 22.4    |
| 102 | large     | 100,100       | azureWrap    | fast             | 200      | 400 -> 600  | 33 items, 3300 kB, 1.49 s  | 22.1    |
| 103 | large     | 100,100       | azureWrap    | good             | 200      | 400 -> 600  | 36 items, 3600 kB, 1.69 s  | 21.3    |
| 104 | large     | 100,100       | azureWrap    | cheapest         | 200      | 400 -> 600  | 34 items, 3400 kB, 1.54 s  | 22.1    |
| 105 | large     | 100,100       | azureWrap    | fourAttemptsOnly | 200      | 400 -> 600  | 33 items, 3300 kB, 1.47 s  | 22.4    |
| 106 | x-large   | 1000,1000     | update       | fastest          | 200      | 400 -> 1200 | 2 items, 2000 kB, 0.89 s   | 2.2     |
| 107 | x-large   | 1000,1000     | update       | fast             | 200      | 400 -> 1000 | 2 items, 2000 kB, 1 s      | 2       |
| 108 | x-large   | 1000,1000     | update       | good             | 200      | 400 -> 1000 | 2 items, 2000 kB, 1.12 s   | 1.8     |
| 109 | x-large   | 1000,1000     | update       | cheapest         | 200      | 400 -> 1000 | 2 items, 2000 kB, 1.81 s   | 1.1     |
| 110 | x-large   | 1000,1000     | update       | fourAttemptsOnly | 200      | 400 -> 800  | 2 items, 2000 kB, 0.71 s   | 2.8     |
| 111 | x-large   | 1000,1000     | azureUpdate  | fastest          | 200      | 400 -> 1400 | 2 items, 2000 kB, 0.97 s   | 2.1     |
| 112 | x-large   | 1000,1000     | azureUpdate  | fast             | 200      | 400 -> 800  | 2 items, 2000 kB, 0.73 s   | 2.7     |
| 113 | x-large   | 1000,1000     | azureUpdate  | good             | 200      | 400 -> 800  | 2 items, 2000 kB, 0.81 s   | 2.5     |
| 114 | x-large   | 1000,1000     | azureUpdate  | cheapest         | 200      | 400 -> 1000 | 2 items, 2000 kB, 1.86 s   | 1.1     |
| 115 | x-large   | 1000,1000     | azureUpdate  | fourAttemptsOnly | 200      | 400 -> 800  | 2 items, 2000 kB, 0.74 s   | 2.7     |
| 116 | x-large   | 1000,1000     | update+      | fastest          | 200      | 400 -> 1000 | 1 items, 1000 kB, 0.59 s   | 1.7     |
| 117 | x-large   | 1000,1000     | update+      | fast             | 200      | 400 -> 800  | 1 items, 1000 kB, 0.64 s   | 1.6     |
| 118 | x-large   | 1000,1000     | update+      | good             | 200      | 400 -> 800  | 1 items, 1000 kB, 0.64 s   | 1.6     |
| 119 | x-large   | 1000,1000     | update+      | cheapest         | 200      | 400 -> 800  | 1 items, 1000 kB, 0.64 s   | 1.6     |
| 120 | x-large   | 1000,1000     | update+      | fourAttemptsOnly | 200      | 400 -> 800  | 1 items, 1000 kB, 0.6 s    | 1.7     |
| 121 | x-large   | 1000,1000     | azureUpdate+ | fastest          | 200      | 400 -> 1200 | 1 items, 1000 kB, 0.74 s   | 1.4     |
| 122 | x-large   | 1000,1000     | azureUpdate+ | fast             | 200      | 400 -> 800  | 1 items, 1000 kB, 0.65 s   | 1.5     |
| 123 | x-large   | 1000,1000     | azureUpdate+ | good             | 200      | 400 -> 800  | 1 items, 1000 kB, 0.63 s   | 1.6     |
| 124 | x-large   | 1000,1000     | azureUpdate+ | cheapest         | 200      | 400 -> 800  | 1 items, 1000 kB, 0.74 s   | 1.4     |
| 125 | x-large   | 1000,1000     | azureUpdate+ | fourAttemptsOnly | 200      | 400 -> 800  | 1 items, 1000 kB, 0.65 s   | 1.5     |
| 126 | x-large   | 1000,1000     | failing save | fastest          | 200      | RU error    | 40 items, 40000 kB, 1.81 s | 22.1    |
| 127 | x-large   | 1000,1000     | failing save | fast             | 200      | RU error    | 29 items, 29000 kB, 1.06 s | 27.4    |
| 128 | x-large   | 1000,1000     | failing save | good             | 200      | RU error    | 29 items, 29000 kB, 1.15 s | 25.2    |
| 129 | x-large   | 1000,1000     | failing save | cheapest         | 200      | 400 -> 600  | 31 items, 31000 kB, 1.33 s | 23.3    |
| 130 | x-large   | 1000,1000     | failing save | fourAttemptsOnly | 200      | RU error    | 30 items, 30000 kB, 1.13 s | 26.5    |
| 131 | x-large   | 1000,1000     | azureSave    | fastest          | 200      | 400 -> 600  | 34 items, 34000 kB, 1.49 s | 22.8    |
| 132 | x-large   | 1000,1000     | azureSave    | fast             | 200      | 400 -> 600  | 35 items, 35000 kB, 1.62 s | 21.6    |
| 133 | x-large   | 1000,1000     | azureSave    | good             | 200      | 400 -> 600  | 32 items, 32000 kB, 1.52 s | 21.1    |
| 134 | x-large   | 1000,1000     | azureSave    | cheapest         | 200      | 400 -> 600  | 33 items, 33000 kB, 1.48 s | 22.3    |
| 135 | x-large   | 1000,1000     | azureSave    | fourAttemptsOnly | 200      | 400 -> 600  | 33 items, 33000 kB, 1.48 s | 22.3    |
| 136 | x-large   | 1000,1000     | azureWrap    | fastest          | 200      | 400 -> 600  | 35 items, 35000 kB, 1.57 s | 22.3    |
| 137 | x-large   | 1000,1000     | azureWrap    | fast             | 200      | 400 -> 600  | 34 items, 34000 kB, 1.56 s | 21.8    |
| 138 | x-large   | 1000,1000     | azureWrap    | good             | 200      | 400 -> 600  | 46 items, 46000 kB, 2.37 s | 19.4    |
| 139 | x-large   | 1000,1000     | azureWrap    | cheapest         | 200      | 400 -> 600  | 34 items, 34000 kB, 1.56 s | 21.8    |
| 140 | x-large   | 1000,1000     | azureWrap    | fourAttemptsOnly | 200      | 400 -> 600  | 34 items, 34000 kB, 1.57 s | 21.7    |
| 141 | mixed     | 2,10,100,1000 | update       | fastest          | 200      | 400 -> 1600 | 5 items, 1114 kB, 1.16 s   | 4.3     |
| 142 | mixed     | 2,10,100,1000 | update       | fast             | 200      | 400 -> 1200 | 5 items, 1114 kB, 1.33 s   | 3.8     |
| 143 | mixed     | 2,10,100,1000 | update       | good             | 200      | 400 -> 1000 | 5 items, 1114 kB, 1.12 s   | 4.5     |
| 144 | mixed     | 2,10,100,1000 | update       | cheapest         | 200      | 400 -> 1000 | 5 items, 1114 kB, 1.91 s   | 2.6     |
| 145 | mixed     | 2,10,100,1000 | update       | fourAttemptsOnly | 200      | 400 -> 1000 | 5 items, 1114 kB, 1.65 s   | 3       |
| 146 | mixed     | 2,10,100,1000 | azureUpdate  | fastest          | 200      | 400 -> 1800 | 5 items, 1114 kB, 1.32 s   | 3.8     |
| 147 | mixed     | 2,10,100,1000 | azureUpdate  | fast             | 200      | 400 -> 1000 | 5 items, 1114 kB, 1.03 s   | 4.9     |
| 148 | mixed     | 2,10,100,1000 | azureUpdate  | good             | 200      | 400 -> 1000 | 5 items, 1114 kB, 1.14 s   | 4.4     |
| 149 | mixed     | 2,10,100,1000 | azureUpdate  | cheapest         | 200      | 400 -> 1000 | 5 items, 1114 kB, 1.88 s   | 2.7     |
| 150 | mixed     | 2,10,100,1000 | azureUpdate  | fourAttemptsOnly | 200      | 400 -> 1000 | 5 items, 1114 kB, 1.66 s   | 3       |
| 151 | mixed     | 2,10,100,1000 | update+      | fastest          | 200      | 400 -> 1600 | 4 items, 1112 kB, 1.13 s   | 3.5     |
| 152 | mixed     | 2,10,100,1000 | update+      | fast             | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.03 s   | 3.9     |
| 153 | mixed     | 2,10,100,1000 | update+      | good             | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.1 s    | 3.6     |
| 154 | mixed     | 2,10,100,1000 | update+      | cheapest         | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.83 s   | 2.2     |
| 155 | mixed     | 2,10,100,1000 | update+      | fourAttemptsOnly | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.6 s    | 2.5     |
| 156 | mixed     | 2,10,100,1000 | azureUpdate+ | fastest          | 200      | 400 -> 1600 | 4 items, 1112 kB, 1.1 s    | 3.6     |
| 157 | mixed     | 2,10,100,1000 | azureUpdate+ | fast             | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.04 s   | 3.8     |
| 158 | mixed     | 2,10,100,1000 | azureUpdate+ | good             | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.16 s   | 3.4     |
| 159 | mixed     | 2,10,100,1000 | azureUpdate+ | cheapest         | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.85 s   | 2.2     |
| 160 | mixed     | 2,10,100,1000 | azureUpdate+ | fourAttemptsOnly | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.66 s   | 2.4     |
| 161 | mixed     | 2,10,100,1000 | failing save | fastest          | 200      | RU error    | 32 items, 8896 kB, 1.25 s  | 25.6    |
| 162 | mixed     | 2,10,100,1000 | failing save | fast             | 200      | RU error    | 32 items, 8896 kB, 1.29 s  | 24.8    |
| 163 | mixed     | 2,10,100,1000 | failing save | good             | 200      | RU error    | 30 items, 7796 kB, 1.11 s  | 27      |
| 164 | mixed     | 2,10,100,1000 | failing save | cheapest         | 200      | RU error    | 30 items, 7796 kB, 1.11 s  | 27      |
| 165 | mixed     | 2,10,100,1000 | failing save | fourAttemptsOnly | 200      | RU error    | 22 items, 5572 kB, 0.82 s  | 26.8    |
| 166 | mixed     | 2,10,100,1000 | azureSave    | fastest          | 200      | 400 -> 600  | 33 items, 8898 kB, 1.4 s   | 23.6    |
| 167 | mixed     | 2,10,100,1000 | azureSave    | fast             | 200      | 400 -> 600  | 33 items, 8898 kB, 1.53 s  | 21.6    |
| 168 | mixed     | 2,10,100,1000 | azureSave    | good             | 200      | 400 -> 600  | 32 items, 8896 kB, 1.45 s  | 22.1    |
| 169 | mixed     | 2,10,100,1000 | azureSave    | cheapest         | 200      | 400 -> 600  | 31 items, 7896 kB, 1.37 s  | 22.6    |
| 170 | mixed     | 2,10,100,1000 | azureSave    | fourAttemptsOnly | 200      | 400 -> 600  | 33 items, 8898 kB, 1.5 s   | 22      |
| 171 | mixed     | 2,10,100,1000 | azureWrap    | fastest          | 200      | 400 -> 600  | 36 items, 10008 kB, 1.62 s | 22.2    |
| 172 | mixed     | 2,10,100,1000 | azureWrap    | fast             | 200      | 400 -> 600  | 35 items, 9008 kB, 1.62 s  | 21.6    |
| 173 | mixed     | 2,10,100,1000 | azureWrap    | good             | 200      | 400 -> 600  | 38 items, 10020 kB, 1.84 s | 20.7    |
| 174 | mixed     | 2,10,100,1000 | azureWrap    | cheapest         | 200      | 400 -> 600  | 34 items, 8908 kB, 1.55 s  | 21.9    |
| 175 | mixed     | 2,10,100,1000 | azureWrap    | fourAttemptsOnly | 200      | 400 -> 600  | 34 items, 8908 kB, 1.6 s   | 21.3    |

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
