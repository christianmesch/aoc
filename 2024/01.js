const args = process.argv;
const { inputs } = require('./utils');

const input = inputs
    .read(args[2])
    .map((row) => row.split(/\s+/))
    .reduce((acc, curr) => {
        acc[0].push(Number(curr[0]));
        acc[1].push(Number(curr[1]));
        return acc;
    }, [[], []]);

input[0].sort();
input[1].sort();

const part1 = (input) => {
    return input[0].map((row, i) => Math.abs(row - input[1][i]))
        .reduce((acc, curr) => acc + curr, 0);
};

const part2 = (input) => {
    return input[0]
        .map((row) => row * input[1].reduce((acc, curr) => curr === row ? ++acc : acc, 0))
        .reduce((acc, curr) => acc + curr, 0);
};

if (!args[3] || args[3] === '1') {
    console.log(part1(input));
} else {
    console.log(part2(input));
}
