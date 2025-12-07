const args = process.argv;
const { inputs, grids, Point, Cache } = require('./utils');

const input = inputs
    .read(args[2]).map((row) => row.split(''));

const start = new Point([
    input[0].findIndex((v) => v === 'S'),
    0
]);

const bounds = grids.toBounds(input);
const mem = new Cache();

const solve = (beam) => {
    for (; beam.isInBounds(bounds) && input[beam.y()][beam.x()] !== '^'; beam.move([0, 1]));

    if (!beam.isInBounds(bounds)) return 1;

    return mem.getOrCompute(beam, 
        () => solve(beam.add([-1, 0])) + solve(beam.add([1, 0])));
}

if (!args[3] || args[3] === '1') {
    solve(start)
    console.log(mem.size())
} else {
    console.log(solve(start));
}
