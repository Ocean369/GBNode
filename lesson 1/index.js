const colors = require('colors')

let [start, finish] = process.argv.slice(2)
let simpleArr = []


if (isNaN(+start) || isNaN(+finish)) {
    console.log(colors.yellow('ERROR! - Your argument is not number.'))
} else {
    if (+start < 2) { start = '2'; }
    nextPrime:
    for (let i = +start; i <= +finish; i++) { // Для всех i...
        for (let j = 2; j < i; j++) { // проверить, делится ли число..
            if (i % j == 0) continue nextPrime; // не подходит, берём следующее
        }
        simpleArr.push(i); // простое число
    }
    if (simpleArr.length == 0) {
        console.log(colors.red('There are no prime numbers in the given range'));
    } else {
        simpleArr.forEach((val, i) => {
            switch (i % 3) {
                case 0:
                    console.log(colors.green(val));
                    break;
                case 1:
                    console.log(colors.yellow(val));
                    break;
                case 2:
                    console.log(colors.red(val));
                    break;
                default:
                    break;
            }
        });
    }
}