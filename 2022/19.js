const args = process.argv;
const utils = require('./utils');

const blueprints = utils
    .read(args[2])
    .map((b) => {
        const matches = b.match(/\d+/g).map(Number);
        return {
            id: matches[0],
            costs: [
                [matches[1], 0, 0],
                [matches[2], 0, 0],
                [matches[3], matches[4], 0],
                [matches[5], 0, matches[6]]
            ]
        };
    });

const [ORE, CLAY, OBSIDIAN, GEODE] = [0, 1, 2, 3];

const runBlueprint = (blueprint, time = 24) => {
    const maxCost = [
        blueprint.costs.reduce((acc, curr) => Math.max(acc, curr[ORE]), 0),
        blueprint.costs.reduce((acc, curr) => Math.max(acc, curr[CLAY]), 0),
        blueprint.costs.reduce((acc, curr) => Math.max(acc, curr[OBSIDIAN]), 0),
    ];

    const resources = [0, 0, 0];
    const robots = [1, 0, 0];

    let timeLeft = time;
    let maxGeode = 0;

    const stack = [{timeLeft, resources, robots, geodes: 0}];
    const visited = new Set();

    while (stack.length) {
        const curr = stack.pop();

        if (curr.timeLeft <= 1) {
            maxGeode = Math.max(maxGeode, curr.geodes);
            continue;
        }

        const vHash = `${curr.timeLeft},${curr.resources.join(',')},${curr.robots.join(',')},${curr.geodes}`;
        if (visited.has(vHash)) continue;
        visited.add(vHash);

        [0, 1, 2, 3].forEach((material) => {
            if (material !== GEODE && curr.robots[material] === maxCost[material]) return;
            if (material === OBSIDIAN && curr.robots[CLAY] === 0) return;
            if (material === GEODE && curr.robots[OBSIDIAN] === 0) return;

            const next = {
                timeLeft: curr.timeLeft,
                resources: [...curr.resources],
                robots: curr.robots.map((r,  m) => m === material ? r + 1 : r),
                geodes: curr.geodes
            };

            while(!blueprint.costs[material].every((c, m) => c <= next.resources[m]) && next.timeLeft > 1) {
                next.timeLeft--;
                next.resources = next.resources.map((r, m) => r + curr.robots[m]);
            }

            next.timeLeft--;
            next.resources = next.resources.map((r, m) => r + curr.robots[m] - blueprint.costs[material][m]);

            if (material === GEODE) {
                next.geodes += next.timeLeft;
            }

            stack.push(next);
        });
    }

    return maxGeode;
};

const part1 = () => {
    return blueprints.map((b) => b.id * runBlueprint(b)).reduce((acc, curr) => acc + curr, 0);
};

const part2 = () => {
    return blueprints.slice(0, 3).map((b) => runBlueprint(b, 32)).reduce((acc, curr) => acc * curr, 1);
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
