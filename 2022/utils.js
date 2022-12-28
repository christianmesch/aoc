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
};

const permutations = (input) => {
    const result = [];

    const permute = (arr, m = []) => {
        if (arr.length === 0) {
            result.push(m)
        } else {
            for (let i = 0; i < arr.length; i++) {
                const curr = arr.slice();
                const next = curr.splice(i, 1);
                permute(curr.slice(), m.concat(next))
            }
        }
    }

    permute(input)

    return result;
};

const findLastIndex = (arr, pred = (v, i, arr) => true) => {
    let i = arr.length;
    while (i--) {
        if (pred(arr[i], i, arr)) {
            return i;
        }
    }

    return -1;
}

const lists = {
    alpha: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    alphaUpper: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
};

const compareTo = (a, b) => {
    if (a === b) return 0;
    if (a < b) return -1;
    return 1;
};

const median = (numbers) => {
    if (numbers.length === 0) return 0;

    const sorted = numbers.sort(compareTo);
    const middle = Math.ceil(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle] + sorted[middle - 1]) / 2;
    }

    return sorted[middle];
};

const mean = (numbers) => {
    if (numbers.length === 0) return 0;

    return numbers.reduce((acc, curr) => acc + curr, 0) / numbers.length;
};

const parseMathExpression = (expression) => {
    return Function(`'use strict'; return (${expression})`)()
};

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

const grid = {
    adjacent: (input, coord, includeDiagonal = false) => {
        const list = [];
        if (coord.x !== 0) list.push(input[coord.y][coord.x - 1]);
        if (coord.x !== input[0].length - 1) list.push(input[coord.y][coord.x + 1]);
        if (coord.y !== 0) list.push(input[coord.y - 1][coord.x]);
        if (coord.y !== input.length - 1) list.push(input[coord.y + 1][coord.x]);

        if (includeDiagonal) {
            if (coord.x !== 0 && coord.y !== 0) list.push(input[coord.y - 1][coord.x - 1]);
            if (coord.x !== input.length - 1 && coord.y !== input[0].length - 1) list.push(input[coord.y + 1][coord.x + 1]);
            if (coord.x !== 0 && coord.y !== input[0].length - 1) list.push(input[coord.y + 1][coord.x - 1]);
            if (coord.x !== input.length - 1 && coord.y !== 0) list.push(input[coord.y - 1][coord.x + 1]);
        }

        return list;
    },
    bfs: (graph, start, filterNeighbors = (v, c) => true) => {
        const queue = [];
        const visited = new Set([coord.toString(start.coord)]);

        graph.flat().forEach((v) => {
            v.distance = Number.POSITIVE_INFINITY;
        });

        start.distance = 0;
        queue.push(start);

        while (queue.length) {
            const curr = queue.shift();

            grid.adjacent(graph, curr.coord)
                .filter((v) => !visited.has(coord.toString(v.coord)))
                .filter((v) => filterNeighbors(v, curr))
                .forEach((v) => {
                    const tmp = curr.distance + 1;
                    if (tmp < v.distance) {
                        v.distance = tmp;
                        queue.push(v);
                    }
                });
        }
    },
    column: (input, col) => {
        return input.map((row) => row[col]);
    },
    allColumns: (input) => {
        return range(0, input.length).map((c) => grid.column(input, c));
    }
};

