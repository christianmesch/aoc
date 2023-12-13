const args = process.argv;
const { inputs, grids, Value, MSet, Cache } = require('./utils');

const input = inputs
    .read(args[2], '\n\n')
    .map((pattern) => pattern.split('\n'));

const mem = new Cache();

const findMirror = (line = '') => {
    if (mem.has(line)) return mem.get(line);

    const res = new MSet();
    for (let i = 1; i < line.length; i++) {
        const longer = i > line.length - i ? line.substring(0, i) : line.substring(i).split('').reverse().join('');
        const shorter = i > line.length - i ? line.substring(i).split('').reverse().join('') : line.substring(0, i);
        if (longer.endsWith(shorter)) res.add(new Value([i, shorter.length]));
    }

    mem.set(line, res);

    return res;
};

const findReflectionLine = (pattern, original) => {
    const pvMirrors = grids.allColumns(pattern).map((line) => findMirror(line.join('')));
    const vMirrors = pvMirrors.reduce((acc, curr) => acc.intersection(curr), pvMirrors[0])
        .values()
        .sort((a, b) => b.val[1] - a.val[1])
        .map((v) => v.val[0] * 100)
        .filter((v) => v !== original);

    const phMirrors = pattern.map((line) => findMirror(line));
    const hMirrors = phMirrors.reduce((acc, curr) => acc.intersection(curr), phMirrors[0])
        .values()
        .sort((a, b) => b.val[1] - a.val[1])
        .map((v) => v.val[0])
        .filter((v) => v !== original);

    const res = [];
    if (vMirrors.length) res.push(vMirrors[0]);
    if (hMirrors.length) res.push(hMirrors[0]);
    
    return res;
};

const part1 = () => {
    return input.map((pattern) => findReflectionLine(pattern)[0])
        .reduce((acc, curr) => acc + curr, 0);
};

const part2 = () => {
    return input.map((pattern) => {
        const original = findReflectionLine(pattern)[0];

        for (let y = 0; y < pattern.length; y++) {
            for (let x = 0; x < pattern[0].length; x++) {
                const tmpPattern = pattern.map((line, py) => {
                    if (py == y) {
                        const tmp = line.split('');
                        tmp[x] = tmp[x] === '.' ? '#' : '.';
                        return tmp.join('');
                    }

                    return line;
                });

                const otherReflectionLine = findReflectionLine(tmpPattern, original);

                if (otherReflectionLine.length) {
                    return otherReflectionLine[0];
                }
            }
        }
    }).reduce((acc, curr) => acc + curr, 0);
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
