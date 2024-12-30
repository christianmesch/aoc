const args = process.argv;
const { inputs, Cache, MMap } = require('./utils');

const mem = new Cache();

const [, gates] = inputs
    .readParts(args[2],
        [
            (part) => {
                part.split('\n').forEach((row) => {
                    const [key, value] = row.split(': ');
                    mem.set(key, Number(value));
                })
            },
            (part) => 
                part.split('\n').reduce((acc, curr) => {
                    const [a, op, b, , key] = curr.split(' ');
                    return acc.set(key, { a, op, b });
                }, new MMap())
        ]
    );

const calc = (gate) => {
    return mem.getOrCompute(gate, () => {
        const { a, op, b } = gates.get(gate);
        
        switch (op) {
            case 'AND': return calc(a) && calc(b);
            case 'OR': return calc(a) || calc(b);
            case 'XOR': return calc(a) ^ calc(b);
        }
    });
}

const part1 = () => {
    return parseInt(gates.keys().filter((key) => key.startsWith('z')).sort().reverse()
        .map(calc).join(''), 2);

};

const part2 = () => {

};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
