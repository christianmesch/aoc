const read = (inputFileName, sep = '\n', leaveEmpty = false) => {
    return require('fs')
        .readFileSync(inputFileName, 'utf-8')
        .split(sep)
        .filter((x) => leaveEmpty || x.length !== 0);
};

const readInt = (inputFileName, sep = '\n', leaveEmpty = false) => {
    return read(inputFileName, sep, leaveEmpty).map(Number);
};

const range = (start, end, delta = 1) => {
    return new Array(Math.ceil((end - start) / delta)).fill().map((_, i) => start + i * delta);
}

const lists = {
    alpha: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    alphaUpper: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
}

const compareTo = (a, b) => {
    if (a === b) return 0;
    if (a < b) return -1;
    return 1;
}

const median = (numbers) => {
    if (numbers.length === 0) return 0;

    const sorted = numbers.sort(compareTo);
    const middle = Math.ceil(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle] + sorted[middle - 1]) / 2;
    }

    return sorted[middle];
}

const mean = (numbers) => {
    if (numbers.length === 0) return 0;

    return numbers.reduce((acc, curr) => acc + curr, 0) / numbers.length;
}

const set = {
    superset: (a, b) => {
        for (const e of b) {
            if (!a.has(e)) return false;
        }

        return true;
    },
    union: (a, b) => {
        const u = new Set(a);
        for (const e of b) {
            u.add(e);
        }

        return u;
    },
    intersection: (a, b) => {
        const i = new Set();
        for (const e of a) {
            if (b.has(e)) i.add(e);
        }

        return i;
    },
    diff: (a, b) => {
        const d = new Set(a);
        for (const e of b) {
            d.delete(e);
        }

        return d;
    },
    eq: (a, b) => {
        if (a.size !== b.size) return false;
        return [...a].every((v) => b.has(v));
    }
};

const adjacent = (input, x, y, includeDiagonal = false) => {
    const list = [];
    if (x !== 0) list.push({x: x - 1, y, d: input[y][x - 1]});
    if (x !== input[0].length - 1) list.push({x: x + 1, y, d: input[y][x + 1]});
    if (y !== 0) list.push({x, y: y - 1, d: input[y - 1][x]});
    if (y !== input.length - 1) list.push({x, y: y + 1, d: input[y + 1][x]});

    if (includeDiagonal) {
        if (x !== 0 && y !== 0) list.push({x: x - 1, y: y - 1, d: input[y - 1][x - 1]});
        if (x !== input.length - 1 && y !== input[0].length - 1) list.push({
            x: x + 1,
            y: y + 1,
            d: input[y + 1][x + 1]
        });
        if (x !== 0 && y !== input[0].length - 1) list.push({x: x - 1, y: y + 1, d: input[y + 1][x - 1]});
        if (x !== input.length - 1 && y !== 0) list.push({x: x + 1, y: y - 1, d: input[y - 1][x + 1]});
    }

    return list;
}

module.exports = {
    read,
    readInt,
    range,
    lists,
    compareTo,
    median,
    mean,
    set,
    adjacent,
};
