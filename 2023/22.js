const args = process.argv;
const { inputs, Point } = require('./utils');

const bricks = inputs
    .read(args[2])
    .map((line, i) => {
        const m = line.match(/(.+),(.+),(.+)~(.+),(.+),(.+)/).slice(1, 7).map(Number);
        const a = new Point(m.slice(0, 3));
        const b = new Point(m.slice(3, 6));

        const d = b.remove(a).toDelta();

        const brick = [a, b];
        for (let tmp = a.add(d); !tmp.eq(b); tmp = tmp.add(d)) {
            brick.push(tmp);
        }

        return {
            id: i,
            brick: brick.sort((a, b) => a.z() - b.z() || a.x() - b.x() || a.y() - b.y())
        };
    }).sort(({ brick: [a]}, { brick: [b] }) => a.z() - b.z() || a.x() - b.x() || a.y() - b.y());

const delta = new Point([0, 0, -1]);
const settled = [];
const restingOn = new Map();

bricks.forEach((b, i) => {
    let curr;
    let prev = b.brick;
    while (true) {
        if (prev[0].z() === 1) break;

        curr = prev.map((p) => p.add(delta));
        const collisions = settled.filter((s) => s.brick.some((sp) => curr.some((cp) => cp.eq(sp))));
        
        if (collisions.length) {
            restingOn.set(b.id, collisions.map((c) => c.id));
            break;
        }
        
        prev = curr;
    }

    settled.push({ id: b.id, brick: prev });
});

const part1 = () => {
    const rest = new Set([...restingOn].filter(([, v]) => v.length === 1).flatMap(([, v]) => v));
    
    return bricks.length - rest.size;
};

const part2 = () => {
    let tot = 0;
    for (const brick of settled) {
        const fallen = new Set([brick.id]);
        let newFall = true;
        let copy = [...restingOn].filter(([, v]) => v.length);
        while(newFall) {
            newFall = false;
            copy = copy.map(([k, v]) => [k, v.filter((vv) => !fallen.has(vv))]);

            const newFalls = copy.filter(([, v]) => v.length === 0);
            if (newFalls.length) {
                newFall = true;
                newFalls.forEach(([k]) => fallen.add(k));
            }

            copy = copy.filter(([, v]) => v.length);
        }

        tot += fallen.size - 1;
    } 

    return tot;
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
