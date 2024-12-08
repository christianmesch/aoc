const args = process.argv;
const { inputs, grids, Point, MSet } = require('./utils');

const input = inputs
    .read(args[2]).map((row) => row.split(''));

const bounds = grids.toBounds(input);

const antennas = input.reduce((acc, curr, y) => {
    curr.forEach((v, x) => {
        if (v !== '.') {
            acc.has(v) ? acc.set(v, [...acc.get(v), new Point([x, y])])
                : acc.set(v, [new Point([x, y])]);
        }
    });

    return acc;
}, new Map());

const solve = (fullLine = false) => [...antennas].reduce((acc, [, ps]) => {
    for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
            const delta = ps[i].remove(ps[j]);

            if (fullLine) acc.addAll([ps[i], ps[j]]);

            let a = ps[i].add(delta);
            while (a.isInBounds(bounds)) {
                acc.add(a);
                a = a.add(delta);
                if (!fullLine) break;
            }

            let b = ps[j].remove(delta);
            while (b.isInBounds(bounds)) {
                acc.add(b);
                b = b.remove(delta);
                if (!fullLine) break;
            }
        }
    }

    return acc;
}, new MSet());

const part1 = () => {
    return solve().size();
};

const part2 = () => {
    return solve(true).size();
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
