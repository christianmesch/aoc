const args = process.argv;
const { inputs, grids } = require('./utils');

const [locks, keys] = inputs
    .read(args[2], '\n\n')
    .reduce((acc, curr) => {
        const c = curr.split('\n').map((row) => row.split(''));
        const counts = grids.rotate(c, true).map((row) => row.filter((cell) => cell === '#').length - 1);

        if (c[0].every((cell) => cell === '#')) {
            acc[0].push(counts);
        } else {
            acc[1].push(counts);
        }

        return acc;
    }, [[], []]);

const part1 = () => {
    return locks.reduce((acc, lock) => {
        for (const key of keys) {
            if (key.every((k, i) => k + lock[i] <= 5)) acc++;
        }

        return acc;
    }, 0);
};

const part2 = () => {

};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
