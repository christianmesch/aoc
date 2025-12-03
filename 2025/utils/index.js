const { Point } = require('./point');
const { Value } = require('./value');
const { Cache } = require('./cache');
const { MSet } = require('./mset');
const { MMap } = require('./mmap');
const { PriorityQueue } = require('./priority-queue');
const { sets } = require('./sets');

const inputs = {
    read: (inputFileName, sep = '\n', leaveEmpty = false) => {
        return require('fs')
            .readFileSync(inputFileName, 'utf-8')
            .split(sep)
            .filter((x) => leaveEmpty || x.length !== 0);
    },

    readInt: (inputFileName, sep = '\n', leaveEmpty = false) => {
        return inputs.read(inputFileName, sep, leaveEmpty).map(Number);
    },

    readMatch: (inputFileName, regex) => {
        return require('fs')
            .readFileSync(inputFileName, 'utf-8')
            .match(regex);
    },

    readParts: (inputFileName, parts = []) => {
        return require('fs')
            .readFileSync(inputFileName, 'utf-8')
            .split('\n\n')
            .map((x, i) => parts[i](x));
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

    permWithRep: (vals = [], k = 0) => {
        // https://rosettacode.org/wiki/Permutations_with_repetitions#ES6

        // replicateM n act performs the action n times, gathering the results.
        // replicateM :: (Applicative m) => Int -> m a -> m [a]
        const replicateM = (n, f) => {
            const loop = x => x <= 0 ? [
                []
            ] : liftA2(cons, f, loop(x - 1));
            return loop(n);
        };

        // Lift a binary function to actions.
        // liftA2 :: Applicative f => (a -> b -> c) -> f a -> f b -> f c
        const liftA2 = (f, a, b) =>
            listApply(a.map(curry(f)), b);

        // <*>
        // listApply :: [(a -> b)] -> [a] -> [b]
        const listApply = (fs, xs) =>
            [].concat.apply([], fs.map(f =>
            [].concat.apply([], xs.map(x => [f(x)]))));

        // curry :: ((a, b) -> c) -> a -> b -> c
        const curry = f => a => b => f(a, b);

        // cons :: a -> [a] -> [a]
        const cons = (x, xs) => [x].concat(xs);

        return replicateM(k, vals);
    },

    cartesian: (a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat()))),

    findLastIndex: (arr, pred = (v, i, arr) => true) => {
        let i = arr.length;
        while (i--) {
            if (pred(arr[i], i, arr)) {
                return i;
            }
        }

        return -1;
    },

    findAllIndexes: (arr, value) => {
        const indexes = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === value) indexes.push(i);
        }

        return indexes;
    },

    indexOfMax: (arr) => {
        return arr.reduce((maxI, currV, currI, array) => currV > array[maxI] ? currI : maxI, 0);
    },

    toChunks: (arr, chunkSize = 1) => {
        const res = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            res.push(arr.slice(i, i + chunkSize));
        }

        return res;
    },

    compareTo: (a, b) => {
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return a[i] - b[i];
        }

        return 0;
    }
};

const math = {
    randomInt: (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    },

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

    gcd: (a, b) => {
        if (b === 0) return a;
        return math.gcd(b, a % b);
    },

    lcm: (...vals) => {
        const arr = vals.flat();
        let res = arr[0];
        for (let i = 1; i < arr.length; i++) {
            res = (arr[i] * res) / math.gcd(arr[i], res);
        }

        return res;
    },

    simpleToPrimes: (num) => {
        const factors = [];
        let div = 2;

        while (num >= 2) {
            if (num % div === 0) {
                factors.push(div);
                num /= div;
            } else {
                div++;
            }
        }

        return factors;
    },

    parseExpression: (expression) => {
        return Function(`'use strict'; return (${expression})`)();
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
                    const tmp = distances.get(curr.point) + 1;
                    if (!distances.has(n.point) || tmp < distances.get(n.point)) {
                        distances.set(n.point, tmp);
                        queue.push(n);
                    }
                });
        }

        return distances;
    },

    tileBfs: (tiles, start, filterNeighbors = (n, c) => true) => {
        const queue = [];
        const visited = new Set([start.point.toString()]);
        const distances = new Map();
        distances.set(start.point, 0);

        queue.push(start);

        while (queue.length) {
            const curr = queue.shift();

            curr.point.adjacent()
                .map((n) => tiles.get(n))
                .filter((n) => n)
                .filter((n) => !visited.has(n.point.toString()))
                .filter((n) => filterNeighbors(n, curr))
                .forEach((n) => {
                    const tmp = distances.get(curr.point) + 1;
                    if (!distances.has(n.point) || tmp < distances.get(n.point)) {
                        distances.set(n.point, tmp);
                        queue.push(n);
                    }
                });
        }

        return distances;
    },

    simplePaths: (grid, start, end, filterNeighbors = (n, c) => true) => {
        const paths = [];
        const visited = new Set([start.point.toString()]);

        const dfs = (curr, path) => {
            if (curr.point.eq(end.point)) {
                paths.push(path);
                return;
            }

            grids.adjacent(grid, curr.point)
                .filter((n) => !visited.has(n.point.toString()))
                .filter((n) => filterNeighbors(n, curr))
                .forEach((n) => {
                    visited.add(n.point.toString());
                    dfs(n, path.concat([n]));
                    visited.delete(n.point.toString());
                });
        };

        dfs(start, [start]);
        return paths;
    },

    column: (input, col) => {
        return input.map((row) => row[col]);
    },

    transpose: (grid) => {
        return lists.range(0, grid[0].length).map((c) => grids.column(grid, c));
    },

    rotate: (grid, clockwise = false) => {
        const r = clockwise ? lists.range(0, grid[0].length) : lists.range(0, grid[0].length).reverse();
        return r.map((c) => clockwise ? grids.column(grid, c).reverse() : grids.column(grid, c));
    },

    fromBounds: (bounds, defaultValue = () => undefined) => {
        return new Array(bounds.max[1] - bounds.min[1] + 1).fill(undefined).map((yv, y) =>
            new Array(bounds.max[0] - bounds.min[0] + 1).fill(undefined).map((xv, x) => defaultValue(x, y, xv, yv)));
    },

    toBounds: (grid) => {
        return {
            min: [0, 0], max: [grid[0].length - 1, grid.length - 1]
        };
    },

    print: (grid, printVal = (v) => v) => {
        for (const row of grid) {
            console.log(row.map((v) => v === undefined ? '.' : printVal(v)).join(''));
        }
    }
};

