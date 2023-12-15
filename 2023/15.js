const args = process.argv;
const { inputs } = require('./utils');

const input = inputs
    .read(args[2], ',');

const hash = (line) => {
    return line.split('').map((c) => c.charCodeAt(0))
        .reduce((acc, curr) => ((acc + curr) * 17) % 256, 0);
};

const boxes = new Array(256).fill(undefined).map(() => []);

const hashmap = (line) => {
    const [, label, operation, focal] = line.match(/(^.+)([\-,\=])(.+$)?/);
    const box = hash(label);

    if (operation === '-') {
        boxes[box] = boxes[box].filter((v) => v.label !== label);
    } else if (operation === '=') {
        const i = boxes[box].findIndex((v) => v.label === label);
        if (i === -1) {
            boxes[box].push({ label, focal });
        } else {
            boxes[box].splice(i, 1, { label, focal });
        }
    }
};

const part1 = () => {
    return input.map(hash).reduce((acc, curr) => acc + curr, 0);
};

const part2 = () => {
    input.forEach(hashmap);

    return boxes.flatMap((box, bi) =>
        box.map((lens, li) => (bi + 1) * (li + 1) * lens.focal)
    ).reduce((acc, curr) => acc + curr, 0);
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
