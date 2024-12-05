const args = process.argv;
const { inputs, PriorityQueue } = require('./utils');

const input = inputs.read(args[2], '\n\n');

const ordering = input[0].split('\n')
    .map((row) => row.split('|').map(Number));

const updates = input[1].split('\n')
    .map((row) => row.split(',').map(Number));

const sortFunc = (a, b) => {
    for (const [oa, ob] of ordering) {
        if (oa === a && ob === b) return -1;
        if (oa === b && ob === a) return 1;
    }

    return 0;
}

const solve = (firstPart = true) => {
    return updates.map((arr) => new PriorityQueue(sortFunc, arr))
        .filter((pq, i) => firstPart === pq.queue.every((v, j) => v === updates[i][j]))
        .reduce((acc, curr) => acc + curr.queue[Math.floor(curr.queue.length / 2)], 0);
};

if (!args[3] || args[3] === '1') {
    console.log(solve(true));
} else {
    console.log(solve(false));
}
