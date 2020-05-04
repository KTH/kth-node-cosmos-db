# Throughput simulation

The last simulations were run on Mon May 04 2020 15:48:52 GMT+0200 (Central European Summer Time).

In total, it took 292 seconds.

## Results

| #   | data size | records (kB)  | mode        | strategy         | stepsize | increase    | after                      | items/s |
| --- | --------- | ------------- | ----------- | ---------------- | -------- | ----------- | -------------------------- | ------- |
| 1   | small     | 2,2           | update      | fastest          | 100      | 400 -> 500  | 73 items, 146 kB, 2.84 s   | 25.7    |
| 2   | small     | 2,2           | update      | fast             | 100      | 400 -> 500  | 71 items, 142 kB, 2.81 s   | 25.3    |
| 3   | small     | 2,2           | update      | good             | 100      | 400 -> 500  | 72 items, 144 kB, 2.83 s   | 25.4    |
| 4   | small     | 2,2           | update      | cheapest         | 100      | 400 -> 500  | 68 items, 136 kB, 2.62 s   | 26      |
| 5   | small     | 2,2           | update      | fourAttemptsOnly | 100      | 400 -> 500  | 64 items, 128 kB, 2.42 s   | 26.4    |
| 6   | small     | 2,2           | update+find | fastest          | 100      | 400 -> 500  | 35 items, 70 kB, 1.65 s    | 21.2    |
| 7   | small     | 2,2           | update+find | fast             | 100      | 400 -> 500  | 36 items, 72 kB, 1.75 s    | 20.6    |
| 8   | small     | 2,2           | update+find | good             | 100      | 400 -> 500  | 34 items, 68 kB, 1.63 s    | 20.9    |
| 9   | small     | 2,2           | update+find | cheapest         | 100      | 400 -> 500  | 35 items, 70 kB, 1.7 s     | 20.6    |
| 10  | small     | 2,2           | update+find | fourAttemptsOnly | 100      | 400 -> 500  | 34 items, 68 kB, 1.63 s    | 20.9    |
| 11  | small     | 2,2           | find+save   | fastest          | 100      | RU error    | 11 items, 22 kB, 0.49 s    | 22.4    |
| 12  | small     | 2,2           | find+save   | fast             | 100      | RU error    | 2 items, 4 kB, 0.1 s       | 20      |
| 13  | small     | 2,2           | find+save   | good             | 100      | RU error    | 33 items, 66 kB, 1.31 s    | 25.2    |
| 14  | small     | 2,2           | find+save   | cheapest         | 100      | RU error    | 32 items, 64 kB, 1.26 s    | 25.4    |
| 15  | small     | 2,2           | find+save   | fourAttemptsOnly | 100      | RU error    | 32 items, 64 kB, 1.26 s    | 25.4    |
| 16  | small     | 2,2           | update      | fastest          | 200      | 400 -> 600  | 59 items, 118 kB, 2.16 s   | 27.3    |
| 17  | small     | 2,2           | update      | fast             | 200      | 400 -> 600  | 59 items, 118 kB, 2.21 s   | 26.7    |
| 18  | small     | 2,2           | update      | good             | 200      | 400 -> 600  | 57 items, 114 kB, 2.08 s   | 27.4    |
| 19  | small     | 2,2           | update      | cheapest         | 200      | 400 -> 600  | 59 items, 118 kB, 2.16 s   | 27.3    |
| 20  | small     | 2,2           | update      | fourAttemptsOnly | 200      | 400 -> 600  | 18 items, 36 kB, 0.77 s    | 23.4    |
| 21  | small     | 2,2           | update+find | fastest          | 200      | 400 -> 600  | 34 items, 68 kB, 1.55 s    | 21.9    |
| 22  | small     | 2,2           | update+find | fast             | 200      | 400 -> 600  | 34 items, 68 kB, 1.63 s    | 20.9    |
| 23  | small     | 2,2           | update+find | good             | 200      | 400 -> 600  | 34 items, 68 kB, 1.61 s    | 21.1    |
| 24  | small     | 2,2           | update+find | cheapest         | 200      | 400 -> 600  | 34 items, 68 kB, 1.62 s    | 21      |
| 25  | small     | 2,2           | update+find | fourAttemptsOnly | 200      | 400 -> 600  | 34 items, 68 kB, 1.62 s    | 21      |
| 26  | small     | 2,2           | find+save   | fastest          | 200      | RU error    | 32 items, 64 kB, 1.24 s    | 25.8    |
| 27  | small     | 2,2           | find+save   | fast             | 200      | RU error    | 3 items, 6 kB, 0.14 s      | 21.4    |
| 28  | small     | 2,2           | find+save   | good             | 200      | RU error    | 32 items, 64 kB, 1.26 s    | 25.4    |
| 29  | small     | 2,2           | find+save   | cheapest         | 200      | RU error    | 31 items, 62 kB, 1.22 s    | 25.4    |
| 30  | small     | 2,2           | find+save   | fourAttemptsOnly | 200      | RU error    | 3 items, 6 kB, 0.14 s      | 21.4    |
| 31  | medium    | 10,10         | update      | fastest          | 100      | 400 -> 500  | 32 items, 320 kB, 1.22 s   | 26.2    |
| 32  | medium    | 10,10         | update      | fast             | 100      | 400 -> 500  | 9 items, 90 kB, 0.55 s     | 16.4    |
| 33  | medium    | 10,10         | update      | good             | 100      | 400 -> 500  | 10 items, 100 kB, 0.53 s   | 18.9    |
| 34  | medium    | 10,10         | update      | cheapest         | 100      | 400 -> 500  | 29 items, 290 kB, 1.07 s   | 27.1    |
| 35  | medium    | 10,10         | update      | fourAttemptsOnly | 100      | 400 -> 500  | 29 items, 290 kB, 1.03 s   | 28.2    |
| 36  | medium    | 10,10         | update+find | fastest          | 100      | 400 -> 500  | 6 items, 60 kB, 0.41 s     | 14.6    |
| 37  | medium    | 10,10         | update+find | fast             | 100      | 400 -> 500  | 24 items, 240 kB, 1.29 s   | 18.6    |
| 38  | medium    | 10,10         | update+find | good             | 100      | 400 -> 500  | 23 items, 230 kB, 1.2 s    | 19.2    |
| 39  | medium    | 10,10         | update+find | cheapest         | 100      | 400 -> 500  | 8 items, 80 kB, 0.58 s     | 13.8    |
| 40  | medium    | 10,10         | update+find | fourAttemptsOnly | 100      | 400 -> 500  | 22 items, 220 kB, 1.14 s   | 19.3    |
| 41  | medium    | 10,10         | find+save   | fastest          | 100      | RU error    | 31 items, 310 kB, 1.2 s    | 25.8    |
| 42  | medium    | 10,10         | find+save   | fast             | 100      | RU error    | 33 items, 330 kB, 1.31 s   | 25.2    |
| 43  | medium    | 10,10         | find+save   | good             | 100      | RU error    | 4 items, 40 kB, 0.19 s     | 21.1    |
| 44  | medium    | 10,10         | find+save   | cheapest         | 100      | RU error    | 31 items, 310 kB, 1.2 s    | 25.8    |
| 45  | medium    | 10,10         | find+save   | fourAttemptsOnly | 100      | RU error    | 30 items, 300 kB, 1.16 s   | 25.9    |
| 46  | medium    | 10,10         | update      | fastest          | 200      | 400 -> 600  | 5 items, 50 kB, 0.34 s     | 14.7    |
| 47  | medium    | 10,10         | update      | fast             | 200      | 400 -> 600  | 10 items, 100 kB, 0.52 s   | 19.2    |
| 48  | medium    | 10,10         | update      | good             | 200      | 400 -> 600  | 31 items, 310 kB, 1.2 s    | 25.8    |
| 49  | medium    | 10,10         | update      | cheapest         | 200      | 400 -> 600  | 31 items, 310 kB, 1.23 s   | 25.2    |
| 50  | medium    | 10,10         | update      | fourAttemptsOnly | 200      | 400 -> 600  | 31 items, 310 kB, 1.2 s    | 25.8    |
| 51  | medium    | 10,10         | update+find | fastest          | 200      | 400 -> 600  | 23 items, 230 kB, 1.12 s   | 20.5    |
| 52  | medium    | 10,10         | update+find | fast             | 200      | 400 -> 600  | 22 items, 220 kB, 1.12 s   | 19.6    |
| 53  | medium    | 10,10         | update+find | good             | 200      | 400 -> 600  | 22 items, 220 kB, 1.11 s   | 19.8    |
| 54  | medium    | 10,10         | update+find | cheapest         | 200      | 400 -> 600  | 22 items, 220 kB, 1.11 s   | 19.8    |
| 55  | medium    | 10,10         | update+find | fourAttemptsOnly | 200      | 400 -> 600  | 22 items, 220 kB, 1.11 s   | 19.8    |
| 56  | medium    | 10,10         | find+save   | fastest          | 200      | RU error    | 32 items, 320 kB, 1.26 s   | 25.4    |
| 57  | medium    | 10,10         | find+save   | fast             | 200      | RU error    | 31 items, 310 kB, 1.18 s   | 26.3    |
| 58  | medium    | 10,10         | find+save   | good             | 200      | RU error    | 32 items, 320 kB, 1.26 s   | 25.4    |
| 59  | medium    | 10,10         | find+save   | cheapest         | 200      | 400 -> 600  | 5 items, 50 kB, 0.39 s     | 12.8    |
| 60  | medium    | 10,10         | find+save   | fourAttemptsOnly | 200      | RU error    | 31 items, 310 kB, 1.17 s   | 26.5    |
| 61  | large     | 100,100       | update      | fastest          | 100      | 400 -> 600  | 7 items, 700 kB, 0.63 s    | 11.1    |
| 62  | large     | 100,100       | update      | fast             | 100      | 400 -> 600  | 7 items, 700 kB, 0.84 s    | 8.3     |
| 63  | large     | 100,100       | update      | good             | 100      | 400 -> 600  | 7 items, 700 kB, 0.82 s    | 8.5     |
| 64  | large     | 100,100       | update      | cheapest         | 100      | 400 -> 600  | 7 items, 700 kB, 0.81 s    | 8.6     |
| 65  | large     | 100,100       | update      | fourAttemptsOnly | 100      | 400 -> 600  | 7 items, 700 kB, 0.79 s    | 8.9     |
| 66  | large     | 100,100       | update+find | fastest          | 100      | 400 -> 600  | 3 items, 300 kB, 0.48 s    | 6.3     |
| 67  | large     | 100,100       | update+find | fast             | 100      | 400 -> 500  | 5 items, 500 kB, 0.5 s     | 10      |
| 68  | large     | 100,100       | update+find | good             | 100      | 400 -> 500  | 5 items, 500 kB, 0.48 s    | 10.4    |
| 69  | large     | 100,100       | update+find | cheapest         | 100      | 400 -> 500  | 5 items, 500 kB, 0.46 s    | 10.9    |
| 70  | large     | 100,100       | update+find | fourAttemptsOnly | 100      | 400 -> 500  | 5 items, 500 kB, 0.48 s    | 10.4    |
| 71  | large     | 100,100       | find+save   | fastest          | 100      | RU error    | 33 items, 3300 kB, 1.34 s  | 24.6    |
| 72  | large     | 100,100       | find+save   | fast             | 100      | RU error    | 7 items, 700 kB, 0.3 s     | 23.3    |
| 73  | large     | 100,100       | find+save   | good             | 100      | RU error    | 31 items, 3100 kB, 1.19 s  | 26.1    |
| 74  | large     | 100,100       | find+save   | cheapest         | 100      | RU error    | 33 items, 3300 kB, 1.3 s   | 25.4    |
| 75  | large     | 100,100       | find+save   | fourAttemptsOnly | 100      | RU error    | 34 items, 3400 kB, 1.38 s  | 24.6    |
| 76  | large     | 100,100       | update      | fastest          | 200      | 400 -> 800  | 7 items, 700 kB, 0.6 s     | 11.7    |
| 77  | large     | 100,100       | update      | fast             | 200      | 400 -> 800  | 7 items, 700 kB, 0.76 s    | 9.2     |
| 78  | large     | 100,100       | update      | good             | 200      | 400 -> 800  | 7 items, 700 kB, 0.8 s     | 8.8     |
| 79  | large     | 100,100       | update      | cheapest         | 200      | 400 -> 600  | 4 items, 400 kB, 0.39 s    | 10.3    |
| 80  | large     | 100,100       | update      | fourAttemptsOnly | 200      | 400 -> 600  | 3 items, 300 kB, 0.35 s    | 8.6     |
| 81  | large     | 100,100       | update+find | fastest          | 200      | 400 -> 600  | 2 items, 200 kB, 0.28 s    | 7.1     |
| 82  | large     | 100,100       | update+find | fast             | 200      | 400 -> 600  | 5 items, 500 kB, 0.49 s    | 10.2    |
| 83  | large     | 100,100       | update+find | good             | 200      | 400 -> 600  | 5 items, 500 kB, 0.49 s    | 10.2    |
| 84  | large     | 100,100       | update+find | cheapest         | 200      | 400 -> 600  | 2 items, 200 kB, 0.32 s    | 6.3     |
| 85  | large     | 100,100       | update+find | fourAttemptsOnly | 200      | 400 -> 600  | 5 items, 500 kB, 0.5 s     | 10      |
| 86  | large     | 100,100       | find+save   | fastest          | 200      | RU error    | 14 items, 1400 kB, 0.59 s  | 23.7    |
| 87  | large     | 100,100       | find+save   | fast             | 200      | RU error    | 33 items, 3300 kB, 1.34 s  | 24.6    |
| 88  | large     | 100,100       | find+save   | good             | 200      | RU error    | 33 items, 3300 kB, 1.34 s  | 24.6    |
| 89  | large     | 100,100       | find+save   | cheapest         | 200      | RU error    | 5 items, 500 kB, 0.22 s    | 22.7    |
| 90  | large     | 100,100       | find+save   | fourAttemptsOnly | 200      | RU error    | 6 items, 600 kB, 0.27 s    | 22.2    |
| 91  | x-large   | 1000,1000     | update      | fastest          | 100      | 400 -> 1200 | 2 items, 2000 kB, 1.52 s   | 1.3     |
| 92  | x-large   | 1000,1000     | update      | fast             | 100      | 400 -> 700  | 2 items, 2000 kB, 1.02 s   | 2       |
| 93  | x-large   | 1000,1000     | update      | good             | 100      | 400 -> 700  | 2 items, 2000 kB, 1.13 s   | 1.8     |
| 94  | x-large   | 1000,1000     | update      | cheapest         | 100      | 400 -> 700  | 2 items, 2000 kB, 1.85 s   | 1.1     |
| 95  | x-large   | 1000,1000     | update      | fourAttemptsOnly | 100      | 400 -> 700  | 2 items, 2000 kB, 1.65 s   | 1.2     |
| 96  | x-large   | 1000,1000     | update+find | fastest          | 100      | 400 -> 800  | 1 items, 1000 kB, 0.7 s    | 1.4     |
| 97  | x-large   | 1000,1000     | update+find | fast             | 100      | 400 -> 600  | 1 items, 1000 kB, 0.67 s   | 1.5     |
| 98  | x-large   | 1000,1000     | update+find | good             | 100      | 400 -> 600  | 1 items, 1000 kB, 0.63 s   | 1.6     |
| 99  | x-large   | 1000,1000     | update+find | cheapest         | 100      | 400 -> 600  | 1 items, 1000 kB, 0.65 s   | 1.5     |
| 100 | x-large   | 1000,1000     | update+find | fourAttemptsOnly | 100      | 400 -> 600  | 1 items, 1000 kB, 0.64 s   | 1.6     |
| 101 | x-large   | 1000,1000     | find+save   | fastest          | 100      | RU error    | 33 items, 33000 kB, 1.33 s | 24.8    |
| 102 | x-large   | 1000,1000     | find+save   | fast             | 100      | RU error    | 33 items, 33000 kB, 1.33 s | 24.8    |
| 103 | x-large   | 1000,1000     | find+save   | good             | 100      | RU error    | 35 items, 35000 kB, 1.44 s | 24.3    |
| 104 | x-large   | 1000,1000     | find+save   | cheapest         | 100      | RU error    | 32 items, 32000 kB, 1.26 s | 25.4    |
| 105 | x-large   | 1000,1000     | find+save   | fourAttemptsOnly | 100      | RU error    | 34 items, 34000 kB, 1.39 s | 24.5    |
| 106 | x-large   | 1000,1000     | update      | fastest          | 200      | 400 -> 1400 | 2 items, 2000 kB, 1 s      | 2       |
| 107 | x-large   | 1000,1000     | update      | fast             | 200      | 400 -> 800  | 2 items, 2000 kB, 0.73 s   | 2.7     |
| 108 | x-large   | 1000,1000     | update      | good             | 200      | 400 -> 800  | 2 items, 2000 kB, 0.71 s   | 2.8     |
| 109 | x-large   | 1000,1000     | update      | cheapest         | 200      | 400 -> 1000 | 2 items, 2000 kB, 1.8 s    | 1.1     |
| 110 | x-large   | 1000,1000     | update      | fourAttemptsOnly | 200      | 400 -> 1000 | 2 items, 2000 kB, 1.62 s   | 1.2     |
| 111 | x-large   | 1000,1000     | update+find | fastest          | 200      | 400 -> 1000 | 1 items, 1000 kB, 0.57 s   | 1.8     |
| 112 | x-large   | 1000,1000     | update+find | fast             | 200      | 400 -> 800  | 1 items, 1000 kB, 0.62 s   | 1.6     |
| 113 | x-large   | 1000,1000     | update+find | good             | 200      | 400 -> 800  | 1 items, 1000 kB, 0.64 s   | 1.6     |
| 114 | x-large   | 1000,1000     | update+find | cheapest         | 200      | 400 -> 800  | 1 items, 1000 kB, 0.64 s   | 1.6     |
| 115 | x-large   | 1000,1000     | update+find | fourAttemptsOnly | 200      | 400 -> 800  | 1 items, 1000 kB, 0.62 s   | 1.6     |
| 116 | x-large   | 1000,1000     | find+save   | fastest          | 200      | RU error    | 34 items, 34000 kB, 1.39 s | 24.5    |
| 117 | x-large   | 1000,1000     | find+save   | fast             | 200      | RU error    | 35 items, 35000 kB, 1.46 s | 24      |
| 118 | x-large   | 1000,1000     | find+save   | good             | 200      | RU error    | 31 items, 31000 kB, 1.26 s | 24.6    |
| 119 | x-large   | 1000,1000     | find+save   | cheapest         | 200      | RU error    | 31 items, 31000 kB, 1.19 s | 26.1    |
| 120 | x-large   | 1000,1000     | find+save   | fourAttemptsOnly | 200      | 400 -> 600  | 33 items, 33000 kB, 1.47 s | 22.4    |
| 121 | mixed     | 2,10,100,1000 | update      | fastest          | 100      | 400 -> 1200 | 5 items, 1114 kB, 1.48 s   | 3.4     |
| 122 | mixed     | 2,10,100,1000 | update      | fast             | 100      | 400 -> 800  | 5 items, 1114 kB, 1.42 s   | 3.5     |
| 123 | mixed     | 2,10,100,1000 | update      | good             | 100      | 400 -> 800  | 5 items, 1114 kB, 1.6 s    | 3.1     |
| 124 | mixed     | 2,10,100,1000 | update      | cheapest         | 100      | 400 -> 700  | 5 items, 1114 kB, 1.85 s   | 2.7     |
| 125 | mixed     | 2,10,100,1000 | update      | fourAttemptsOnly | 100      | 400 -> 700  | 5 items, 1114 kB, 1.63 s   | 3.1     |
| 126 | mixed     | 2,10,100,1000 | update+find | fastest          | 100      | 400 -> 1000 | 4 items, 1112 kB, 1.18 s   | 3.4     |
| 127 | mixed     | 2,10,100,1000 | update+find | fast             | 100      | 400 -> 700  | 4 items, 1112 kB, 1.04 s   | 3.8     |
| 128 | mixed     | 2,10,100,1000 | update+find | good             | 100      | 400 -> 700  | 4 items, 1112 kB, 1.18 s   | 3.4     |
| 129 | mixed     | 2,10,100,1000 | update+find | cheapest         | 100      | 400 -> 700  | 4 items, 1112 kB, 1.88 s   | 2.1     |
| 130 | mixed     | 2,10,100,1000 | update+find | fourAttemptsOnly | 100      | 400 -> 700  | 4 items, 1112 kB, 1.67 s   | 2.4     |
| 131 | mixed     | 2,10,100,1000 | find+save   | fastest          | 100      | RU error    | 35 items, 9008 kB, 1.46 s  | 24      |
| 132 | mixed     | 2,10,100,1000 | find+save   | fast             | 100      | RU error    | 31 items, 7896 kB, 1.19 s  | 26.1    |
| 133 | mixed     | 2,10,100,1000 | find+save   | good             | 100      | RU error    | 25 items, 6674 kB, 1.05 s  | 23.8    |
| 134 | mixed     | 2,10,100,1000 | find+save   | cheapest         | 100      | RU error    | 31 items, 7896 kB, 1.18 s  | 26.3    |
| 135 | mixed     | 2,10,100,1000 | find+save   | fourAttemptsOnly | 100      | RU error    | 33 items, 8898 kB, 1.33 s  | 24.8    |
| 136 | mixed     | 2,10,100,1000 | update      | fastest          | 200      | 400 -> 1600 | 5 items, 1114 kB, 1.13 s   | 4.4     |
| 137 | mixed     | 2,10,100,1000 | update      | fast             | 200      | 400 -> 1000 | 5 items, 1114 kB, 1.08 s   | 4.6     |
| 138 | mixed     | 2,10,100,1000 | update      | good             | 200      | 400 -> 1000 | 5 items, 1114 kB, 1.21 s   | 4.1     |
| 139 | mixed     | 2,10,100,1000 | update      | cheapest         | 200      | 400 -> 1000 | 5 items, 1114 kB, 1.86 s   | 2.7     |
| 140 | mixed     | 2,10,100,1000 | update      | fourAttemptsOnly | 200      | 400 -> 1000 | 5 items, 1114 kB, 1.65 s   | 3       |
| 141 | mixed     | 2,10,100,1000 | update+find | fastest          | 200      | 400 -> 1600 | 4 items, 1112 kB, 1.14 s   | 3.5     |
| 142 | mixed     | 2,10,100,1000 | update+find | fast             | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.05 s   | 3.8     |
| 143 | mixed     | 2,10,100,1000 | update+find | good             | 200      | 400 -> 1200 | 4 items, 1112 kB, 1.55 s   | 2.6     |
| 144 | mixed     | 2,10,100,1000 | update+find | cheapest         | 200      | 400 -> 1000 | 4 items, 1112 kB, 1.84 s   | 2.2     |
| 145 | mixed     | 2,10,100,1000 | update+find | fourAttemptsOnly | 200      | 400 -> 800  | 4 items, 1112 kB, 1.29 s   | 3.1     |
| 146 | mixed     | 2,10,100,1000 | find+save   | fastest          | 200      | RU error    | 33 items, 8898 kB, 1.32 s  | 25      |
| 147 | mixed     | 2,10,100,1000 | find+save   | fast             | 200      | RU error    | 24 items, 6672 kB, 0.95 s  | 25.3    |
| 148 | mixed     | 2,10,100,1000 | find+save   | good             | 200      | RU error    | 31 items, 7896 kB, 1.2 s   | 25.8    |
| 149 | mixed     | 2,10,100,1000 | find+save   | cheapest         | 200      | RU error    | 32 items, 8896 kB, 1.27 s  | 25.2    |
| 150 | mixed     | 2,10,100,1000 | find+save   | fourAttemptsOnly | 200      | RU error    | 33 items, 8898 kB, 1.31 s  | 25.2    |

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
