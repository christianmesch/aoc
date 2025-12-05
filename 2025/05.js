const args = process.argv;
const { inputs, lists } = require('./utils');

const [ranges, ids] = inputs
    .readParts(args[2], [
        (a) => a.split('\n').map((row) => row.split('-').map(Number)),
        (b) => b.split('\n').map(Number)
    ]);

const part1 = () => {
    return ids.filter((id) => 
        ranges.some((range) => range[0] <= id && id <= range[1])).length;
};

const part2 = () => {
    return lists.mergeRanges(ranges)
        .reduce((acc, [a, b]) => acc + (b - a) + 1, 0);
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
