const args = process.argv;
const { inputs, Point, points, MSet } = require('./utils');

const surface = inputs
    .read(args[2])
    .map((v) => v.split(''));

const start = surface.flatMap((yv, y) => 
    yv.reduce((acc, curr, x) => curr === 'S' ? [new Point([x, y])] : acc, []))[0];

const pipes = [
    ['-', '7', 'J'], ['-', 'F', 'L'], ['|', 'L', 'J'], ['|', '7', 'F']
];

const connections = new Map([
    ['-', [new Point([1, 0]), new Point([-1, 0])]],
    ['|', [new Point([0, 1]), new Point([0, -1])]],
    ['L', [new Point([0, -1]), new Point([1, 0])]],
    ['7', [new Point([-1, 0]), new Point([0, 1])]],
    ['F', [new Point([1, 0]), new Point([0, 1])]],
    ['J', [new Point([0, -1]), new Point([-1, 0])]]
]);

const findStartPipe = (p, n) => {
    const dp = start.remove(p);
    const dn = n.remove(start);

    if (dp.x() === 1 && dn.x() === 1 || dp.x() === -1 && dn.x() === -1) return '-';
    if (dp.x() === 1 && dn.y() === 1) return '7';
    if (dp.x() === 1 && dn.y() === -1) return 'J';
    if (dp.x() === -1 && dn.y() === 1) return 'F';
    if (dp.x() === -1 && dn.y() === -1) return 'L';
    
    if (dp.y() === 1 && dn.y() === 1 || dp.y() === -1 && dn.y() === -1) return '|';
    if (dp.y() === 1 && dn.x() === 1) return 'L';
    if (dp.y() === 1 && dn.x() === -1) return 'J';
    if (dp.y() === -1 && dn.x() === 1) return 'F';
    if (dp.y() === -1 && dn.x() === -1) return '7';
};

const getLoop = () => {
    const loop = [['S', start]];

    let curr = start.adjacent()
        .filter((p, i) => {
            if (p.x() < 0 || p.y() < 0 || p.x() > surface[0].length - 1 || p.y() > surface.length - 1)
                return false;
            return pipes[i].includes(surface[p.y()][p.x()]);
        }).map((p) => [surface[p.y()][p.x()], p])[0];

    while(!curr[1].eq(start)) {
        loop.push(curr);
        curr = connections.get(surface[curr[1].y()][curr[1].x()])
            .map((d) => {
                const p = curr[1].add(d);
                return [surface[p.y()][p.x()], p];
            }).filter(([, p]) => !p.eq(loop.at(-2)[1]))[0];
    }

    loop[0][0] = findStartPipe(loop.at(-1)[1], loop[1][1]);

    return loop;
};

const part1 = () => {
    return getLoop().length / 2;
};

const part2 = () => {
    const loop = getLoop().sort(([, a], [, b]) => {
        if (a.y() === b.y()) return a.x() - b.x();
        return a.y() - b.y();
    });
    
    let currY = 0;
    let prevCurve = '.';
    let isInside = false;
    let count = 0;
    for (let i = 1; i < loop.length; i++) {
        const [pipe, p] = loop[i];

        if (p.y() !== currY) {
            currY = p.y();
            prevCurve = '.';
            isInside = false;
        }

        if (pipe === '|' || (prevCurve === 'L' && pipe === '7') || (prevCurve === 'F' && pipe === 'J'))
            isInside = !isInside;

        if (['L', 'F'].includes(pipe)) prevCurve = pipe;

        if (isInside) count += loop[i + 1][1].x() - p.x() - 1;
    }

    return count;
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
