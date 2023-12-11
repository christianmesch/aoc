const args = process.argv;
const { inputs, grids, Point } = require('./utils');

const universe = inputs
    .read(args[2])
    .map((row) => row.split(''));

const emptyRows = universe.map((row, i) => [row, i])
    .filter(([row]) => !row.includes('#'))
    .map(([, i]) => i);

const emptyColumns = grids.allColumns(universe).map((col, i) => [col, i])
    .filter(([col]) => !col.includes('#'))
    .map(([, i]) => i);

const solve = (times) => universe.flatMap((row, y) => 
    row.flatMap((v, x) => {
        if (v === '#') return [
            new Point([
                x + (emptyColumns.filter((r) => r < x).length * (times - 1)), 
                y + (emptyRows.filter((c) => c < y).length * (times - 1))
            ])
        ];
        return [];
    })).map((g, ci, arr) => {
        let d = 0;
        for (let i = ci + 1; i < arr.length; i++) {
            d += g.manhattan(arr[i]);
        }
        return d;
    }).reduce((acc, curr) => acc + curr, 0);

if (!args[3] || args[3] === '1') {
    console.log(solve(2));
} else {
    console.log(solve(1000000));
}
