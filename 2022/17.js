const args = process.argv;
const utils = require('./utils');

const input = utils
    .read(args[2], '')
    .map((d) => utils.coord.directionToDelta(d));

const shapes = [
    [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}], // -
    [{x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 2}], // +
    [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}], // ⅃
    [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 0, y: 3}], // |
    [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}], // ■
];

const willCollide = (shape, chamber, delta) => {
    return shape.map((s) => utils.coord.add(s, delta, true))
        .some((s) => {
            if (s.x < 0 || s.x > 6) return true;
            for (let i = chamber.length - 1; i >= Math.max(0, chamber.length - 100); i--) {
                if (utils.coord.eq(chamber.at(i), s)) return true;
            }

            return false;
        });
};

const downDelta = utils.coord.directionToDelta('V');

const solve = (rounds) => {
    const chamber = utils.coord.expand({x: 0, y: 0}, {x: 6, y: 0});
    const mem = new Map();
    const cycle = {rounds: 0, height: 0, simulateRounds: rounds, addCycles: 0};
    let top = 0;
    let j = 0;

    for (let round = 0; round < cycle.simulateRounds; round++) {
        chamber.splice(0, chamber.length - 100);

        const topRow = chamber.filter((c) => c.y === top).map((c) => c.x).join(',');
        const hash = `${j},${round % 5},${topRow}`;
        if (mem.has(hash)) {
            const prev = mem.get(hash);
            cycle.rounds = round - prev.round;
            cycle.height = top - prev.top;
            cycle.simulateRounds = (rounds % cycle.rounds) + 2 * cycle.rounds;
            cycle.addCycles = (rounds - cycle.simulateRounds) / cycle.rounds;
        } else {
            mem.set(hash, {round: round, top: top});
        }

        const shape = shapes.at(round % 5).map((s) => ({...s}))
            .map((s) => utils.coord.add(s, {x: 2, y: top + 4}));

        while (true) {
            const jet = input.at(j);
            j = (j + 1) % input.length;

            if (!willCollide(shape, chamber, jet)) {
                shape.map((s) => utils.coord.add(s, jet));
            }

            if (willCollide(shape, chamber, downDelta)) {
                chamber.push(...shape);
                top = Math.max(top, shape.at(-1).y);
                break;
            } else {
                shape.map((s) => utils.coord.add(s, downDelta));
            }
        }
    }

    return top + cycle.addCycles * cycle.height;
};

const part1 = () => {
    return solve(2022);
}

const part2 = () => {
    return solve(1000000000000);
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
