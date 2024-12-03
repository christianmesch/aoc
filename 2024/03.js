const args = process.argv;
const { inputs } = require('./utils');

const input = inputs
    .read(args[2]);

const solve = (alwaysCount = true) => {
    let count = true;

    return input
        .flatMap((row) => [...row.matchAll(/(mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don't\(\))/g)])
        .reduce((acc, match) => {
            switch (match[0]) {
                case 'do()': count = true; return acc;
                case "don't()": count = false; return acc;
                default:
                    return alwaysCount || count ? acc + Number(match[2]) * Number(match[3]) : acc;
            }
        }, 0);
};

if (!args[3] || args[3] === '1') {
    console.log(solve(true));
} else {
    console.log(solve(false));
}
