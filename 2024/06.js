const args = process.argv;
const { inputs, grids, Point, MSet, MMap } = require('./utils');

const map = inputs
    .read(args[2]).map((row) => row.split(''));

const guardStart = {
    p: map.flatMap((row, y) => row.map((v, x) => v === '^' ? new Point([x, y]) : null))
        .filter((v) => v !== null)[0],
    d: new Point([0, -1])
};

const visited = new MMap();
visited.set(guardStart.p.copy(), [guardStart.d.copy()]);

const obstructions = new MSet();

const bounds = grids.toBounds(map);

const walk = (guard, visited, findLoops = false, obstruction = null) => {
    while (guard.p.isInBounds(bounds, guard.d)) {
        if (map[guard.p.y() + guard.d.y()][guard.p.x() + guard.d.x()] === '#'
            || (obstruction && obstruction.eq(guard.p.add(guard.d)))) {
            guard.d = guard.d.turn('R');
            visited.set(guard.p.copy(), [...visited.get(guard.p), guard.d.copy()]);

            continue;
        }

        if (findLoops && !obstruction) {
            const obs = guard.p.add(guard.d);
            if (!visited.has(obs) && walk({p: guard.p.copy(), d: guard.d.copy()}, visited.copy(), findLoops, obs)) {
                obstructions.add(obs);
            }
        }

        const newPos = guard.p.move(guard.d).copy();
        const dirs = visited.get(newPos);

        if (obstruction && dirs && dirs.some((d) => d.eq(guard.d))) {
            return true;
        }

        visited.set(newPos, dirs ? [...dirs, guard.d.copy()] : [guard.d.copy()]);
    }

    return false;
}

const part1 = () => {
    walk({p: guardStart.p.copy(), d: guardStart.d.copy()}, visited);
    return visited.size();
};

const part2 = () => {
    walk({p: guardStart.p.copy(), d: guardStart.d.copy()}, visited, true);
    return obstructions.size();
}

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
