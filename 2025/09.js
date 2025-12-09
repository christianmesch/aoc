const args = process.argv;
const { inputs, Point, points } = require('./utils');

const input = inputs
    .read(args[2])
    .map((row) => new Point(row.split(',').map(Number)));

const areas = input
    .reduce((acc, a, i, arr) => {
        if (i === arr.length - 1) return acc;
        arr.slice(i + 1).forEach((b) => {
            acc.push({
                area: (1 + Math.abs(a.x() - b.x())) * (1 + Math.abs(a.y() - b.y())),
                pair: [a, b]
            });
        });

        return acc;
    }, [])
    .sort(({area: a}, {area: b}) => b - a);

const part1 = () => {
    return areas[0].area;
};

const part2 = () => {
    return areas.find((area) => {
        const bounds = points.getBounds(area.pair);

        const hasIntersection = input.some((l1, i) => {
            const l2 = input[(i + 1) % input.length];
            return points.intersectsBounds(bounds, l1, l2);
        });

        return !hasIntersection;
    }).area;
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
