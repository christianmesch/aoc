const args = process.argv;
const { inputs, grids, lists } = require('./utils');

const input = inputs
    .read(args[2]).map((row) => row.split(''));

const bounds = grids.toBounds(input);

const getXMAS = (input, [x, y]) => {
    return [
        bounds.max[0] >= x + 3 ? `${input[y][x]}${input[y][x + 1]}${input[y][x + 2]}${input[y][x + 3]}` : '',
        bounds.min[0] <= x - 3 ? `${input[y][x]}${input[y][x - 1]}${input[y][x - 2]}${input[y][x - 3]}` : '',
        bounds.max[1] >= y + 3 ? `${input[y][x]}${input[y + 1][x]}${input[y + 2][x]}${input[y + 3][x]}` : '',
        bounds.min[1] <= y - 3 ? `${input[y][x]}${input[y - 1][x]}${input[y - 2][x]}${input[y - 3][x]}` : '',
        bounds.max[0] >= x + 3 && bounds.max[1] >= y + 3 ? `${input[y][x]}${input[y + 1][x + 1]}${input[y + 2][x + 2]}${input[y + 3][x + 3]}` : '',
        bounds.min[0] <= x - 3 && bounds.max[1] >= y + 3 ? `${input[y][x]}${input[y + 1][x - 1]}${input[y + 2][x - 2]}${input[y + 3][x - 3]}` : '',
        bounds.max[0] >= x + 3 && bounds.min[1] <= y - 3 ? `${input[y][x]}${input[y - 1][x + 1]}${input[y - 2][x + 2]}${input[y - 3][x + 3]}` : '',
        bounds.min[0] <= x - 3 && bounds.min[1] <= y - 3 ? `${input[y][x]}${input[y - 1][x - 1]}${input[y - 2][x - 2]}${input[y - 3][x - 3]}` : '',
    ];
};

const getMAS = (input, [x, y]) => {
    return x > 0 && x < bounds.max[0] && y > 0 && y < bounds.max[1] ? [
        `${input[y - 1][x - 1]}${input[y][x]}${input[y + 1][x + 1]}`,
        `${input[y + 1][x - 1]}${input[y][x]}${input[y - 1][x + 1]}`
    ] : [];
};

const part1 = () => {
    return input.flatMap((row, y) => lists.findAllIndexes(row, 'X').map((x) => [x, y]))
        .flatMap((point) => getXMAS(input, point))
        .filter((str) => str === 'XMAS' || str === 'SAMX')
        .length;
};

const part2 = () => {
    return input.flatMap((row, y) => lists.findAllIndexes(row, 'A').map((x) => [x, y]))
        .map((point) => getMAS(input, point))
        .filter((arr) => arr.length && arr.every((str) => str === 'MAS' || str === 'SAM'))
        .length;
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
