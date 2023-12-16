const args = process.argv;
const { inputs, Point, lists, grids } = require('./utils');

const input = inputs
    .read(args[2]).map((line) => line.split(''));

const bounds = {
    min: [0, 0],
    max: [input[0].length - 1, input.length - 1]
};

const changeDirection = (delta, tile) => {
    if (tile === '|') return delta.x() !== 0 ? [new Point([0, 1]), new Point([0, -1])] : [delta];
    if (tile === '-') return delta.y() !== 0 ? [new Point([1, 0]), new Point([-1, 0])] : [delta];
    if (tile === '/') return delta.y() !== 0 ? [new Point([-delta.y(), 0])] : [new Point([0, -delta.x()])];
    if (tile === '\\') return delta.y() !== 0 ? [new Point([delta.y(), 0])] : [new Point([0, delta.x()])];
    return [delta];
};

const move = (point, delta, ener) => {
    if (!point.isInBounds(bounds) || ener[point.y()][point.x()].some((d) => d.eq(delta))) {
        return;
    }

    ener[point.y()][point.x()].push(delta);
    changeDirection(delta, input[point.y()][point.x()]).forEach((d) => move(point.add(d), d, ener));
}

const run = (p, d) => {
    const ener = grids.fromBounds(bounds, () => []);
    move(p, d, ener);

    return ener.flatMap((row) => row.map((c) => c.length ? 1 : 0))
        .reduce((acc, curr) => acc + curr, 0);
}

const part1 = () => {
    return run(new Point([0, 0]), new Point([1, 0]));
};

const part2 = () => {
    const xRange = lists.range(0, bounds.max[0]);
    const yRange = lists.range(0, bounds.max[1]);

    return [
        ...xRange.map((x) => [new Point([x, 0]), new Point([0, 1])]),
        ...xRange.map((x) => [new Point([x, bounds.max[1]]), new Point([0, -1])]),
        ...yRange.map((y) => [new Point([0, y]), new Point([1, 0])]),
        ...yRange.map((y) => [new Point([bounds.max[0], y]), new Point([-1, 0])])
    ].map(([p, d]) => run(p, d)).sort((a, b) => b - a)[0];
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
