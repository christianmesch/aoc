const args = process.argv;
const { inputs, grids, Point, MSet, MMap } = require('./utils');

const map = inputs
    .read(args[2]).map((row) => row.split(''));

const guardStart = {
    p: map.flatMap((row, y) => row.map((v, x) => v === '^' ? new Point([x, y]) : null))
        .filter((v) => v !== null)[0],
    d: new Point([0, -1])
};

const bounds = grids.toBounds(map);

const walk = (guard, obstruction = null) => {
    const visited = new MMap();
    visited.set(guard.p.copy(), [guard.d.copy()]);

    while (guard.p.isInBounds(bounds, guard.d)) {
        if (map[guard.p.y() + guard.d.y()][guard.p.x() + guard.d.x()] === '#'
            || (obstruction && obstruction.eq(guard.p.add(guard.d)))) {
            guard.d = guard.d.turn('R');
            visited.set(guard.p.copy(), [...visited.get(guard.p), guard.d.copy()]);

            continue;
        }

        const newPos = guard.p.move(guard.d).copy();
        const dirs = visited.get(newPos);

        if (obstruction && dirs && dirs.some((d) => d.eq(guard.d))) {
            return true;
        }

        visited.set(newPos, dirs ? [...dirs, guard.d.copy()] : [guard.d.copy()]);
    }

    return obstruction ? false : visited;
}

const part1 = () => {
    return walk({p: guardStart.p.copy(), d: guardStart.d.copy()}).size();
};

const part2 = () => {
    return walk({p: guardStart.p.copy(), d: guardStart.d.copy()})
        .keys()
        .filter((obs) => walk({p: guardStart.p.copy(), d: guardStart.d.copy()}, obs)).length;
}

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
