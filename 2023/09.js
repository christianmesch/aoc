const args = process.argv;
const { inputs } = require('./utils');

const input = inputs
    .read(args[2])
    .map((h) => h.split(' ').map((n) => Number(n)))
    .map((h) => {
        const res = [h];
        
        while (res[0].length && !res[0].every((v) => !v)) {
            const h = [];
            for (let i = 1; i < res[0].length; i++) {
                h.push(res[0][i] - res[0][i - 1]);
            }
            res.unshift(h);
        }
    
        return res;
    });

const part1 = () => {
    return input
        .map((d) => d.reduce((acc, curr) => acc + curr.at(-1), 0))
        .reduce((acc, curr) => acc + curr, 0);
};

const part2 = () => {
    return input
        .map((d) => d.reduce((acc, curr) => curr[0] - acc, 0))
        .reduce((acc, curr) => acc + curr, 0);
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
