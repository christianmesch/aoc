const args = process.argv;
const { inputs } = require('./utils');

const input = inputs
    .read(args[2])
    .map((row) => {
        const split = row.split(' ');
        return {
            p: split[0].match(/\d+/g).map(Number),
            v: split[1].match(/-?\d+/g).map(Number)
        };
    });

const part1 = () => {
    //const size = [11, 7];
    const size = [101, 103];
    const seconds = 100;
    const robots = input
        .map((robot) => robot.p.map((v, i) => (seconds * size[i] + (v + seconds * robot.v[i])) % size[i]))
        .reduce((acc, curr) => {
            const mid = [Math.floor(size[0] / 2), Math.floor(size[1] / 2)];
            if (curr[0] < mid[0] && curr[1] < mid[1]) acc[0]++;
            if (curr[0] > mid[0] && curr[1] < mid[1]) acc[1]++;
            if (curr[0] < mid[0] && curr[1] > mid[1]) acc[2]++;
            if (curr[0] > mid[0] && curr[1] > mid[1]) acc[3]++;
            return acc;
        }, [0, 0, 0, 0])
        .reduce((acc, curr) => acc * curr, 1);
    return robots;
};

const part2 = () => {
    const size = [101, 103];
    let seconds = 5000;
    while (true) {
        const robots = input
            .map((robot) => robot.p.map((v, i) => (seconds * size[i] + (v + seconds * robot.v[i])) % size[i]));
        if (robots.length === (new Set(robots.map((r) => r.join(',')))).size) {
            return seconds;
        }

        seconds++;
    }
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
