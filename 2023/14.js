const args = process.argv;
const { inputs, Point } = require('./utils');

const input = inputs
    .read(args[2])
    .map((line) => line.split(''));

const asd = input.map((h, y) => h.flatMap((v, x) => v !== '.' ? [v, new Point([x, y])] : []));

const part1 = () => {
    return asd;
};

const part2 = () => {

};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
