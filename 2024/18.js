const args = process.argv;
const { inputs, grids, Point } = require('./utils');

const bounds = {
    min: [0, 0],
    max: [
        args[2].match('example') ? 6 : 70, 
        args[2].match('example') ? 6 : 70
    ]
};

const graph = grids.fromBounds(bounds, (x, y) => ({ point: new Point([x, y]), val: '.' }));

const input = inputs
    .read(args[2])
    .map((row) => new Point(row.split(',').map(Number)));

const corrupted = args[2].match('example') ? 12 : 1024;
for (let i = 0; i < corrupted; i++) {
    const curr = input[i];
    graph[curr.y()][curr.x()].val = '#';
}

const start = graph[bounds.min[1]][bounds.min[0]];
const end = graph[bounds.max[1]][bounds.max[0]];

const part1 = () => {
    return grids.bfs(graph, start, (v) => v.val === '.').get(end.point);
};

const part2 = () => {
    for (const byte of input.slice(corrupted)) {
        graph[byte.y()][byte.x()].val = '#';
        if (!grids.bfs(graph, start, (v) => v.val === '.').get(end.point)) {
            return byte.val.join(',');
        }
    }    
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
