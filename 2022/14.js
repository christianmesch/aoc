const args = process.argv;
const utils = require('./utils');

const input = utils
    .read(args[2])
    .map((l) => l.split(' -> ').map(utils.coord.toCoord).reduce((acc, curr, idx, arr) => {
        if (idx !== 0) {
            acc.push(...utils.coord.expand(arr[idx - 1], curr, false))
        }
        acc.push(curr);
        return acc;
    }, []))

const print = (occupied) => {
    const bounds = utils.coord.getBounds([...occupied].map(([c]) => utils.coord.toCoord(c)));

    for (let y = 0; y <= bounds.max.y; y++) {
        let row = '';
        for (let x = bounds.min.x; x <= bounds.max.x; x++) {
            if (occupied.has(`${x},${y}`)) {
                row += occupied.get(`${x},${y}`);
            } else {
                row += '.';
            }
        }
        console.log(row);
    }
}

const solve = (p2 = false) => {
    const occupied = new Map();
    const bounds = utils.coord.getBounds(input.flat());

    const d = {x: 0, y: 1};
    const dl = {x: -1, y: 1};
    const dr = {x: 1, y: 1};

    input.flat().forEach((c) => occupied.set(utils.coord.toString(c), '#'));

    if (p2) {
        bounds.max.y += 2;
        utils.coord.expand({x: 500 - bounds.max.y, y: bounds.max.y}, {x: 500 + bounds.max.y, y: bounds.max.y})
            .forEach((c) => occupied.set(utils.coord.toString(c), '¤'));
    }

    while (true) {
        const grain = {x: 500, y: 0};

        while (true) {
            const copy = {...grain};

            if (!occupied.has(`${grain.x + d.x},${grain.y + d.y}`)) {
                utils.coord.add(grain, d);
            } else if (!occupied.has(`${grain.x + dl.x},${grain.y + dl.y}`)) {
                utils.coord.add(grain, dl);
            } else if (!occupied.has(`${grain.x + dr.x},${grain.y + dr.y}`)) {
                utils.coord.add(grain, dr);
            }

            if (grain.y >= bounds.max.y || utils.coord.eq(grain, copy)) {
                break;
            }
        }

        if (grain.y < bounds.max.y) {
            occupied.set(utils.coord.toString(grain), 'o');
            if (grain.y === 0) break;
        } else {
            break;
        }
    }

    //print(occupied);
    return [...occupied].filter(([, v]) => v === 'o').length;
};

const part1 = () => {
    return solve();
};

const part2 = () => {
    return solve(true);
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
