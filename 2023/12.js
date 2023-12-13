const args = process.argv;
const { inputs, Cache } = require('./utils');

const records = inputs
    .read(args[2])
    .map((line) => {
        const s = line.split(' ');
        return {
            springs: s[0],
            groups: s[1].split(',').map((n) => Number(n))
        };
    });

const mem = new Cache();

const possible = (spring, group) => {
    const pattern = `^[#|\\?]{${group}}(\\?|$)`;
    const regex = new RegExp(pattern);
    return regex.exec(spring) !== null;
};

const count = (springs, groups) => {
    if (mem.has([springs, groups])) {
        return mem.get([springs, groups]);
    }

    if (groups.length === 0) {
        return springs.join('').replace(/\?/g, '') === '' ? 1 : 0;
    }

    if (springs.length === 0) {
        return 0;
    }

    const curr = springs[0];
    if (curr.length === 0) {
        return count(springs.slice(1), groups);
    }

    if (curr[0] === '#') {
        if (possible(curr, groups[0])) {
            return count([curr.slice(groups[0] + 1), ...springs.slice(1)], groups.slice(1));
        }

        return 0;
    }

    const damaged = count([`#${curr.slice(1)}`, ...springs.slice(1)], groups);
    const operational = count([curr.slice(1), ...springs.slice(1)], groups);

    mem.set([springs, groups], damaged + operational);

    return damaged + operational;
}

const part1 = () => {
    return records.map((record) => count(record.springs.split(/\.+/).filter((s) => s), record.groups))
        .reduce((acc, curr) => acc + curr, 0);
};

const part2 = () => {
    return records.map((record) => count(
        Array(5).fill(record.springs).join('?').split(/\.+/).filter((s) => s),
        Array(5).fill(record.groups).flat()
    ))
        .reduce((acc, curr) => acc + curr, 0);
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
