const {Point} = require('./point');

const inputs = {
    read: (inputFileName, sep = '\n', leaveEmpty = false) => {
        return require('fs')
            .readFileSync(inputFileName, 'utf-8')
            .split(sep)
            .filter((x) => leaveEmpty || x.length !== 0);
    },

    readInt: (inputFileName, sep = '\n', leaveEmpty = false) => {
        return inputs.read(inputFileName, sep, leaveEmpty).map(Number);
    }
};

const lists = {
    alpha: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    alphaUpper: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    textToNumber: new Map([
        ['one', 1], ['two', 2], ['three', 3], ['four', 4], ['five', 5], ['six', 6], ['seven', 7], ['eight', 8], ['nine', 9], ['zero', 0]
    ]),

    range: (start, end, delta = 1) => {
        return new Array(Math.ceil((end - start) / delta)).fill(undefined).map((_, i) => start + i * delta);
    },

    permutations: (input) => {
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

        permute(input);
        return result;
    },

    findLastIndex: (arr, pred = (v, i, arr) => true) => {
        let i = arr.length;
        while (i--) {
            if (pred(arr[i], i, arr)) {
                return i;
            }
        }

        return -1;
    }
};

const math = {
    compareTo: (a, b) => {
        if (a === b) return 0;
        if (a < b) return -1;
        return 1;
    },

    median: (numbers) => {
        if (numbers.length === 0) return 0;

        const sorted = numbers.sort(math.compareTo);
        const middle = Math.ceil(sorted.length / 2);

        if (sorted.length % 2 === 0) {
            return (sorted[middle] + sorted[middle - 1]) / 2;
        }

        return sorted[middle];
    },

    mean: (numbers) => {
        if (numbers.length === 0) return 0;

        return numbers.reduce((acc, curr) => acc + curr, 0) / numbers.length;
    },

    lcm: (a, b) => {
        let min = Math.min(a, b);
        while (!(min % a === 0 && min % b === 0)) min++;

        return min;
    },

    parseExpression: (expression) => {
        return Function(`'use strict'; return (${expression})`)();
    }
};

const sets = {
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

const grids = {
    adjacent: (grid, point, includeDiagonal = false) => {
        return point.adjacent(includeDiagonal)
            .filter((p) => p.x() >= 0 && p.x() <= grid[0].length - 1 && p.y() >= 0 && p.y() <= grid.length - 1)
            .map((p) => grid[p.y()][p.x()]);
    },

    bfs: (grid, start, filterNeighbors = (n, c) => true) => {
        const queue = [];
        const visited = new Set([start.point.toString()]);
        const distances = new Map();
        distances.set(start.point, 0);

        queue.push(start);

        while (queue.length) {
            const curr = queue.shift();

            grids.adjacent(grid, curr.point)
                .filter((n) => !visited.has(n.point.toString()))
                .filter((n) => filterNeighbors(n, curr))
                .forEach((n) => {
                    const tmp = curr.distance + 1;
                    if (!distances.has(n.point) || tmp < distances.get(n.point)) {
                        distances.set(n.point, tmp);
                        queue.push(n);
                    }
                });
        }

        return distances;
    },

    column: (input, col) => {
        return input.map((row) => row[col]);
    },

    allColumns: (input) => {
        return lists.range(0, input.length).map((c) => grids.column(input, c));
    }
};

const points = {
    directionToDelta: (direction, num = 1) => {
        switch (direction) {
            case 'R':
            case 'E':
            case '>':
                return new Point([num, 0]);
            case 'L':
            case 'W':
            case '<':
                return new Point([-num, 0]);
            case 'U':
            case 'N':
            case '^':
                return new Point([0, -num]);
            case 'D':
            case 'S':
            case 'V':
            case 'v':
                return new Point([0, num]);
            case 'NW':
                return new Point([-num, -num]);
            case 'NE':
                return new Point([num, -num]);
            case 'SW':
                return new Point([-num, num]);
            case 'SE':
                return new Point([num, num]);
        }
    },

    expand: (from, to, inclusive = true) => {
        const [x0, y0] = Array.isArray(from) ? from : from.val;
        const [x1, y1] = Array.isArray(to) ? to : to.val;

        const list = [];
        const xStart = Math.min(x0, x1);
        const xEnd = Math.max(x0, x1);
        const yStart = Math.min(y0, y1);
        const yEnd = Math.max(y0, y1);

        for (let x = xStart; x <= xEnd; x++) {
            for (let y = yStart; y <= yEnd; y++) {
                const p = new Point([x, y]);
                if (inclusive || (!p.eq(from) && !p.eq(to))) {
                    list.push(p);
                }
            }
        }

        return list;
    },

    getBounds: (points) => {
        const bounds = {
            min: [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
            max: [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY]
        };

        for (const p of points) {
            bounds.min = p.map((v, i) => Math.min(v, bounds.min[i]));
            bounds.max = p.map((v, i) => Math.max(v, bounds.max[i]));
        }

        return bounds;
    }
};

module.exports = {
    inputs,
    lists,
    math,
    sets,
    grids,
    points,
    Point,
};
