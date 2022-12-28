const args = process.argv;
const utils = require('./utils');

let [iMap, iMoves] = utils
    .read(args[2], '\n\n');

iMap = iMap.split('\n');

const length = iMap.slice().sort((a, b) => b.length - a.length)[0].length;
const map = iMap.map((r) => {
    const arr = new Array(length).fill().map(() => ' ');
    const split = r.split('')
    for (let i = 0; i < split.length; i++) {
        arr[i] = split[i];
    }

    return arr;
});

const moves = iMoves.match(/\d+[RL]*/g)
    .flatMap((m) => {
        if (['L', 'R'].includes(m.at(-1))) {
            return [Number(m.slice(0, -1)), m.at(-1)];
        }

        return [Number(m)];
    });

let pos = {x: map[0].findIndex((v) => v === '.'), y: 0};
let facing = {x: 1, y: 0};

const facingPoint = (facing) => {
    if (facing.x === 1) return 0;
    if (facing.x === -1) return 2;
    if (facing.y === 1) return 1;
    if (facing.y === -1) return 3;
}

const part1 = () => {
    for (const move of moves) {
        if (Number.isInteger(move)) {
            for (let i = 0; i < move; i++) {
                const futPos = utils.coord.add(pos, facing, true);

                if (facing.x === 1 && (futPos.x === map[futPos.y].length || map[futPos.y][futPos.x] === ' ')) {
                    futPos.x = map[futPos.y].findIndex((v) => ['.', '#'].includes(v));
                } else if (facing.x === -1 && (futPos.x === -1 || map[futPos.y][futPos.x] === ' ')) {
                    futPos.x = utils.findLastIndex(map[futPos.y], (v) => ['.', '#'].includes(v));
                } else {
                    const col = utils.grid.column(map, futPos.x);

                    if (facing.y === 1 && (futPos.y === col.length || col[futPos.y] === ' ')) {
                        futPos.y = col.findIndex((v) => ['.', '#'].includes(v));
                    } else if (facing.y === -1 && (futPos.y === -1 || col[futPos.y] === ' ')) {
                        futPos.y = utils.findLastIndex(col, (v) => ['.', '#'].includes(v));
                    }
                }

                if (map[futPos.y][futPos.x] === '#') break;
                pos = futPos;
            }
        } else {
            facing = utils.coord.rotate(facing, move);
        }
    }

    return 1000 * (pos.y + 1) + 4 * (pos.x + 1) + facingPoint(facing);
};

const cubePos = (futPos, facing) => {
    const xDelta = futPos.x % 50;
    const yDelta = futPos.y % 50;

    if (facing.x === 1) {
        if (0 <= futPos.y && futPos.y <= 49) {
            return [{x: 99, y: 149 - yDelta}, {x: -1, y: 0}];
        } else if (50 <= futPos.y && futPos.y <= 99) {
            return [{x: 100 + yDelta, y: 49}, {x: 0, y: -1}];
        } else if (100 <= futPos.y && futPos.y <= 149) {
            return [{x: 149, y: 49 - yDelta}, {x: -1, y: 0}];
        } else if (150 <= futPos.y && futPos.y <= 199) {
            return [{x: 50 + yDelta, y: 149}, {x: 0, y: -1}];
        }
    } else if (facing.x === -1) {
        if (0 <= futPos.y && futPos.y <= 49) {
            return [{x: 0, y: 149 - yDelta}, {x: 1, y: 0}];
        } else if (50 <= futPos.y && futPos.y <= 99) {
            return [{x: yDelta, y: 100}, {x: 0, y: 1}];
        } else if (100 <= futPos.y && futPos.y <= 149) {
            return [{x: 50, y: 49 - yDelta}, {x: 1, y: 0}];
        } else if (150 <= futPos.y && futPos.y <= 199) {
            return [{x: 50 + yDelta, y: 0}, {x: 0, y: 1}];
        }
    } else if (facing.y === 1) {
        if (0 <= futPos.x && futPos.x <= 49) {
            return [{x: 100 + xDelta, y: 0}, {x: 0, y: 1}];
        } else if (50 <= futPos.x && futPos.x <= 99) {
            return [{x: 49, y: 150 + xDelta}, {x: -1, y: 0}];
        } else if (100 <= futPos.x && futPos.x <= 149) {
            return [{x: 99, y: 50 + xDelta}, {x: -1, y: 0}];
        }
    } else if (facing.y === -1) {
        if (0 <= futPos.x && futPos.x <= 49) {
            return [{x: 50, y: 50 + xDelta}, {x: 1, y: 0}];
        } else if (50 <= futPos.x && futPos.x <= 99) {
            return [{x: 0, y: 150 + xDelta}, {x: 1, y: 0}];
        } else if (100 <= futPos.x && futPos.x <= 149) {
            return [{x: xDelta, y: 199}, {x: 0, y: -1}];
        }
    }
};

const part2 = () => {
    for (const move of moves) {
        if (Number.isInteger(move)) {
            for (let i = 0; i < move; i++) {
                let futPos = utils.coord.add(pos, facing, true);
                let futFacing = {...facing};

                if (facing.x === 1 && (futPos.x === map[futPos.y].length || map[futPos.y][futPos.x] === ' ')) {
                    [futPos, futFacing] = cubePos(futPos, facing);
                } else if (facing.x === -1 && (futPos.x === -1 || map[futPos.y][futPos.x] === ' ')) {
                    [futPos, futFacing] = cubePos(futPos, facing);
                } else {
                    const col = utils.grid.column(map, futPos.x);

                    if (facing.y === 1 && (futPos.y === col.length || col[futPos.y] === ' ')) {
                        [futPos, futFacing] = cubePos(futPos, facing);
                    } else if (facing.y === -1 && (futPos.y === -1 || col[futPos.y] === ' ')) {
                        [futPos, futFacing] = cubePos(futPos, facing);
                    }
                }

                if (map[futPos.y][futPos.x] === '#') break;
                pos = futPos;
                facing = futFacing;
            }
        } else {
            facing = utils.coord.rotate(facing, move);
        }
    }

    return 1000 * (pos.y + 1) + 4 * (pos.x + 1) + facingPoint(facing);
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
