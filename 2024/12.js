const args = process.argv;
const { inputs, Point, MSet, grids, points } = require('./utils');

const input = inputs
    .read(args[2])
    .map((row, y) => row.split('').map((val, x) => ({ point: new Point([x, y]), val })));

const regions = [];

let unvisited = input.flat();
while (unvisited.length) {
    const start = unvisited.shift();
    const region = [...grids.bfs(input, start, (n, c) => n.val === c.val)]
        .map(([p]) => [p, start.val]);
    
    unvisited = unvisited.filter((u) => !region.some(([p]) => p === u.point));
    regions.push(region);
}

const part1 = () => {
    return regions.map((region) => region
            .map(([point]) => 4 - point.adjacent().filter((a) => region.some(([p]) => p.eq(a))).length))
        .reduce((acc, curr) => acc + curr.length * curr.reduce((a, b) => a + b), 0);
};

const getCorners = (point, region) => {
    const neighbors = point.adjacent().filter((a) => region.some(([p]) => p.eq(a)));
    if (neighbors.length === 0) return 4;

    const [n, e, s, w, ne, se, nw, sw] = ['N', 'E', 'S', 'W', 'NE', 'SE', 'NW', 'SW']
        .map((d) => point.add(points.directionToDelta(d)));

    let corners = 0;

    if (neighbors.filter((a) => a.eq(n) || a.eq(e)).length === 2 && !region.some(([p]) => p.eq(ne)))
        corners++;

    if (neighbors.filter((a) => a.eq(s) || a.eq(e)).length === 2 && !region.some(([p]) => p.eq(se)))
        corners++;

    if (neighbors.filter((a) => a.eq(n) || a.eq(w)).length === 2 && !region.some(([p]) => p.eq(nw)))
        corners++;

    if (neighbors.filter((a) => a.eq(s) || a.eq(w)).length === 2 && !region.some(([p]) => p.eq(sw)))
        corners++;

    if (region.filter(([p]) => p.eq(n) || p.eq(e) || p.eq(ne)).length === 0)
        corners++;

    if (region.filter(([p]) => p.eq(s) || p.eq(e) || p.eq(se)).length === 0)
        corners++;

    if (region.filter(([p]) => p.eq(n) || p.eq(w) || p.eq(nw)).length === 0)
        corners++;

    if (region.filter(([p]) => p.eq(s) || p.eq(w) || p.eq(sw)).length === 0)
        corners++;

    if (neighbors.every((a) => !a.eq(s) && !a.eq(w)) && region.some(([p]) => p.eq(sw)))
        corners += 2;

    if (neighbors.every((a) => !a.eq(s) && !a.eq(e)) && region.some(([p]) => p.eq(se)))
        corners += 2;

    return corners;
};

const part2 = () => {
    return regions.map((region) => region.length * region.map(([point]) => 
            getCorners(point, region)).reduce((a, b) => a + b, 0))
        .reduce((a, b) => a + b, 0);
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
