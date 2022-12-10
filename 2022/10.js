const args = process.argv;
const utils = require('./utils');

let cycle = 1;
let x = 1;

const cycles = utils
    .read(args[2])
    .reduce((acc, curr) => {
        cycle++;
        acc.set(cycle, x);

        if (curr.startsWith('addx')) {
            cycle++;
            x += Number(curr.split(' ')[1]);
            acc.set(cycle, x);
        }

        return acc;
    }, new Map([[1, 1]]));

const draw = (c, x) => {
    if (x - 1 <= c && c <= x + 1) {
        return '#';
    }

    return '.';
}

const part1 = () => {
    return [20, 60, 100, 140, 180, 220]
        .map((c) => c * cycles.get(c))
        .reduce((acc, curr) => acc + curr, 0);
};

const part2 = () => {
    [...cycles].map(([c, x]) => draw((c - 1) % 40, x))
        .reduce((acc, curr, idx) => {
            if (idx % 40 === 0) acc.push([]);
            acc[acc.length - 1].push(curr)
            return acc;
        }, [])
        .map((r) => r.join(''))
        .forEach((r) => console.log(r));
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    part2();
}
