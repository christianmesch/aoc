const args = process.argv;
const { inputs, Cache } = require('./utils');

const input = inputs.read(args[2])
    .reduce((acc, row) => {
        const [key, vals] = row.split(': ');
        acc.set(key, vals.split(' '));
        return acc;
    }, new Map());

const mem = new Cache();

const part1 = (node = 'you') => {
    if (node === 'out') return 1;
    return input.get(node)
        .reduce((acc, curr) => acc + mem.getOrCompute(curr, () => part1(curr)), 0);
};

const part2 = (node = 'svr', visited = []) => {
    if (node === 'out') {
        return visited.includes('dac') && visited.includes('fft') ? 1 : 0;
    }
    if (['dac', 'fft'].includes(node)) {
        visited.push(node);
    }

    return input.get(node)
        .flatMap((n) => 
            mem.getOrCompute([n, visited], () => part2(n, [...visited])))
        .reduce((acc, curr) => acc + curr, 0);
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
