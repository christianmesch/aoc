const args = process.argv;
const { inputs, lists } = require('./utils');

const [s, ...tail] = inputs
    .read(args[2], '\n\n');

const seeds = s.split(': ')[1].split(' ').map((n) => Number(n));

const maps = tail.map((m) => {
    const [, ...t] = m.split('\n');
    return t.map((line) => {
        const [d, s, n] = line.split(' ').map((n) => Number(n));
        return {d, s, n};
    }).sort((a, b) => a.s - b.s)
    .flatMap((line, idx, arr) => {
        if (idx === t.length - 1) {
            return [line, { d: line.s + line.n, s: line.s + line.n, n: Number.MAX_SAFE_INTEGER }];
        }

        const res = [line];
        if (idx === 0 && line.s !== 0) {
            res.unshift({ d: 0, s: 0, n: line.s });
        }

        if (!(line.s + line.n == arr[idx + 1].s)) {
            res.push({ d: line.s + line.n, s: line.s + line.n, n: arr[idx + 1].s - line.s - line.n });
        }

        return res;
    });
});

const mapper = ([source, num], m) => {
    if (m === maps.length) return source;

    const map = maps[m];

    return map.flatMap((v) => {
        const res = [];
        if (v.s <= source && source < v.s + v.n) {
            const sDest = v.d + source - v.s;
            const nDest = Math.min(source + num, v.s + v.n) - source;

            res.push([sDest, nDest]);
        } else if (v.s <= (source + num - 1) && source + num <= v.s + v.n) {
            const nDest = source + num - v.s;

            res.push([v.d, nDest])
        }

        return res;
    }).flatMap((v) => mapper(v, m + 1));
};

const part1 = () => {
    return seeds.flatMap((seed) => mapper([seed, 1], 0))
        .sort((a, b) => a - b)[0];
};

const part2 = () => {
    return lists.toChunks(seeds, 2)
        .flatMap((seed) =>  mapper(seed, 0))
        .sort((a, b) => a - b)[0];
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
