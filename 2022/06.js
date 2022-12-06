const args = process.argv;
const utils = require('./utils');

const input = utils
    .read(args[2], '');

const solve = (num) => {
    for (let i = num; i <= input.length; i++) {
        if (input.slice(i - num, i)
            .every((val, idx, arr) => arr.filter((val2) => val === val2).length === 1)) {
            return i;
        }
    }
}

const part1 = () => {
    return solve(4);
};

const part2 = () => {
    return solve(14);
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
