const args = process.argv;
const utils = require('./utils');

const input = utils
    .read(args[2]);

const fromSNAFU = (snafu) => {
    return snafu.split('').reverse().map((v, i) => {
        const num = v === '-' ? -1 : v === '=' ? -2 : Number(v);
        return Math.pow(5, i) * num;
    }).reduce((acc, curr) => acc + curr, 0);
};

const toSNAFU = (base10) => {
    const base5 = ['0', ...base10.toString(5).split('')];
    for (let i = base5.length - 1; i > 0; i--) {
        if (base5[i] === '5' || base5[i] === '4' || base5[i] === '3') {
            base5[i - 1] = String(Number(base5[i - 1]) + 1);
            base5[i] = base5[i] === '5' ? '0' : base5[i] === '4' ? '-' : '=';
        }
    }

    return base5[0] === '0' ? base5.slice(1).join('') : base5.join('');
};

const part1 = () => {
    return toSNAFU(input.map(fromSNAFU).reduce((acc, curr) => acc + curr, 0));
};

const part2 = () => {

};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
