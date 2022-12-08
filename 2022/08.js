const args = process.argv;
const utils = require('./utils');

const input = utils
    .read(args[2])
    .map((r) => r.split('').map((c) => ({
        h: Number(c),
        v: false,
        s: 0
    })));


for (let x = 0; x < input.length; x++) {
    for (let y = 0; y < input.length; y++) {
        const row = input[x];
        const col = utils.grid.column(input, y);
        const curr = input[x][y];

        const indexes = [
            [row.slice(0, y).reverse().findIndex((v) => v.h >= curr.h), y],
            [row.slice(y + 1).findIndex((v) => v.h >= curr.h), row.length - (y + 1)],
            [col.slice(0, x).reverse().findIndex((v) => v.h >= curr.h), x],
            [col.slice(x + 1).findIndex((v) => v.h >= curr.h), col.length - (x + 1)],
        ];

        curr.v = indexes.some((v) => v[0] === -1);
        curr.s = indexes.map((v) => v[0] === -1 ? v[1] : v[0] + 1).reduce((a, b) => a * b, 1);
    }
}

const part1 = () => {
    return input.flat().filter((v) => v.v).length;
};

const part2 = () => {
    return input.flat().sort((a, b) => b.s - a.s)[0].s;
};

console.log(part1());
console.log(part2());