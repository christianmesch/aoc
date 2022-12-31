const args = process.argv;
const utils = require('./utils');

let elves = utils
    .read(args[2])
    .flatMap((r, y) => {
        const arr = [];
        r.split('').forEach((v, x) => {
            if (v === '#') arr.push({x, y});
        });
        return arr;
    });

const proposals = [['N', 'NW', 'NE'], ['S', 'SW', 'SE'], ['W', 'NW', 'SW'], ['E', 'NE', 'SE']];

const directions = new Map();
directions.set('N', {x: 0, y: -1});
directions.set('NE', {x: 1, y: -1});
directions.set('NW', {x: -1, y: -1});
directions.set('E', {x: 1, y: 0});
directions.set('W', {x: -1, y: 0});
directions.set('S', {x: 0, y: 1});
directions.set('SE', {x: 1, y: 1});
directions.set('SW', {x: -1, y: 1});

const solve = (rounds) => {
    for (let round = 0; round < rounds; round++) {
        const newPosElves = [];

        for (const elf of elves) {
            const neighbors = [...directions]
                .map(([d, delta]) =>
                    [d, elves.some((e) => utils.coord.eq(e, utils.coord.add(elf, delta, true)))])
                .reduce((acc, [k, v]) => acc.set(k, v), new Map());

            let newPosElf = elf;
            if (![...neighbors].every(([, v]) => !v)) {
                for (let pi = 0; pi < 4; pi++) {
                    const propose = proposals[(pi + round % 4) % 4];

                    if (propose.every((p) => !neighbors.get(p))) {
                        newPosElf = utils.coord.add(elf, directions.get(propose[0]), true);
                        break;
                    }
                }
            }

            newPosElves.push([elf, newPosElf]);
        }

        if (newPosElves.every(([o, n]) => utils.coord.eq(o, n))) {
            return round + 1;
        }

        const tmp = new Set();
        const duplicates = new Set();

        newPosElves.forEach(([, n]) => {
            const cStr = utils.coord.toString(n);
            if (tmp.has(cStr)) {
                duplicates.add(cStr);
            } else {
                tmp.add(cStr);
            }
        });

        elves = newPosElves.map(([o, n]) => {
            if (duplicates.has(utils.coord.toString(n))) {
                return o;
            }

            return n;
        });
    }
};

const part1 = () => {
    solve(10);
    const bounds = utils.coord.getBounds(elves);
    
    return (bounds.max.y - bounds.min.y + 1) * (bounds.max.x - bounds.min.x + 1) - elves.length;
}

const part2 = () => {
    return solve(Number.MAX_SAFE_INTEGER);
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
