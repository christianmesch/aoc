const args = process.argv;
const { inputs, Point, MSet } = require('./utils');

const map = inputs
    .read(args[2]);

const start = map.map((row, y) => {
    const x = row.indexOf('S');
    if (x !== -1) return new Point([x, y]);
    return null;
}).find((v) => v);

const move = (s, steps) => {
    const queue = [[s, 0]];
    const visited = new MSet(s);
    let canReach = 0;

    while (queue.length) {
        const [curr, step] = queue.shift();
        if (step > steps) break;

        if (step % 2 === steps % 2) canReach++;

        curr.adjacent()
            .filter((a) => map.at(a.y() % map.length).at(a.x() % map.length) !== '#')
            .forEach((a) => {
                if (!visited.has(a)) {
                    visited.add(a);
                    queue.push([a, step + 1]);
                }
            });
    }

    return canReach;
};

const part1 = () => {
    return move(start, 64);
};

const part2 = () => {
    const steps = 26501365;
    const mod = steps % map.length;

    const y1 = move(start, mod);
    const y2 = move(start, mod + map.length);
    const y3 = move(start, mod + 2 * map.length);

    const x = Math.floor(steps / map.length);
    const a = (y3 - 2 * y2 + y1) / 2;
    const b = (4 * y2 - 3 * y1 - y3) / 2;
    const c = y1;

    return a * x * x + b * x + c;
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
