const args = process.argv;
const utils = require('./utils');

const input = utils
    .readInt(args[2])
    .map((v) => ({
        n: null,
        p: null,
        v
    }))
    .map((v, i, arr) => {
        v.p = i === 0 ? arr.at(-1) : arr.at(i - 1);
        v.n = i === arr.length - 1 ? arr.at(0) : arr.at(i + 1);

        return v;
    });

const zero = input.find((v) => v.v === 0);

const moveNPos = (pointer, n) => {
    let p = pointer;
    for (let i = 0; i < Math.abs(n); i++) {
        p = n > 0 ? p.n : p.p;
    }

    return p;
};

const mix = (order, rounds = 1, key = 1) => {
    order.forEach((v) => v.v *= key);

    for (let round = 0; round < rounds; round++) {
        for (const curr of input) {
            const moves = curr.v % (input.length - 1);
            if (moves === 0) continue;

            let newPos = curr;

            curr.n.p = curr.p;
            curr.p.n = curr.n;

            if (moves < 0) newPos = newPos.p;
            for (let i = 0; i < Math.abs(moves); i++) {
                newPos = moves > 0 ? newPos.n : newPos.p;
            }

            curr.p = newPos;
            curr.n = newPos.n;

            newPos.n.p = curr;
            newPos.n = curr;
        }
    }
}

const part1 = () => {
    mix(input);

    return [
        moveNPos(zero, 1000 % input.length),
        moveNPos(zero, 2000 % input.length),
        moveNPos(zero, 3000 % input.length)
    ].reduce((acc, curr) => acc + curr.v, 0);
};

const part2 = () => {
    mix(input, 10, 811589153);

    return [
        moveNPos(zero, 1000 % input.length),
        moveNPos(zero, 2000 % input.length),
        moveNPos(zero, 3000 % input.length)
    ].reduce((acc, curr) => acc + curr.v, 0);
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
