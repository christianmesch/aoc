const args = process.argv;
const { inputs, math, Point, lists, sets } = require('./utils');

const distances = inputs
    .read(args[2])
    .map((row) => new Point(row.split(',').map(Number)))
    .reduce((acc, p, i, arr) => {
        if (i === arr.length - 1) return acc;

        arr.slice(i + 1).forEach((p2) => {
            const d = p.euclidean(p2);
            acc.push({dist: d, pair: [p, p2]});
        });

        return acc;
    }, [])
    .sort((a, b) => math.compareTo(a.dist, b.dist));

const solve = (singleCircuit = false) => {
    const circuits = [];

    for (let i = 0; singleCircuit || i < 1000; i++) {
        const connection = distances.shift();
        const indexes = lists.findAllIndexes(circuits, 
            (c) => c.has(connection.pair[0]) || c.has(connection.pair[1]));

        switch (indexes.length) {
            case 0:
                circuits.push(new Set(connection.pair));
            break;
            case 1:
                const c = circuits[indexes[0]];
                c.add(connection.pair[0]);
                c.add(connection.pair[1]);
            break;
            case 2:
                const set = circuits.splice(indexes[1], 1)[0];
                circuits[indexes[0]] = sets.union(circuits[indexes[0]], set);
            break;
        }

        if (circuits.length === 1 && circuits[0].size === 1000) {
            return connection.pair[0].x() * connection.pair[1].x();
        }
    }

    const sizes = circuits.map((c) => c.size).sort((a, b) => b - a);
    return sizes[0] * sizes[1] * sizes[2];
};

if (!args[3] || args[3] === '1') {
    console.log(solve());
} else {
    console.log(solve(true));
}
