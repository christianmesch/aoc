const args = process.argv;
const { inputs, grids, lists } = require('./utils');

const input = inputs.read(args[2]);
const widths = input.at(-1).split(/[\+\*]/).slice(1, -1);

const parsed = input.map((l) => {
    let line = l;
    const res = widths.map((w) => {
        const [a, b] = lists.sliceAt(line, w.length + 1);
        line = b;
        return a;
    });

    return [...res, line].map((r) => r.padEnd(4, ' '));
});

const solve = (second = false) => {
    return grids.rotate(parsed, true)
        .map(([op, ...nums]) => {
            if (!second) return [op, ...nums.map(Number)];

            const rotated = grids.rotate(nums, true)
                .map((n) => Number(n.join('').trim()))
                .filter(Boolean);

            return [op, ...rotated];
        }).map(([op, first, ...nums]) => nums.reduce((acc, curr) =>
                op.trim() === '+' ? acc + curr : acc * curr, first))
        .reduce((acc, curr) => acc + curr, 0);
}

if (!args[3] || args[3] === '1') {
    console.log(solve());
} else {
    console.log(solve(true));
}
