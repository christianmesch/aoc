const args = process.argv;
const { inputs, PriorityQueue, Point, Cache } = require('./utils');

const heatmap = inputs
    .read(args[2]).map((line) => line.split('').map(Number));

const bounds = { min: [0, 0], max: [heatmap[0].length - 1, heatmap.length - 1] };
const end = new Point(bounds.max);

const pq = new PriorityQueue((a, b) => a.h - b.h);
const mem = new Cache();

const run = (minS = 1, maxS = 3) => {
    pq.enqueue({ p: new Point([1, 0]), d: new Point([1, 0]), h: heatmap[0][1], s: 1 });
    pq.enqueue({ p: new Point([0, 1]), d: new Point([0, 1]), h: heatmap[1][0], s: 1 });

    while (!pq.isEmpty()) {
        const curr = pq.dequeue();

        if (curr.p.eq(end)) return curr.h;

        const memKey = [curr.p, curr.d, curr.s];
        if (mem.has(memKey)) {
            if (mem.get(memKey) <= curr.h) continue;
        }
        mem.set(memKey, curr.h);


        if (curr.s >= minS) {
            [curr.d.turn('L'), curr.d.turn('R')].forEach((newD) => {
                const newP = curr.p.add(newD);
                if (newP.isInBounds(bounds)) {
                    pq.enqueue({
                        p: newP,
                        d: newD,
                        h: curr.h + heatmap[newP.y()][newP.x()],
                        s: 1
                    });
                }
            });
        }


        if (curr.s < maxS) {
            const newP = curr.p.add(curr.d);
            if (newP.isInBounds(bounds)) {
                pq.enqueue({
                    p: newP,
                    d: curr.d,
                    h: curr.h + heatmap[newP.y()][newP.x()],
                    s: curr.s + 1
                });
            }
        }
    }
};

const part1 = () => {
    return run();
};

const part2 = () => {
    return run(4, 10);
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
