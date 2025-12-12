const args = process.argv;
const { inputs } = require('./utils');

const input = inputs.read(args[2], '\n\n').at(-1)
    .split('\n')
    .map((row) => {
        const [grid, nums] = row.split(': ');
        return {
            g: grid.split('x').map(Number),
            n: nums.split(' ').map(Number).reduce((acc, curr) => acc + curr, 0)
        }
    });

const part1 = () => {
    return input.filter((grid) => {
        const n = Math.floor(grid.g[0] / 3) * Math.floor(grid.g[1] / 3);
        return n >= grid.n;
    }).length;
};

const part2 = () => {
    return 'Wohoo!';
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
