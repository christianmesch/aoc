const args = process.argv;
const utils = require('./utils');

const input = utils
    .read(args[2])
    .map((r, y) => r.split('').map((d, x) => ({
        coord: {x, y},
        data: d,
    })));

const start = input.flat().find((v) => v.data === 'S');
const end = input.flat().find((v) => v.data === 'E');
start.data = 'a';
end.data = 'z';

const bfs = (graph, start) => {
    const traverseOrder = [...utils.lists.alpha];

    const queue = [];
    const visited = new Set([utils.coord.toString(start.coord)]);

    graph.flat().forEach((v) => {
        v.distance = Number.POSITIVE_INFINITY;
    });

    start.distance = 0;
    queue.push(start);

    while (queue.length) {
        const curr = queue.shift();

        utils.grid.adjacent(graph, curr.coord)
            .filter((v) => {
                return !visited.has(utils.coord.toString(v.coord))
                    && (traverseOrder.indexOf(curr.data) - 1 <= traverseOrder.indexOf(v.data))
            })
            .forEach((v) => {
                const tmp = curr.distance + 1;
                if (tmp < v.distance) {
                    v.distance = tmp;
                    queue.push(v);
                }
            });
    }
}


bfs(input, end);

const part1 = () => {
    return start.distance;
};

const part2 = () => {
    return input.flat()
        .filter((v) => v.data === 'a')
        .map((v) => v.distance)
        .sort((a, b) => a - b)[0];
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
