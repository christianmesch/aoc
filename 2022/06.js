const args = process.argv;
const utils = require('./utils');

const input = utils
    .read(args[2], '');

const solve = (num) => {
    for (let i = num; i <= input.length; i++) {
        if (new Set(input.slice(i - num, i)).size === num) return i;
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
