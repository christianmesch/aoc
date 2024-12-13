const args = process.argv;
const { inputs } = require('./utils');

const input = inputs
    .read(args[2], '\n\n')
    .map((machine) => {
        const rows = machine.split('\n');
        return {
            a: rows[0].match(/(\d+)/g).map(BigInt),
            b: rows[1].match(/(\d+)/g).map(BigInt),
            t: rows[2].match(/(\d+)/g).map(BigInt)
        };
    });

const solve = (add = 0) => {
    return input.map(({ a, b, t }) => {
        const bDividend = (a[0] * (t[1] + BigInt(add)) - a[1] * (t[0] + BigInt(add)));
        const bDivisor = (b[1] * a[0] - b[0] * a[1]);
        const bPress = bDividend / bDivisor;
        if (bPress * bDivisor !== bDividend) return BigInt(0);
    
        const aDividend = ((t[0] + BigInt(add)) - bPress * b[0]);
        const aDivisor = a[0];
        const aPress = aDividend / aDivisor;
        if (aPress * aDivisor !== aDividend) return BigInt(0);

        return BigInt(3) * aPress + bPress;
    }).reduce((acc, curr) => acc + curr, BigInt(0));
};

if (!args[3] || args[3] === '1') {
    console.log(solve());
} else {
    console.log(solve(10000000000000));
}
