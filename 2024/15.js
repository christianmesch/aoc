const args = process.argv;
const { inputs, Point, points, MMap } = require('./utils');

const map = inputs
    .read(args[2], '\n\n')[0].split('\n')
    .map((row) => !args[3] || args[3] === '1' ? row : 
        row.replaceAll('.', '..').replaceAll('#', '##').replaceAll('O', '[]').replaceAll('@', '@.'))
    .flatMap((row, y) => row.split('').map((val, x) => 
        val !== '.' ? { point: new Point([x, y]), val } : null).filter(p => p))
    .reduce((acc, curr) => acc.set(curr.point, curr), new MMap());

const moves = inputs
    .read(args[2], '\n\n')[1].split('\n')
    .flatMap(move => move.split('')).map((d) => points.directionToDelta(d));

const robot = map.values().filter(({ val }) => val === '@')[0];

const attemptMove = (tile, delta) => {
    const visited = [];
    const queue = [tile];

    while (queue.length) {
        const curr = queue.shift();

        if (visited.some((t) => t.point.eq(curr.point))) continue;

        visited.unshift(curr);

        const newTile = map.get(curr.point.add(delta));
        if (newTile && newTile.val === '#') return [];

        if (newTile && newTile.val === 'O') {
            queue.push(newTile);
        }

        if (newTile && (newTile.val === ']' || newTile.val === '[')) {
            const direction = newTile.val === ']' ? [-1, 0] : [1, 0];
            if (delta.y()) {
                queue.push(newTile);
            } else {
                visited.unshift(newTile);
            }

            queue.push(map.get(newTile.point.add(direction)));
        }
    }

    return visited;
};

const solve = () => {
    for (const move of moves) {
        attemptMove(robot, move).forEach((tile) => {
            map.delete(tile.point);
            tile.point.move(move);
            map.set(tile.point, tile);
        });
    }

    return map.values().filter(({ val }) => val === 'O' || val === '[')
        .map(({ point }) => 100 * point.y() + point.x())
        .reduce((acc, curr) => acc + curr, 0);
};

if (!args[3] || args[3] === '1') {
    console.log(solve());
} else {
    console.log(solve());
}
