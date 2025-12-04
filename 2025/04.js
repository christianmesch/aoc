const args = process.argv;
const { inputs, grids, Point } = require('./utils');

const grid = inputs
    .read(args[2])
    .map((row) => row.split(''));

const solve = (remove = false) => {
    let removed = 0;
    let rolls;

    do {
        rolls = grid.flatMap((row, y) => row.map((val, x) => {
            if (val !== '@') return null;
            const neighbors = grids.adjacent(grid, new Point([x, y]), true)
                .filter((n) => n === '@').length;
            
            return neighbors < 4 ? [x, y] : null;
        })).filter(Boolean);

        rolls.forEach(([x, y]) => grid[y][x] = 'x');
        removed += rolls.length;
    } while (remove && rolls.length);

    return removed;
};

if (!args[3] || args[3] === '1') {
    console.log(solve());
} else {
    console.log(solve(true));
}
