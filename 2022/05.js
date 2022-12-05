const args = process.argv;
const utils = require('./utils');

const [inp, mov] = utils
    .read(args[2], '\n\n');

const input = inp.split('\n');
const seq = utils.range(1, input[input.length - 1].length, 4);

const stacks = input
    .slice(0, input.length - 1)
    .reverse()
    .reduce((acc, curr) => {
        seq.filter((v) => v < curr.length).forEach((val, idx) => {
            const crate = curr[val];
            if (crate !== ' ') acc[idx].push(crate);
        });

        return acc;
    }, new Array(seq.length).fill().map(() => []));

const moves = mov.split('\n').map((m) => {
    const [, num, , from, , to] = m.split(' ');
    return [Number(num), Number(from) - 1, Number(to) - 1]; // 0 based index
});

const part1 = () => {
    for (const [num, from, to] of moves) {
        for (let i = 0; i < num; i++) {
            stacks[to].push(stacks[from].pop());
        }
    }

    return stacks.reduce((acc, curr) => acc + curr[curr.length - 1], '');
};

const part2 = () => {
    for (const [num, from, to] of moves) {
        stacks[to].push(...stacks[from].splice(-num));
    }

    return stacks.reduce((acc, curr) => acc + curr[curr.length - 1], '');
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
