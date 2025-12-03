const args = process.argv;
const { inputs, lists } = require('./utils');

const input = inputs
    .read(args[2])
    .map((row) => row.split(''));

const solve = (nBatteries = 2) => {
    return input.map((bank) => {
        const joltage = [];
        let start = 0;
        for (let i = 1; i <= nBatteries; i++) {
            const end = bank.length - (nBatteries - i);
            const slice = bank.slice(start, end);
            const maxIndex = lists.indexOfMax(slice);
            joltage.push(slice[maxIndex]);
            start += maxIndex + 1;
        }

        return Number(joltage.join(''));
    }).reduce((acc, curr) => acc + curr, 0);
};

if (!args[3] || args[3] === '1') {
    console.log(solve());
} else {
    console.log(solve(12));
}
