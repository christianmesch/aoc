const args = process.argv;
const { inputs, grids, Point, MMap, deltas } = require('./utils');

const input = inputs
    .read(args[2])
    .flatMap((row, y) => row.split('')
        .flatMap((val, x) => val !== '#' ? { 
            point: new Point([x, y]), 
            val,
            distance: NaN
        } : []))
    .reduce((acc, curr) => acc.set(curr.point, curr), new MMap());

const start = input.values().find(({ val }) => val === 'S');
const end = input.values().find(({ val }) => val === 'E');

const distances = [...grids.tileBfs(input, start)];
distances.forEach(([point, distance]) => input.get(point).distance = distance);

const part1 = () => {
    const cheats = new Map();
    input.values().forEach(({ point, distance }) => {
        for (const d of deltas.deltas) {
            const one = input.get(point.add(d));
            const two = input.get(point.add(d).move(d));
            if (!one && two) {
                const gain = two.distance - distance - 2;
                if (gain > 0) {
                    cheats.set(gain, cheats.get(gain) + 1 || 1);
                }
            }
        }
    });

    return [...cheats].filter(([gain]) => gain >= 100)
        .reduce((acc, [, count]) => acc + count, 0);
};

// Too low: 981100
const part2 = () => {
    const cheats = new Map();

    /*
    distances.forEach(([point], idx) => {
        const source = input.get(point);
        deltas.deltas.map((d) => point.add(d))
            .filter((p) => !input.get(p))
            .forEach((p) => {
                distances.slice(idx).forEach(([dPoint]) => {
                    const dest = input.get(dPoint);
                    const manhattan = p.manhattan(dest.point) + 1;
                    const gain = dest.distance - source.distance - manhattan;
                    if (manhattan <= 20 && gain >= 50) {
                        cheats.set(gain, cheats.get(gain) + 1 || 1);
                    }
                });
            });
    });
*/

/*
    input.values().forEach((source) => {
        deltas.deltas.map((d) => source.point.add(d))
            .filter((p) => !input.get(p))
            .forEach((p) => {
                input.values().forEach((dest) => {
                    const manhattan = p.manhattan(dest.point) + 1;
                    const gain = dest.distance - source.distance - manhattan;
                    if (manhattan <= 20 && gain >= 50) {
                        cheats.set(gain, cheats.get(gain) + 1 || 1);
                    }
                });
            });
    });
 */
/*
    input.values().forEach((source) => {
        const maxGain = new Map();
        deltas.deltas.map((d) => source.point.add(d))
            .filter((p) => !input.get(p))
            .map((p) => {
                input.values().forEach((dest) => {
                    const manhattan = p.manhattan(dest.point) + 1;
                    const gain = dest.distance - source.distance - manhattan;
                    if (manhattan <= 20 && gain >= 50) {
                        maxGain.set(dest.point, Math.max(maxGain.get(dest.point) || 0, gain));
                    }
                });
            });
        
        [...maxGain].forEach(([, gain]) => {
            cheats.set(gain, cheats.get(gain) + 1 || 1);
        });
    });
*/

    distances.forEach(([point], idx) => {
        const maxGain = new Map();
        const source = input.get(point);
        deltas.deltas.map((d) => point.add(d))
            .filter((p) => input.get(p) === undefined)
            .forEach((p) => {
                distances.slice(idx).forEach(([dPoint]) => {
                    const dest = input.get(dPoint);
                    const manhattan = p.manhattan(dest.point) + 1;
                    const gain = dest.distance - source.distance - manhattan;
                    if (manhattan <= 20 && gain >= 50) {
                        maxGain.set(dest.point, Math.max(maxGain.get(dest.point) || 0, gain));
                    }
                });
            });
        
        [...maxGain].forEach(([, gain]) => {
            cheats.set(gain, cheats.get(gain) + 1 || 1);
        });
    });

    return cheats;

    /*
    return [...cheats].filter(([gain]) => gain >= 100)
        .reduce((acc, [, count]) => acc + count, 0);
      */  
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
