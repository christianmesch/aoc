const args = process.argv;
const { inputs } = require('./utils');

const input = inputs
    .read(args[2])[0]
    .split('')
    .map(Number)
    .map((v, i) => ({
        original: v,
        roomLeft: i % 2 ? v : 0,
        vals: i % 2 ? [] : new Array(v).fill(i / 2)
    }));

const part1 = () => {
    let r = input.length - 1;
    let right = input[r];
    for (let l = 1; l < r; l += 2) {
        const left = input[l];
        while (left.roomLeft) {
            if (!right.vals.length) {
                r -= 2;
                right = input[r];

                if (r < l) break;
            }

            left.vals.push(right.vals.pop());
            left.roomLeft--;
        }
    }

    return input.flatMap((v) => v.vals)
        .reduce((acc, curr, i) => acc + i * curr, 0);
};

const part2 = () => {
    for (let r = input.length - 1; r > 0; r -= 2) {
        const right = input[r];
        for (let l = 0; l < r; l++) {
            const left = input[l];
            if (left.roomLeft >= right.original) {
                left.vals.push(...right.vals);
                right.vals = [];
                right.roomLeft = right.original;
                left.roomLeft -= right.original;
                break;
            }
        }
    }

    return input.flatMap((v) => {
        if (v.roomLeft) v.vals.push(...new Array(v.roomLeft).fill('.'));
        return v.vals;
    }).reduce((acc, curr, i) => curr !== '.' ? acc + i * curr : acc, 0);
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
