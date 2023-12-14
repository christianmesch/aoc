const args = process.argv;
const { inputs, grids, MSet } = require('./utils');

const grid = grids.rotate(inputs
    .read(args[2]).map((l) => l.split('')), false);

const mset = new MSet();

const moveLine = (line) => {
    const res = new Array(line.length).fill('.');
    for (let i = 0; i < line.length; i++) {
        if (line[i] === '#') res[i] = '#';
        if (line[i] === 'O') {
            let x = i;
            for (; x >= 0 && !['#', 'O'].includes(res[x]); x--);
            res[x + 1] = 'O';
        }
    }

    return res.join('');
};

const lineLoad = (line) => {
    let load = 0;
    for (let i = 0; i < line.length; i++) {
        if (line[i] === 'O') load += line.length - i;
    }
    return load;
}

const findCycle = () => {
    let g = grid;
    for (let r = 0; r < 1000000000; r++) {
        mset.add(g);

        g = grids.rotate(g.map((l) => moveLine(l.join(''))), true);
        g = grids.rotate(g.map((l) => moveLine(l.join(''))), true);
        g = grids.rotate(g.map((l) => moveLine(l.join(''))), true);
        g = grids.rotate(g.map((l) => moveLine(l.join(''))), true);

        if (mset.has(g)) {
            return [r, g];
        }
    }
}

const part1 = () => {
    return grid
        .map((l) => moveLine(l.join('')))
        .map(lineLoad)
        .reduce((acc, curr) => acc + curr, 0);
};

const part2 = () => {
    const [cycle, gCycle] = findCycle();
    const cycleStart = mset.keys().indexOf(gCycle.toString());
    const mod = cycleStart + ((1000000000 - cycleStart) % (cycle - cycleStart + 1));

    return mset.values()[mod]
        .map(lineLoad)
        .reduce((acc, curr) => acc + curr, 0);
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
