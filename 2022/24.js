const args = process.argv;
const utils = require('./utils');

const initGrid = utils
    .read(args[2])
    .map((r) => r.split('').map((v) => v === '#' ? v : v === '.' ? [] : [v]));

const grids = new Map();
grids.set(0, initGrid);

const maxGrids = utils.lcm(initGrid[0].length - 2, initGrid.length - 2)

const start = {x: 1, y: 0};
const end = {x: initGrid[0].length - 2, y: initGrid.length - 1};

const getGrid = (round) => {
    const gridNum = round % maxGrids;
    if (grids.has(gridNum)) {
        return grids.get(gridNum);
    }

    const prevGrid = getGrid(round - 1);
    const newGrid = new Array(initGrid.length).fill().map(() => new Array(initGrid[0].length).fill().map(() => []));

    prevGrid.forEach((row, y) => {
        row.forEach((v, x) => {
            if (v === '#') {
                newGrid[y][x] = v;
            } else {
                v.forEach((d) => {
                    let newX = x;
                    let newY = y;

                    switch (d) {
                        case '<':
                            newX = x === 1 ? prevGrid[0].length - 2 : x - 1;
                            break;
                        case '>':
                            newX = x === prevGrid[0].length - 2 ? 1 : x + 1;
                            break;
                        case '^':
                            newY = y === 1 ? prevGrid.length - 2 : y - 1;
                            break;
                        case 'v':
                        case 'V':
                            newY = y === prevGrid.length - 2 ? 1 : y + 1;
                            break;
                    }

                    newGrid[newY][newX].push(d);
                });
            }
        });
    });

    grids.set(round, newGrid);

    return newGrid;
};

const solve = (start, end, round = 0) => {
    const queue = [{pos: start, round}];
    const visited = new Set([`${round},${start.x},${start.y}`]);

    while (queue.length) {
        const curr = queue.shift();

        if (utils.coord.eq(curr.pos, end)) {
            return curr.round;
        }

        const grid = getGrid(curr.round + 1);
        const moves = [...utils.coord.adjacentCoords(curr.pos), curr.pos]
            .filter((c) => !visited.has(`${curr.round + 1},${c.x},${c.y}`))
            .filter((c) => c.x >= 1 && c.x <= grid[0].length - 2)
            .filter((c) => (c.y >= 1 && c.y <= grid.length - 2) || utils.coord.eq(c, start) || utils.coord.eq(c, end))
            .filter((c) => !grid[c.y][c.x].length);

        for (const move of moves) {
            visited.add(`${curr.round + 1},${move.x},${move.y}`);
            queue.push({pos: move, round: curr.round + 1});
        }
    }
};

const part1 = () => {
    return solve(start, end);
}

const part2 = () => {
    const first = solve(start, end);
    const second = solve(end, start, first);
    return solve(start, end, second);
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