const coord = {
    directionToDelta: (direction, num = 1) => {
        switch (direction) {
            case 'R':
            case 'E':
            case '>':
                return {x: num, y: 0};
            case 'L':
            case 'W':
            case '<':
                return {x: -num, y: 0};
            case 'U':
            case 'N':
            case '^':
                return {x: 0, y: num};
            case 'D':
            case 'S':
            case 'V':
                return {x: 0, y: -num};
        }
    },
    add: (coordinate, delta, copy = false) => {
        const c = copy ? {...coordinate} : coordinate;

        c.x += delta.x;
        c.y += delta.y;
        if (c.z !== undefined) {
            c.z += delta.z;
        }

        return c;
    },
    sub: (coordinate, delta, copy = false) => {
        const c = copy ? {...coordinate} : coordinate;

        c.x -= delta.x;
        c.y -= delta.y;
        if (c.z !== undefined) {
            c.z -= delta.z;
        }

        return c;
    },
    expand: (from, to, inclusive = true) => {
        const list = [];
        const xStart = Math.min(from.x, to.x);
        const xEnd = Math.max(from.x, to.x);
        const yStart = Math.min(from.y, to.y);
        const yEnd = Math.max(from.y, to.y);

        for (let x = xStart; x <= xEnd; x++) {
            for (let y = yStart; y <= yEnd; y++) {
                const c = {x, y};
                if (inclusive || (!coord.eq(from, c) && !coord.eq(to, c))) {
                    list.push(c);
                }
            }
        }

        return list;
    },
    adjacentCoords: (coord) => {
        if (coord.z !== undefined) {
            return [
                {x: coord.x - 1, y: coord.y, z: coord.z},
                {x: coord.x + 1, y: coord.y, z: coord.z},
                {x: coord.x, y: coord.y - 1, z: coord.z},
                {x: coord.x, y: coord.y + 1, z: coord.z},
                {x: coord.x, y: coord.y, z: coord.z - 1},
                {x: coord.x, y: coord.y, z: coord.z + 1},
            ];
        } else {
            return [
                {x: coord.x - 1, y: coord.y},
                {x: coord.x + 1, y: coord.y},
                {x: coord.x, y: coord.y - 1},
                {x: coord.x, y: coord.y + 1},
            ];
        }
    },
    toCoord: (s) => {
        const split = s.split(',');
        return {x: Number(split[0]), y: Number(split[1]), z: Number(split[2] ? split[2] : '0')};
    },
    toString: (coordinate) => {
        if (coordinate.z === undefined) {
            return `${coordinate.x},${coordinate.y}`;
        } else {
            return `${coordinate.x},${coordinate.y},${coordinate.z}`;
        }
    },
    eq: (a, b) => a.x === b.x && a.y === b.y && a.z === b.z,
    rotate: (delta, direction) => {
        if (delta.x === 0 && delta.y === 1) {
            return {
                x: direction === 'L' ? 1 : -1,
                y: 0
            }
        } else if (delta.x === 0 && delta.y === -1) {
            return {
                x: direction === 'L' ? -1 : 1,
                y: 0
            }
        } else if (delta.x === 1 && delta.y === 0) {
            return {
                x: 0,
                y: direction === 'L' ? -1 : 1,
            }
        } else if (delta.x === -1 && delta.y === 0) {
            return {
                x: 0,
                y: direction === 'L' ? 1 : -1,
            }
        }
    },
    getBounds: (coords) => {
        const bounds = {
            min: {x: Number.POSITIVE_INFINITY, y: Number.POSITIVE_INFINITY, z: Number.POSITIVE_INFINITY},
            max: {x: Number.NEGATIVE_INFINITY, y: Number.NEGATIVE_INFINITY, z: Number.NEGATIVE_INFINITY}
        };

        for (const c of coords) {
            bounds.min.x = Math.min(c.x, bounds.min.x);
            bounds.min.y = Math.min(c.y, bounds.min.y);
            bounds.min.z = Math.min(c.z, bounds.min.z);
            bounds.max.x = Math.max(c.x, bounds.max.x);
            bounds.max.y = Math.max(c.y, bounds.max.y);
            bounds.max.z = Math.max(c.z, bounds.max.z);
        }

        return bounds;
    },
    manhattan: (from, to) => {
        return Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
    }
};

module.exports = {
    read,
    readInt,
    range,
    lists,
    findLastIndex,
    compareTo,
    median,
    mean,
    parseMathExpression,
    set,
    grid,
    coord,
};
