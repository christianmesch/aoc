const args = process.argv;
const set = require('./utils').set;
const lists = require('./utils').lists;

const input = require('./utils')
    .read(args[2]);

const part1 = (input) => {
    return input
        .map((r) => [r.slice(0, r.length / 2), r.slice(r.length / 2)])
        .map((r) => r.map((c) => new Set(c.split(''))))
        .map((r) => set.intersection(...r))
        .map((i) => alpha.indexOf(...i))
        .reduce((acc, curr) => acc + curr, 0);
};

const part2 = (input) => {
    return input
        .map((r) => new Set(r.split('')))
        .reduce((acc, curr, idx, arr) => {
            if (idx % 3 === 0) {
                return [...acc, [arr[idx], arr[idx + 1], arr[idx + 2]]];
            }

            return acc;
        }, [])
        .map((g) => g.reduce((acc, curr) => set.intersection(acc, curr), new Set(alpha)))
        .map((i) => alpha.indexOf(...i))
        .reduce((acc, curr) => acc + curr, 0);
};

const alpha = [' ', ...lists.alpha, ...lists.alphaUpper];

if (!args[3] || args[3] === '1') {
    console.log(part1(input));
} else {
    console.log(part2(input));
}
