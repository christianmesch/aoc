const args = process.argv;
const { inputs, grids, Point, points, MMap } = require('./utils');

const map = inputs
    .read(args[2]);

const bounds = grids.toBounds(map);
const visited = grids.fromBounds(bounds, () => false);

const start = new Point([1, 0]);
const end = new Point([bounds.max[0] - 1, bounds.max[1]]);

const graph = new MMap();

const prune = (second = false) => {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            const curr = new Point([x, y]);
            let neighbors;

            const tile = map[y][x] === '#' ? '#' : second ? '.' : map[y][x];

            switch (tile) {
                case '#': continue;
                case '.':
                    neighbors = curr.adjacent()
                        .filter((a) => a.isInBounds(bounds) && map[a.y()][a.x()] !== '#');
                    break;
                case '^':
                    neighbors = [curr.add([0, -1])];
                    break;
                case 'v':
                    neighbors = [curr.add([0, 1])];
                    break;
                case '<':
                    neighbors = [curr.add([-1, 0])];
                    break;
                case '>':
                    neighbors = [curr.add([1, 0])];
                    break;
            }

            const val = graph.has(curr) ? graph.get(curr) : [];
            neighbors.forEach((n) => val.push([n, 1]));
            graph.set(curr, val);
        }
    }

    const twos = graph.entries().filter(([, n]) => n.length === 2)
        .map(([p]) => p);

    for (const p of twos) {
        const [[np1, nw1], [np2, nw2]] = graph.delete(p);

        const n1 = graph.get(np1);
        if (n1) {
            const n1idx = n1.findIndex(([n]) => n.eq(p));
            if (n1idx !== -1) {
                n1[n1idx] = [np2, nw1 + nw2];
            }
        }

        const n2 = graph.get(np2);
        if (n2) {
            const n2idx = n2.findIndex(([n]) => n.eq(p));
            if (n2idx !== -1) {
                n2[n2idx] = [np1, nw1 + nw2];
            }
        }
    }
}

const walk = (curr, vis, dis) => {
    if (curr.eq(end)) return dis;

    vis[curr.y()][curr.x()] = true;
    const max = graph.get(curr).filter(([n]) => !vis[n.y()][n.x()])
        .map(([n, w]) => walk(n, vis, dis + w))
        .sort((a, b) => b - a)[0];
    vis[curr.y()][curr.x()] = false;

    return max ? max : 0;
}

const part1 = () => {
    prune();
    return walk(start, visited, 0);
};

const part2 = () => {
    prune(true);
    return walk(start, visited, 0);
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
