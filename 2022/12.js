const args = process.argv;
const utils = require('./utils');

const input = utils
    .read(args[2])
    .map((r, y) => r.split('').map((d, x) => ({
        coord: {x, y},
        data: d,
        height: d === 'S' ? 0 : d === 'E' ? 25 : utils.lists.alpha.indexOf(d)
    })));

const start = input.flat().find((v) => v.data === 'S');
const end = input.flat().find((v) => v.data === 'E');

utils.grid.bfs(input, end,
    (v, c) => c.height - 1 <= v.height);

const part1 = () => {
    return start.distance;
};

const part2 = () => {
    return input.flat()
        .filter((v) => v.data === 'a')
        .map((v) => v.distance)
        .sort((a, b) => a - b)[0];
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
