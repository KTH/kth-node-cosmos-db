# Throughput simulation

The last simulations were run on Sun May 03 2020 21:27:36 GMT+0200 (Central European Summer Time).

In total, it took 268.4 seconds.

## Results

| #   | data size | records (kB)  | mode        | strategy         | stepsize | increase    | after                      | items/s |
| --- | --------- | ------------- | ----------- | ---------------- | -------- | ----------- | -------------------------- | ------- |
| 1   | small     | 2,2           | update      | fastest          | 100      | 400 -> 500  | 60 items, 120 kB, 2.15 s   | 27.9    |
| 2   | small     | 2,2           | update      | fast             | 100      | 400 -> 500  | 17 items, 34 kB, 0.75 s    | 22.7    |
| 3   | small     | 2,2           | update      | good             | 100      | 400 -> 500  | 56 items, 112 kB, 2.01 s   | 27.9    |
| 4   | small     | 2,2           | update      | cheapest         | 100      | 400 -> 500  | 51 items, 102 kB, 1.75 s   | 29.1    |
| 5   | small     | 2,2           | update      | fourAttemptsOnly | 100      | 400 -> 500  | 56 items, 112 kB, 2.01 s   | 27.9    |
| 6   | small     | 2,2           | update+find | fastest          | 100      | 400 -> 500  | 31 items, 62 kB, 1.33 s    | 23.3    |
| 7   | small     | 2,2           | update+find | fast             | 100      | 400 -> 500  | 7 items, 14 kB, 0.45 s     | 15.6    |
| 8   | small     | 2,2           | update+find | good             | 100      | 400 -> 500  | 30 items, 60 kB, 1.31 s    | 22.9    |
| 9   | small     | 2,2           | update+find | cheapest         | 100      | 400 -> 500  | 30 items, 60 kB, 1.3 s     | 23.1    |
| 10  | small     | 2,2           | update+find | fourAttemptsOnly | 100      | 400 -> 500  | 31 items, 62 kB, 1.39 s    | 22.3    |
| 11  | small     | 2,2           | find+save   | fastest          | 100      | RU error    | 30 items, 60 kB, 1.11 s    | 27      |
| 12  | small     | 2,2           | find+save   | fast             | 100      | RU error    | 31 items, 62 kB, 1.16 s    | 26.7    |
| 13  | small     | 2,2           | find+save   | good             | 100      | RU error    | 28 items, 56 kB, 1.01 s    | 27.7    |
| 14  | small     | 2,2           | find+save   | cheapest         | 100      | RU error    | 3 items, 6 kB, 0.11 s      | 27.3    |
| 15  | small     | 2,2           | find+save   | fourAttemptsOnly | 100      | RU error    | 34 items, 68 kB, 1.4 s     | 24.3    |
| 16  | small     | 2,2           | update      | fastest          | 200      | 400 -> 600  | 52 items, 104 kB, 1.79 s   | 29.1    |
| 17  | small     | 2,2           | update      | fast             | 200      | 400 -> 600  | 47 items, 94 kB, 1.58 s    | 29.7    |
| 18  | small     | 2,2           | update      | good             | 200      | 400 -> 600  | 53 items, 106 kB, 1.84 s   | 28.8    |
| 19  | small     | 2,2           | update      | cheapest         | 200      | 400 -> 600  | 50 items, 100 kB, 1.69 s   | 29.6    |
| 20  | small     | 2,2           | update      | fourAttemptsOnly | 200      | 400 -> 600  | 15 items, 30 kB, 0.61 s    | 24.6    |
| 21  | small     | 2,2           | update+find | fastest          | 200      | 400 -> 600  | 28 items, 56 kB, 1.1 s     | 25.5    |
| 22  | small     | 2,2           | update+find | fast             | 200      | 400 -> 600  | 29 items, 58 kB, 1.2 s     | 24.2    |
| 23  | small     | 2,2           | update+find | good             | 200      | 400 -> 600  | 10 items, 20 kB, 0.58 s    | 17.2    |
| 24  | small     | 2,2           | update+find | cheapest         | 200      | 400 -> 600  | 11 items, 22 kB, 0.63 s    | 17.5    |
| 25  | small     | 2,2           | update+find | fourAttemptsOnly | 200      | 400 -> 600  | 11 items, 22 kB, 0.59 s    | 18.6    |
| 26  | small     | 2,2           | find+save   | fastest          | 200      | RU error    | 32 items, 64 kB, 1.23 s    | 26      |
| 27  | small     | 2,2           | find+save   | fast             | 200      | RU error    | 29 items, 58 kB, 1.01 s    | 28.7    |
| 28  | small     | 2,2           | find+save   | good             | 200      | RU error    | 3 items, 6 kB, 0.12 s      | 25      |
| 29  | small     | 2,2           | find+save   | cheapest         | 200      | RU error    | 3 items, 6 kB, 0.1 s       | 30      |
| 30  | small     | 2,2           | find+save   | fourAttemptsOnly | 200      | RU error    | 2 items, 4 kB, 0.07 s      | 28.6    |
| 31  | medium    | 10,10         | update      | fastest          | 100      | 400 -> 500  | 5 items, 50 kB, 0.28 s     | 17.9    |
| 32  | medium    | 10,10         | update      | fast             | 100      | 400 -> 500  | 28 items, 280 kB, 0.96 s   | 29.2    |
| 33  | medium    | 10,10         | update      | good             | 100      | 400 -> 500  | 30 items, 300 kB, 1.08 s   | 27.8    |
| 34  | medium    | 10,10         | update      | cheapest         | 100      | 400 -> 500  | 10 items, 100 kB, 0.5 s    | 20      |
| 35  | medium    | 10,10         | update      | fourAttemptsOnly | 100      | 400 -> 500  | 11 items, 110 kB, 0.54 s   | 20.4    |
| 36  | medium    | 10,10         | update+find | fastest          | 100      | 400 -> 500  | 7 items, 70 kB, 0.43 s     | 16.3    |
| 37  | medium    | 10,10         | update+find | fast             | 100      | 400 -> 500  | 20 items, 200 kB, 0.9 s    | 22.2    |
| 38  | medium    | 10,10         | update+find | good             | 100      | 400 -> 500  | 20 items, 200 kB, 0.92 s   | 21.7    |
| 39  | medium    | 10,10         | update+find | cheapest         | 100      | 400 -> 500  | 20 items, 200 kB, 0.91 s   | 22      |
| 40  | medium    | 10,10         | update+find | fourAttemptsOnly | 100      | 400 -> 500  | 20 items, 200 kB, 0.94 s   | 21.3    |
| 41  | medium    | 10,10         | find+save   | fastest          | 100      | RU error    | 28 items, 280 kB, 0.98 s   | 28.6    |
| 42  | medium    | 10,10         | find+save   | fast             | 100      | RU error    | 29 items, 290 kB, 1.03 s   | 28.2    |
| 43  | medium    | 10,10         | find+save   | good             | 100      | RU error    | 29 items, 290 kB, 1.02 s   | 28.4    |
| 44  | medium    | 10,10         | find+save   | cheapest         | 100      | RU error    | 28 items, 280 kB, 1 s      | 28      |
| 45  | medium    | 10,10         | find+save   | fourAttemptsOnly | 100      | RU error    | 3 items, 30 kB, 0.11 s     | 27.3    |
| 46  | medium    | 10,10         | update      | fastest          | 200      | 400 -> 600  | 4 items, 40 kB, 0.3 s      | 13.3    |
| 47  | medium    | 10,10         | update      | fast             | 200      | 400 -> 600  | 31 items, 310 kB, 1.18 s   | 26.3    |
| 48  | medium    | 10,10         | update      | good             | 200      | 400 -> 600  | 28 items, 280 kB, 0.99 s   | 28.3    |
| 49  | medium    | 10,10         | update      | cheapest         | 200      | 400 -> 600  | 30 items, 300 kB, 1.1 s    | 27.3    |
| 50  | medium    | 10,10         | update      | fourAttemptsOnly | 200      | 400 -> 600  | 30 items, 300 kB, 1.1 s    | 27.3    |
| 51  | medium    | 10,10         | update+find | fastest          | 200      | 400 -> 600  | 7 items, 70 kB, 0.38 s     | 18.4    |
| 52  | medium    | 10,10         | update+find | fast             | 200      | 400 -> 600  | 20 items, 200 kB, 0.94 s   | 21.3    |
| 53  | medium    | 10,10         | update+find | good             | 200      | 400 -> 600  | 21 items, 210 kB, 0.97 s   | 21.6    |
| 54  | medium    | 10,10         | update+find | cheapest         | 200      | 400 -> 600  | 20 items, 200 kB, 0.91 s   | 22      |
| 55  | medium    | 10,10         | update+find | fourAttemptsOnly | 200      | 400 -> 600  | 20 items, 200 kB, 0.91 s   | 22      |
| 56  | medium    | 10,10         | find+save   | fastest          | 200      | RU error    | 29 items, 290 kB, 1.02 s   | 28.4    |
| 57  | medium    | 10,10         | find+save   | fast             | 200      | RU error    | 30 items, 300 kB, 1.1 s    | 27.3    |
| 58  | medium    | 10,10         | find+save   | good             | 200      | RU error    | 31 items, 310 kB, 1.14 s   | 27.2    |
| 59  | medium    | 10,10         | find+save   | cheapest         | 200      | RU error    | 28 items, 280 kB, 0.96 s   | 29.2    |
| 60  | medium    | 10,10         | find+save   | fourAttemptsOnly | 200      | RU error    | 2 items, 20 kB, 0.07 s     | 28.6    |
| 61  | large     | 100,100       | update      | fastest          | 100      | 400 -> 600  | 3 items, 300 kB, 0.39 s    | 7.7     |
| 62  | large     | 100,100       | update      | fast             | 100      | 400 -> 500  | 3 items, 300 kB, 0.32 s    | 9.4     |
| 63  | large     | 100,100       | update      | good             | 100      | 400 -> 600  | 3 items, 300 kB, 0.63 s    | 4.8     |
| 64  | large     | 100,100       | update      | cheapest         | 100      | 400 -> 500  | 6 items, 600 kB, 0.43 s    | 14      |
| 65  | large     | 100,100       | update      | fourAttemptsOnly | 100      | 400 -> 500  | 3 items, 300 kB, 0.33 s    | 9.1     |
| 66  | large     | 100,100       | update+find | fastest          | 100      | 400 -> 600  | 5 items, 500 kB, 0.52 s    | 9.6     |
| 67  | large     | 100,100       | update+find | fast             | 100      | 400 -> 500  | 5 items, 500 kB, 0.46 s    | 10.9    |
| 68  | large     | 100,100       | update+find | good             | 100      | 400 -> 500  | 5 items, 500 kB, 0.46 s    | 10.9    |
| 69  | large     | 100,100       | update+find | cheapest         | 100      | 400 -> 500  | 2 items, 200 kB, 0.3 s     | 6.7     |
| 70  | large     | 100,100       | update+find | fourAttemptsOnly | 100      | 400 -> 500  | 5 items, 500 kB, 0.44 s    | 11.4    |
| 71  | large     | 100,100       | find+save   | fastest          | 100      | RU error    | 10 items, 1000 kB, 0.44 s  | 22.7    |
| 72  | large     | 100,100       | find+save   | fast             | 100      | RU error    | 30 items, 3000 kB, 1.08 s  | 27.8    |
| 73  | large     | 100,100       | find+save   | good             | 100      | RU error    | 30 items, 3000 kB, 1.09 s  | 27.5    |
| 74  | large     | 100,100       | find+save   | cheapest         | 100      | RU error    | 30 items, 3000 kB, 1.1 s   | 27.3    |
| 75  | large     | 100,100       | find+save   | fourAttemptsOnly | 100      | RU error    | 5 items, 500 kB, 0.16 s    | 31.3    |
| 76  | large     | 100,100       | update      | fastest          | 200      | 400 -> 800  | 7 items, 700 kB, 0.57 s    | 12.3    |
| 77  | large     | 100,100       | update      | fast             | 200      | 400 -> 600  | 3 items, 300 kB, 0.33 s    | 9.1     |
| 78  | large     | 100,100       | update      | good             | 200      | 400 -> 800  | 7 items, 700 kB, 0.74 s    | 9.5     |
| 79  | large     | 100,100       | update      | cheapest         | 200      | 400 -> 800  | 7 items, 700 kB, 0.77 s    | 9.1     |
| 80  | large     | 100,100       | update      | fourAttemptsOnly | 200      | 400 -> 600  | 4 items, 400 kB, 0.35 s    | 11.4    |
| 81  | large     | 100,100       | update+find | fastest          | 200      | 400 -> 800  | 5 items, 500 kB, 0.54 s    | 9.3     |
| 82  | large     | 100,100       | update+find | fast             | 200      | 400 -> 800  | 3 items, 300 kB, 0.54 s    | 5.6     |
| 83  | large     | 100,100       | update+find | good             | 200      | 400 -> 800  | 5 items, 500 kB, 0.73 s    | 6.8     |
| 84  | large     | 100,100       | update+find | cheapest         | 200      | 400 -> 800  | 5 items, 500 kB, 0.7 s     | 7.1     |
| 85  | large     | 100,100       | update+find | fourAttemptsOnly | 200      | 400 -> 600  | 5 items, 500 kB, 0.42 s    | 11.9    |
| 86  | large     | 100,100       | find+save   | fastest          | 200      | RU error    | 30 items, 3000 kB, 1.1 s   | 27.3    |
| 87  | large     | 100,100       | find+save   | fast             | 200      | RU error    | 31 items, 3100 kB, 1.15 s  | 27      |
| 88  | large     | 100,100       | find+save   | good             | 200      | RU error    | 30 items, 3000 kB, 1.1 s   | 27.3    |
| 89  | large     | 100,100       | find+save   | cheapest         | 200      | RU error    | 31 items, 3100 kB, 1.17 s  | 26.5    |
| 90  | large     | 100,100       | find+save   | fourAttemptsOnly | 200      | RU error    | 6 items, 600 kB, 0.22 s    | 27.3    |
| 91  | x-large   | 1000,1000     | update      | fastest          | 100      | 400 -> 1100 | 2 items, 2000 kB, 1.33 s   | 1.5     |
| 92  | x-large   | 1000,1000     | update      | fast             | 100      | 400 -> 700  | 2 items, 2000 kB, 1 s      | 2       |
| 93  | x-large   | 1000,1000     | update      | good             | 100      | 400 -> 700  | 2 items, 2000 kB, 1.17 s   | 1.7     |
| 94  | x-large   | 1000,1000     | update      | cheapest         | 100      | 400 -> 700  | 2 items, 2000 kB, 1.83 s   | 1.1     |
| 95  | x-large   | 1000,1000     | update      | fourAttemptsOnly | 100      | 400 -> 700  | 2 items, 2000 kB, 1.61 s   | 1.2     |
| 96  | x-large   | 1000,1000     | update+find | fastest          | 100      | 400 -> 800  | 1 items, 1000 kB, 0.7 s    | 1.4     |
| 97  | x-large   | 1000,1000     | update+find | fast             | 100      | 400 -> 600  | 1 items, 1000 kB, 0.63 s   | 1.6     |
| 98  | x-large   | 1000,1000     | update+find | good             | 100      | 400 -> 600  | 1 items, 1000 kB, 0.59 s   | 1.7     |
| 99  | x-large   | 1000,1000     | update+find | cheapest         | 100      | 400 -> 600  | 1 items, 1000 kB, 0.6 s    | 1.7     |
| 100 | x-large   | 1000,1000     | update+find | fourAttemptsOnly | 100      | 400 -> 600  | 1 items, 1000 kB, 0.61 s   | 1.6     |
| 101 | x-large   | 1000,1000     | find+save   | fastest          | 100      | RU error    | 31 items, 31000 kB, 1.16 s | 26.7    |
| 102 | x-large   | 1000,1000     | find+save   | fast             | 100      | RU error    | 30 items, 30000 kB, 1.09 s | 27.5    |
| 103 | x-large   | 1000,1000     | find+save   | good             | 100      | RU error    | 30 items, 30000 kB, 1.08 s | 27.8    |
| 104 | x-large   | 1000,1000     | find+save   | cheapest         | 100      | RU error    | 31 items, 31000 kB, 1.17 s | 26.5    |
| 105 | x-large   | 1000,1000     | find+save   | fourAttemptsOnly | 100      | RU error    | 28 items, 28000 kB, 0.97 s | 28.9    |
| 106 | x-large   | 1000,1000     | update      | fastest          | 200      | 400 -> 1400 | 2 items, 2000 kB, 0.95 s   | 2.1     |
| 107 | x-large   | 1000,1000     | update      | fast             | 200      | 400 -> 1000 | 2 items, 2000 kB, 0.99 s   | 2       |
| 108 | x-large   | 1000,1000     | update      | good             | 200      | 400 -> 1000 | 2 items, 2000 kB, 1.11 s   | 1.8     |
| 109 | x-large   | 1000,1000     | update      | cheapest         | 200      | 400 -> 800  | 2 items, 2000 kB, 0.69 s   | 2.9     |
| 110 | x-large   | 1000,1000     | update      | fourAttemptsOnly | 200      | 400 -> 800  | 2 items, 2000 kB, 0.69 s   | 2.9     |
| 111 | x-large   | 1000,1000     | update+find | fastest          | 200      | 400 -> 1000 | 1 items, 1000 kB, 0.57 s   | 1.8     |
| 112 | x-large   | 1000,1000     | update+find | fast             | 200      | 400 -> 800  | 1 items, 1000 kB, 0.6 s    | 1.7     |
| 113 | x-large   | 1000,1000     | update+find | good             | 200      | 400 -> 800  | 1 items, 1000 kB, 0.61 s   | 1.6     |
| 114 | x-large   | 1000,1000     | update+find | cheapest         | 200      | 400 -> 800  | 1 items, 1000 kB, 0.59 s   | 1.7     |
| 115 | x-large   | 1000,1000     | update+find | fourAttemptsOnly | 200      | 400 -> 800  | 1 items, 1000 kB, 0.6 s    | 1.7     |
| 116 | x-large   | 1000,1000     | find+save   | fastest          | 200      | RU error    | 30 items, 30000 kB, 1.1 s  | 27.3    |
| 117 | x-large   | 1000,1000     | find+save   | fast             | 200      | RU error    | 33 items, 33000 kB, 1.28 s | 25.8    |
| 118 | x-large   | 1000,1000     | find+save   | good             | 200      | RU error    | 31 items, 31000 kB, 1.14 s | 27.2    |
| 119 | x-large   | 1000,1000     | find+save   | cheapest         | 200      | RU error    | 32 items, 32000 kB, 1.23 s | 26      |
| 120 | x-large   | 1000,1000     | find+save   | fourAttemptsOnly | 200      | RU error    | 31 items, 31000 kB, 1.21 s | 25.6    |
| 121 | mixed     | 2,10,100,1000 | update      | fastest          | 100      | 400 -> 1000 | 5 items, 1114 kB, 1.12 s   | 4.5     |
| 122 | mixed     | 2,10,100,1000 | update      | fast             | 100      | 400 -> 800  | 5 items, 1114 kB, 1.34 s   | 3.7     |
| 123 | mixed     | 2,10,100,1000 | update      | good             | 100      | 400 -> 700  | 5 items, 1114 kB, 1.14 s   | 4.4     |
| 124 | mixed     | 2,10,100,1000 | update      | cheapest         | 100      | 400 -> 700  | 5 items, 1114 kB, 1.83 s   | 2.7     |
| 125 | mixed     | 2,10,100,1000 | update      | fourAttemptsOnly | 100      | 400 -> 700  | 5 items, 1114 kB, 1.65 s   | 3       |
| 126 | mixed     | 2,10,100,1000 | update+find | fastest          | 100      | 400 -> 1200 | 4 items, 1112 kB, 1.38 s   | 2.9     |
| 127 | mixed     | 2,10,100,1000 | update+find | fast             | 100      | 400 -> 600  | 4 items, 1112 kB, 1.26 s   | 3.2     |
| 128 | mixed     | 2,10,100,1000 | update+find | good             | 100      | 400 -> 700  | 4 items, 1112 kB, 1.12 s   | 3.6     |
| 129 | mixed     | 2,10,100,1000 | update+find | cheapest         | 100      | 400 -> 700  | 4 items, 1112 kB, 1.82 s   | 2.2     |
| 130 | mixed     | 2,10,100,1000 | update+find | fourAttemptsOnly | 100      | 400 -> 700  | 4 items, 1112 kB, 1.61 s   | 2.5     |
| 131 | mixed     | 2,10,100,1000 | find+save   | fastest          | 100      | RU error    | 29 items, 7786 kB, 1.04 s  | 27.9    |
| 132 | mixed     | 2,10,100,1000 | find+save   | fast             | 100      | 400 -> 500  | 31 items, 7896 kB, 1.31 s  | 23.7    |
| 133 | mixed     | 2,10,100,1000 | find+save   | good             | 100      | RU error    | 27 items, 6784 kB, 0.99 s  | 27.3    |
| 134 | mixed     | 2,10,100,1000 | find+save   | cheapest         | 100      | RU error    | 21 items, 5562 kB, 0.78 s  | 26.9    |
| 135 | mixed     | 2,10,100,1000 | find+save   | fourAttemptsOnly | 100      | RU error    | 31 items, 7896 kB, 1.16 s  | 26.7    |
| 136 | mixed     | 2,10,100,1000 | update      | fastest          | 200      | 400 -> 1600 | 5 items, 1114 kB, 1.15 s   | 4.3     |
| 137 | mixed     | 2,10,100,1000 | update      | fast             | 200      | 400 -> 1000 | 5 items, 1114 kB, 1.05 s   | 4.8     |
| 138 | mixed     | 2,10,100,1000 | update      | good             | 200      | 400 -> 1000 | 5 items, 1114 kB, 1.14 s   | 4.4     |
| 139 | mixed     | 2,10,100,1000 | update      | cheapest         | 200      | 400 -> 1000 | 5 items, 1114 kB, 1.86 s   | 2.7     |
| 140 | mixed     | 2,10,100,1000 | update      | fourAttemptsOnly | 200      | 400 -> 1000 | 5 items, 1114 kB, 1.66 s   | 3       |
| 141 | mixed     | 2,10,100,1000 | update+find | fastest          | 200      | 400 -> 1600 | 4 items, 1112 kB, 1.09 s   | 3.7     |
| 142 | mixed     | 2,10,100,1000 | update+find | fast             | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.03 s   | 3.9     |
| 143 | mixed     | 2,10,100,1000 | update+find | good             | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.1 s    | 3.6     |
| 144 | mixed     | 2,10,100,1000 | update+find | cheapest         | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.82 s   | 2.2     |
| 145 | mixed     | 2,10,100,1000 | update+find | fourAttemptsOnly | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.64 s   | 2.4     |
| 146 | mixed     | 2,10,100,1000 | find+save   | fastest          | 200      | RU error    | 30 items, 7796 kB, 1.09 s  | 27.5    |
| 147 | mixed     | 2,10,100,1000 | find+save   | fast             | 200      | RU error    | 30 items, 7796 kB, 1.09 s  | 27.5    |
| 148 | mixed     | 2,10,100,1000 | find+save   | good             | 200      | RU error    | 21 items, 5562 kB, 0.79 s  | 26.6    |
| 149 | mixed     | 2,10,100,1000 | find+save   | cheapest         | 200      | RU error    | 30 items, 7796 kB, 1.1 s   | 27.3    |
| 150 | mixed     | 2,10,100,1000 | find+save   | fourAttemptsOnly | 200      | RU error    | 22 items, 5572 kB, 0.82 s  | 26.8    |

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
