const args = process.argv;
const { inputs, math } = require('./utils');

const [head, tail] = inputs
    .read(args[2], '\n\n');

const instructions = head.split('');
const network = new Map(tail.split('\n').map((line) => { 
    const m = line.match(/\w{3}/g);
    return [m.shift(), m];
}));

const solve = (start, end) => {
    let steps = 0;
    let node = start;
    while (true) {
        if (instructions[steps % instructions.length] === 'L') node = network.get(node)[0];
        else node = network.get(node)[1];

        steps++;
        if (node.endsWith(end)) return steps;
    }
}

const part1 = () => {
    return solve('AAA', 'ZZZ');
};

const part2 = () => {
    return math.lcm([...network]
        .map(([k]) => k)
        .filter((n) => n.endsWith('A'))
        .map((n) => solve(n, 'Z')));
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
