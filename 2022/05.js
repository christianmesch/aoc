const args = process.argv;
const utils = require('./utils');

const [inp, mov] = utils
    .read(args[2], '\n\n');

const input = inp.split('\n').map((c) => c.split('')); // Rewrote the given input, because easier
const moves = mov.split('\n').map((m) => {
    const [, num, , from, , to] = m.split(' ');
    return [Number(num), Number(from) - 1, Number(to) - 1]; // 0 based index
});


const part1 = () => {
    for (const [num, from, to] of moves) {
        for (let i = 0; i < num; i++) {
            input[to].push(input[from].pop());
        }
    }

    return input.reduce((acc, curr) => acc + curr[curr.length - 1], '');
};

const part2 = () => {
    for (const [num, from, to] of moves) {
        input[to].push(...input[from].splice(-num));
    }

    return input.reduce((acc, curr) => acc + curr[curr.length - 1], '');
};

if (!args[3] || args[3] === '1') {
    console.log(part1(input));
} else {
    console.log(part2(input));
}
