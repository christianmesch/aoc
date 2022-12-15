const args = process.argv;
const utils = require('./utils');

const [head, ...tail] = utils.read(args[2]);
const [row, maxXY] = head.split(' ').map(Number);
const input = tail
    .map((p) => {
        const split = p.split(' ');
        const pair = {
            sensor: {x: Number(split[2].slice(2, -1)), y: Number(split[3].slice(2, -1))},
            beacon: {x: Number(split[8].slice(2, -1)), y: Number(split[9].slice(2))},
            distance: 0
        }
        pair.distance = utils.coord.manhattan(pair.sensor, pair.beacon);

        return pair;
    });

const occupied = (row) => {
    return input
        .map((p) => {
            const diff = p.distance - Math.abs(p.sensor.y - row);
            if (diff >= 0) {
                return [p.sensor.x - diff, p.sensor.x + diff];
            }

            return [];
        })
        .filter((r) => r.length)
        .sort((a, b) => a[0] - b[0])
        .reduce((acc, curr) => {
            let merged = false;
            for (const range of acc) {
                if ((range[0] <= curr[0] && curr[0] <= range[1])
                    || (range[0] <= curr[1] && curr[1] <= range[1])) {
                    range[0] = Math.min(range[0], curr[0]);
                    range[1] = Math.max(range[1], curr[1]);
                    merged = true;
                }
            }

            if (!merged) acc.push(curr);
            return acc;
        }, []);
};

const part1 = () => {
    const beacons = input.filter((p) => p.beacon.y === row)
        .map((p) => p.beacon.x)
        .reduce((acc, curr) => acc.add(curr), new Set());

    return occupied(row)
        .map((r) => {
            let res = r[1] - r[0] + 1;
            beacons.forEach((x) => {
                if (r[0] <= x && x <= r[1]) res--
            });
            return res;
        })
        .reduce((acc, curr) => acc + curr, 0);
}

const part2 = () => {
    for (let y = 0; y < maxXY; y++) {
        const o = occupied(y);
        if (o.length > 1 && o[0][1] + 1 <= maxXY) {
            return (o[0][1] + 1) * 4000000 + y;
        }
    }
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
