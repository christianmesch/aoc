const args = process.argv;
const utils = require('./utils');

const input = utils
    .read(args[2])
    .map(utils.coord.toCoord);

const part1 = () => {
    return input.map(utils.coord.adjacentCoords)
        .flat()
        .filter((c) => !input.some((i) => utils.coord.eq(i, c)))
        .length;
};

const part2 = () => {
    const bounds = utils.coord.getBounds(input);

    let faces = 0;
    const visited = new Set();
    const queue = [{x: bounds.min.x - 1, y: bounds.min.y - 1, z: bounds.min.z - 1}];

    while (queue.length) {
        const curr = queue.shift();

        if (visited.has(utils.coord.toString(curr))) continue;
        if (curr.x < bounds.min.x - 1 || curr.z < bounds.min.z - 1 || curr.y < bounds.min.y - 1
            || curr.x > bounds.max.x + 1 || curr.y > bounds.max.y + 1 || curr.z > bounds.max.z + 1) {
            continue;
        }

        visited.add(utils.coord.toString(curr));
        const neighbors = utils.coord.adjacentCoords(curr);
        faces += neighbors.filter((c) => input.some((i) => utils.coord.eq(i, c))).length;
        queue.push(...neighbors.filter((c) => !input.some((i) => utils.coord.eq(i, c))));
    }

    return faces;
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
