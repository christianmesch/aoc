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
                return {x: num, y: 0};
            case 'L':
                return {x: -num, y: 0};
            case 'U':
                return {x: 0, y: num};
            case 'D':
                return {x: 0, y: -num};
        }
    },
    add: (coordinate, delta) => {
        coordinate.x += delta.x;
        coordinate.y += delta.y;

        return coordinate;
    },
    sub: (coordinate, delta) => {
        coordinate.x -= delta.x;
        coordinate.y -= delta.y;

        return coordinate;
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
    toCoord: (s) => {
        const split = s.split(',');
        return {x: Number(split[0]), y: Number(split[1])};
    },
    toString: (coordinate) => `${coordinate.x},${coordinate.y}`,
    eq: (a, b) => a.x === b.x && a.y === b.y,
    getBounds: (coords) => {
        const bounds = {
            min: {x: Number.POSITIVE_INFINITY, y: Number.POSITIVE_INFINITY},
            max: {x: Number.NEGATIVE_INFINITY, y: Number.NEGATIVE_INFINITY}
        };

        for (const c of coords) {
            bounds.min.x = Math.min(c.x, bounds.min.x);
            bounds.min.y = Math.min(c.y, bounds.min.y);
            bounds.max.x = Math.max(c.x, bounds.max.x);
            bounds.max.y = Math.max(c.y, bounds.max.y);
        }

        return bounds;
    },
    manhattan: (from, to) => {
        return Math.abs(from.x - to.x) + Math.abs(from.y - to. y);
    }
};

module.exports = {
    read,
    readInt,
    range,
    lists,
    compareTo,
    median,
    mean,
    set,
    grid,
    coord,
};
