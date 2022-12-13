const args = process.argv;
const utils = require('./utils');

const input = utils
    .read(args[2], '\n\n')
    .map((p) => p.split('\n').map((l) => JSON.parse(l)));

const compare = (l, r) => {
    if (!Array.isArray(l) && !Array.isArray(r)) {
        return utils.compareTo(l, r);
    }

    if (Array.isArray(l) && !Array.isArray(r)) return compare(l, [r]);
    if (!Array.isArray(l) && Array.isArray(r)) return compare([l], r);

    for (let i = 0; i < l.length; i++) {
        if (i === r.length) break;

        const comp = compare(l[i], r[i]);
        if (comp) {
            return comp;
        }
    }

    return utils.compareTo(l.length, r.length);
}

const part1 = () => {
    return input.map(([left, right]) => compare(left, right))
        .map((v, idx) => v === -1 ? idx + 1 : 0)
        .reduce((acc, curr) => acc + curr, 0);
};

const part2 = () => {
    return [...input, [[[2]]], [[[6]]]].flat()
        .sort(compare)
        .map((v, idx) =>
            compare(v, [[2]]) === 0 || compare(v, [[6]]) === 0 ? idx + 1 : 1)
        .reduce((acc, curr) => acc * curr, 1);
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
