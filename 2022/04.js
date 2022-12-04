const args = process.argv;
const utils = require('./utils');

const input = utils.read(args[2])
    .map((p) => p.split(',').map((e) => {
        const range = e.split('-').map(Number);
        return new Set(utils.range(range[0], range[1] + 1));
    }))

const part1 = (input) => {
    return input
        .filter((p) => p[0].size > p[1].size ? utils.set.superset(p[0], p[1]) : utils.set.superset(p[1], p[0]))
        .length;
};

const part2 = (input) => {
    return input
        .filter((p) => utils.set.intersection(p[0], p[1]).size > 0)
        .length;
};

if (!args[3] || args[3] === '1') {
    console.log(part1(input));
} else {
    console.log(part2(input));
}
