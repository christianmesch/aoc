const args = process.argv;
const { inputs, Point, PriorityQueue, MMap, MSet, points, grids } = require('./utils');

const input = inputs
    .read(args[2])
    .flatMap((row, y) => row.split('')
        .flatMap((val, x) => val !== '#' ? { 
            point: new Point([x, y]), 
            val,
            distance: val === 'S' ? 0 : Number.MAX_SAFE_INTEGER,
            direction: val === 'S' ? new Point([1, 0]) : undefined,
            prev: []
        } : []))
    .reduce((acc, curr) => acc.set(curr.point, curr), new MMap());

const start = input.values().find(({ val }) => val === 'S');
const end = input.values().find(({ val }) => val === 'E');

console.log(start);

const queue = new PriorityQueue((a, b) => a.distance - b.distance, [start]);

while (!queue.isEmpty()) {
    const curr = queue.dequeue();
    //console.log(`Current: ${curr.point.val}, Distance: ${curr.distance}`);
    
    [
        curr.direction, 
        new Point([curr.direction.y(), -curr.direction.x()]), 
        new Point([-curr.direction.y(), curr.direction.x()])
    ].map((dir) => [input.get(curr.point.add(dir)), dir])
        .filter(([neighbor]) => neighbor)
        .forEach(([neighbor, dir]) => {
            const distance = curr.distance + (dir.eq(curr.direction) ? 1 : 1001);
            
            if (distance === neighbor.distance) {
                neighbor.prev.push(curr);
            }

            if (distance <= neighbor.distance) {
                neighbor.distance = distance;
                neighbor.direction = dir;
                neighbor.prev = [curr];
                queue.enqueue(neighbor);
            }
        });
}

const asd = (point) => {
    return [point, ...point.prev.flatMap(asd)];
};

const part1 = () => {
    return end.distance;
};

const part2 = () => {
    console.log(queue.queue.filter((v) => v.prev.length > 1));
    console.log(asd(end).length);
    return (new Set(asd(end))).size;
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
