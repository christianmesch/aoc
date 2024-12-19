const args = process.argv;
const { inputs, Point, PriorityQueue, MMap, MSet, deltas } = require('./utils');

const input = inputs
    .read(args[2])
    .flatMap((row, y) => row.split('')
        .flatMap((val, x) => val !== '#' ? { 
            point: new Point([x, y]), 
            val,
            distance: new MMap()
        } : []))
    .reduce((acc, curr) => acc.set(curr.point, curr), new MMap());

const start = input.values().find(({ val }) => val === 'S');
start.distance.set(deltas.directionToDelta('E'), 0);

const end = input.values().find(({ val }) => val === 'E');

const queue = new PriorityQueue((a, b) => 
    a[0].distance.get(a[1], Number.MAX_SAFE_INTEGER) - b[0].distance.get(b[1], Number.MAX_SAFE_INTEGER), 
    [[start, deltas.directionToDelta('E')]]);

while (!queue.isEmpty()) {
    const [cCell, cDirection] = queue.dequeue();
    
    [
        cDirection, 
        deltas.turn(cDirection, true), 
        deltas.turn(cDirection, false)
    ].map((dir) => [input.get(cCell.point.add(dir)), dir])
    .filter(([neighbor]) => neighbor)
    .forEach(([neighbor, dir]) => {
        const newDistance = cCell.distance.get(cDirection, Number.MAX_SAFE_INTEGER) + (dir.eq(cDirection) ? 1 : 1001);
        
        if (newDistance < neighbor.distance.get(dir, Number.MAX_SAFE_INTEGER)) {
            neighbor.distance.set(dir, newDistance);
            queue.enqueue([neighbor, dir]);
        }
    });
}
 
const part1 = () => {
    return end.distance.values().sort((a, b) => a - b)[0];
};

const part2 = () => {
    const bucket = new MSet();

    const backtrack = (tile, distance) => {
        bucket.add(tile.point);
        tile.distance.entries()
            .filter(([, dist]) => dist === distance)
            .flatMap(([dir]) => input.get(tile.point.remove(dir)))
            .filter((next) => next)
            .forEach((next) => 
                next.distance.entries()
                    .filter(([, dist]) => dist === distance - 1 || dist === distance - 1001)
                    .forEach(([, dist]) => {
                        backtrack(next, dist);
                    }));
    };

    backtrack(end, part1());

    return bucket.size();
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
