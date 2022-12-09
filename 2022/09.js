const args = process.argv;
const utils = require('./utils');

const moves = utils
    .read(args[2])
    .map((r) => r.split(' '))
    .flatMap(([d, n]) => new Array(Number(n)).fill(utils.coord.directionToDelta(d)));

const solve = (num) => {
    const visited = new Set(['0,0']);
    const knots = new Array(Number(num)).fill().map(() => ({x: 0, y: 0}));

    for (const move of moves) {
        utils.coord.add(knots[0], move);

        for (let i = 1; i < knots.length; i++) {
            const diff = {...knots[i - 1]};
            utils.coord.sub(diff, knots[i]);

            if (Math.abs(diff.x) > 1 || Math.abs(diff.y) > 1) {
                utils.coord.add(knots[i], {
                    x: utils.compareTo(knots[i - 1].x, knots[i].x),
                    y: utils.compareTo(knots[i - 1].y, knots[i].y)
                });

                if (i === knots.length - 1) {
                    visited.add(`${knots[i].x},${knots[i].y}`);
                }
            }
        }
    }

    return visited;
}

const part1 = () => {
    return solve(2).size;
};

const part2 = () => {
    return solve(10).size;
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