const deltas = {
    deltas: [new Point([1, 0]), new Point([0, 1]), new Point([-1, 0]), new Point([0, -1])],

    directions: ['E', 'S', 'W', 'N'],

    turn: (delta, clockwise = true) => {
        const index = deltas.deltas.findIndex((d) => d.eq(delta));
        const newIndex = (index + (clockwise ? 1 : -1) + deltas.deltas.length) % deltas.deltas.length;
        return deltas.deltas[newIndex].copy();
    },

    directionToDelta: (direction) => {
        switch (direction) {
            case 'R':
            case 'E':
            case '>':
            case '0':
                return new Point([1, 0]);
            case 'L':
            case 'W':
            case '<':
            case '2':
                return new Point([-1, 0]);
            case 'U':
            case 'N':
            case '^':
            case '3':
                return new Point([0, -1]);
            case 'D':
            case 'S':
            case 'V':
            case 'v':
            case '1':
                return new Point([0, 1]);
        }
    },

    deltaToDirection: (delta) => {
        return deltas.directions[deltas.deltas.findIndex((d) => d.eq(delta))];
    }
};

const points = {
    directionToDelta: (direction, num = 1) => {
        switch (direction) {
            case 'R':
            case 'E':
            case '>':
            case '0':
                return new Point([num, 0]);
            case 'L':
            case 'W':
            case '<':
            case '2':
                return new Point([-num, 0]);
            case 'U':
            case 'N':
            case '^':
            case '3':
                return new Point([0, -num]);
            case 'D':
            case 'S':
            case 'V':
            case 'v':
            case '1':
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

    getBounds: (ps) => {
        const bounds = {
            min: [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
            max: [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY]
        };

        for (const p of ps) {
            bounds.min = p.val.map((v, i) => Math.min(v, bounds.min[i]));
            bounds.max = p.val.map((v, i) => Math.max(v, bounds.max[i]));
        }

        return bounds;
    },

    shoelace: (ps) => {
        let sum = 0;
        for (let i = 0; i < ps.length - 1; i++) {
            const p1 = ps.at(i);
            const p2 = ps.at((i + 1) % ps.length);
            sum += (p1.x() * p2.y() - p2.x() * p1.y());
        }

        return Math.abs(sum) / 2;
    },

    toGrid: (ps, defaultValue = () => undefined) => {
        const bounds = points.getBounds(ps);
        const grid = grids.fromBounds(bounds, defaultValue);

        ps.forEach((p) => {
            grid[p.y() - bounds.min[1]][p.x() - bounds.min[0]] = '#';
        });

        return grid;
    },

    print: (ps) => {
        grids.print(points.toGrid(ps));
    }
};

const strings = {
    match: (line, regex) => {
        let res = [];
        let m;
        while ((m = regex.exec(line)) !== null) {
            res.push([m[0], m.index, regex.lastIndex - 1]);
        }

        return res;
    },

    replaceAt: (string = '', index, value) => {
        return string.slice(0, index) + value + string.slice(index + 1);
    }
};

module.exports = {
    inputs,
    lists,
    math,
    sets,
    grids,
    deltas,
    points,
    strings,
    Point,
    Value,
    Cache,
    MSet,
    MMap,
    PriorityQueue
};
