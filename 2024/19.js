const args = process.argv;
const { inputs, Cache } = require('./utils');

const input = inputs.read(args[2], '\n\n');
const towels = input[0].split(', ');
const designs = input[1].split('\n');

const mem = new Cache();

const patternMatch = (pattern) => {
    if (!pattern.length) return 1;

    return mem.getOrCompute(pattern, () => 
        towels.filter((towel) => pattern.startsWith(towel))
            .flatMap((towel) => patternMatch(pattern.slice(towel.length)))
            .reduce((acc, curr) => acc + curr, 0)
    );
};

const part1 = () => {
    return designs.map((design) => patternMatch(design))
        .reduce((acc, curr) => acc + (curr ? 1 : 0), 0);
};

const part2 = () => {
    return designs.map((design) => patternMatch(design))
        .reduce((acc, curr) => acc + curr, 0);
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
