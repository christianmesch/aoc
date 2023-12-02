const args = process.argv;
const { inputs } = require('./utils');

const input = inputs
    .read(args[2])
    .map((game) => {
        let g = game.split(': ');
        let s = g[1].split('; ')
            .map((set) => {
                return set.split(', ')
                    .map((cube) => {
                        let [n, color] = cube.split(' ');
                        return [color, Number(n)];
                    });
            })
            .map((set) => new Map(set));

        return {
            id: Number(g[0].split(' ')[1]),
            sets: s
        };
    }).map((game) => {
        let bound = game.sets.reduce((acc, curr) => {
            for ([c, n] of [...curr]) {
                acc.set(c, Math.max(acc.get(c), n));
            }
            
            return acc;
        }, new Map([['red', 0], ['green', 0], ['blue', 0]]));

        return {
            id: game.id,
            bound
        };
    });

const part1 = () => {
    return input.filter((game) =>
        game.bound.get('red') <= 12 && game.bound.get('green') <= 13 && game.bound.get('blue') <= 14
    ).reduce((acc, curr) => acc + curr.id, 0);
};

const part2 = () => {
    return input.map((game) => [...game.bound].reduce((acc, [, curr]) => acc * curr, 1))
        .reduce((acc, curr) => acc + curr, 0);
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
