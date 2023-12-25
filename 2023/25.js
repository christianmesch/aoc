const args = process.argv;
const { inputs, PriorityQueue, math } = require('./utils');

const neighbors = new Map();

inputs.read(args[2])
    .forEach((line) => {
        const split = line.split(': ');

        const an = neighbors.has(split[0]) ? neighbors.get(split[0]) : [];
        split[1].split(' ').forEach((b) => {
            an.push(b);

            const bn = neighbors.has(b) ? neighbors.get(b) : [];
            bn.push(split[0]);

            neighbors.set(b, bn);
        });

        neighbors.set(split[0], an);
    });


const path = (from, to) => {
    const dist = new Map();
    const prev = new Map();
    const vis = new Set();
    const queue = new PriorityQueue(([, a], [, b]) => a - b);

    queue.enqueue([from, 0]);

    while (!queue.isEmpty()) {
        const [n, d] = queue.dequeue();

        if (to && n === to) break;

        neighbors.get(n).filter((v) => !vis.has(v)).forEach((v) => {
            vis.add(v);
            const alt = d + 1;
            const vDist = dist.has(v) ? dist.get(v) : Number.MAX_SAFE_INTEGER;
            if (alt < vDist) {
                dist.set(v, alt);
                prev.set(v, n);

                if (!queue.has((value) => value[0] === v)) queue.enqueue([v, alt]);
            }
        });
    }

    if (to) {
        const res = [];
        let curr = to;

        while (curr !== from) {
            const p = prev.get(curr);
            res.push([curr, p]);
            curr = p;
        }

        return res;
    }

    return vis.size;
}

const part1 = () => {
    const nodes = [...neighbors].map(([k]) => k);
    const res = [];

    for (let i = 0; i < 100; i++) {
        const from = nodes[math.randomInt(0, nodes.length)];
        const to = nodes[math.randomInt(0, nodes.length)];

        res.push(path(from, to));
    }

    const connections = res.flatMap((v) => v);

    [...connections.reduce((acc, [l, r]) => {
        const key = `${l}${r}`;
        const rKey = `${r}${l}`;
        if (acc.has(key)) {
            acc.set(key, acc.get(key) + 1);
        } else if (acc.has(rKey)) {
            acc.set(rKey, acc.get(rKey) + 1);
        } else {
            acc.set(key, 1);
        }

        return acc;
    }, new Map())].sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .forEach(([k]) => {
        const l = k.slice(0, 3);
        const r = k.slice(3, 6);
        neighbors.set(l, neighbors.get(l).filter((v) => v !== r));
        neighbors.set(r, neighbors.get(r).filter((v) => v !== l));
    });

    const size = path(nodes[0]);
    return size * (nodes.length - size);
};

const part2 = () => {

};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
