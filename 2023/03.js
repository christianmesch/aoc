const args = process.argv;
const { inputs, strings, Point } = require('./utils');

const input = inputs
    .read(args[2]);

const symbols = (regex) => {
    return input.flatMap((line, y) => line.split('').reduce((acc, curr, x) => {
        if (curr.match(regex)) {
            acc.push(new Point([x, y]));
        }
        return acc;
    }, []));
};

const numbers = input
    .flatMap((line, y) => strings.match(line, /\d+/gi).map(([n, b, e]) => [Number(n), b, e, y]));

const part1 = () => {
    return numbers.filter(([, xb, xe, y]) => symbols(/[^\w\s\d\.]/)
        .flatMap((p) => p.adjacent(true))
        .some((p) => p.y() == y && p.x() >= xb && p.x() <= xe))
        .reduce((acc, [curr]) => acc + curr, 0);
};

const part2 = () => {
    return symbols(/[*]/)
        .map((p) => p.adjacent(true))
        .map((points) => numbers.filter(([, xb, xe, y]) => points
            .some((p) => p.y() == y && p.x() >= xb && p.x() <= xe)))
        .filter((n) => n.length === 2)
        .reduce((acc, curr) => acc + (curr[0][0] * curr[1][0]), 0);
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
