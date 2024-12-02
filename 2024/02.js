const args = process.argv;
const { inputs } = require('./utils');

const input = inputs
    .read(args[2])
    .map((row) => row.split(' ').map((n) => Number(n)));

const isSafe = (report) => {
    return report.every((val, i) => {
        if (i === 0) return true;
        const res = report[i - 1] - val;
        return res > 0 && res <= 3;
    })
    ||
    report.every((val, i) => {
        if (i === 0) return true;
        const res = val - report[i - 1];
        return res > 0 && res <= 3;
    });
};

const part1 = () => {
    return input.filter(isSafe).length;
};

const part2 = () => {
    return input.filter((report) => {
        for (let i = 0; i < report.length; i++) {
            const spliced = report.filter((_, idx) => i !== idx);
            if (isSafe(spliced)) return true;
        }

        return false;
    }).length;
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
