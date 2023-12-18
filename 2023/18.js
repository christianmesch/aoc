const args = process.argv;
const { inputs, points, Point } = require('./utils');

const point = [new Point([0, 0]), new Point([0, 0])];

const input = inputs
    .read(args[2])
    .map((line) => {
        const [, d0, s0, h1, d1] = line.match(/(\w)\s(\d+)\s+\(\#(\w{5})(\w{1})\)/);
        const s1 = parseInt(h1, 16);
        return {
            v: [
                point[0].move(points.directionToDelta(d0, Number(s0))).copy(),
                point[1].move(points.directionToDelta(d1, s1)).copy()
            ],
            s: [Number(s0), s1]
        };
    });

const run = (idx = 0) => {
    const area = points.shoelace(input.map((p) => p.v[idx]));
    const b = input.map((p) => p.s[idx]).reduce((acc, curr) => acc + curr, 0);
    const i = area + 1 - (b / 2);
    return b + i;
};

const part1 = () => {
    return run();
};

const part2 = () => {
    return run(1);
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
