const args = process.argv;
const utils = require('./utils');

const currDir = [];
const mem = new Map();

utils
    .read(args[2])
    .reduce((acc, curr, idx, arr) => {
        const split = curr.split(' ');

        if (split[2] === '..') {
            currDir.pop();
            return acc;
        }

        if (split[1] === 'cd') {
            currDir.push(split[2]);
            const endIndex = arr.findIndex((val, i) => i > idx + 2 && val.startsWith('$ cd'));
            const ls = arr.slice(idx + 2, endIndex > 0 ? endIndex : arr.length);
            acc.push([currDir.join('/'), ls]);
        }

        return acc;
    }, [])
    .map((val) => ({
        p: val[0],
        d: val[1].filter((f) => f.startsWith('dir')).map((f) => f.split(' ')[1]),
        f: val[1].filter((f) => !f.startsWith('dir')).map((f) => Number(f.split(' ')[0]))
    }))
    .sort((a, b) => b.p.split('/').length - a.p.split('/').length)
    .forEach((dir) => {
        const dirSizes = dir.d.reduce((acc, curr) => acc + mem.get(`${dir.p}/${curr}`), 0);
        const fileSizes = dir.f.reduce((acc, curr) => acc + curr, 0);
        mem.set(dir.p, dirSizes + fileSizes);
    });

const part1 = () => {
    return [...mem].filter((v) => v[1] <= 100000).reduce((acc, curr) => acc + curr[1], 0);
};

const part2 = () => {
    const needed =  30000000 - (70000000 - mem.get('/'));
    return [...mem].filter((v) => v[1] >= needed).sort((a, b) => a[1] - b[1])[0][1];
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
