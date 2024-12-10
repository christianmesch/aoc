const args = process.argv;
const { inputs, grids, MSet, Point } = require('./utils');

const map = inputs
    .read(args[2])
    .map((row, y) => row.split('')
        .map((v, x) => ({ point: new Point([x, y]), val: Number(v) })));

const zeroes = map.flatMap((row) => row.filter((p) => p.val === 0));

const solve = (curr) => {
    if (curr.val === 9) return curr;

    return grids.adjacent(map, curr.point)
        .filter((n) => n.val - curr.val === 1)
        .flatMap((n) => solve(n));
};

const part1 = () => {
    return zeroes.map(solve)
        .map((ends) => new MSet(ends.map((end) => end.point)))
        .map((ends) => ends.size())
        .reduce((acc, curr) => acc + curr, 0);
};

const part2 = () => {
    return zeroes.map(solve)
        .map((ends) => ends.length)
        .reduce((acc, curr) => acc + curr, 0);
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
