const args = process.argv;
const { inputs } = require('./utils');

const input = inputs
    .read(args[2]);

const part1 = () => {

};

const part2 = () => {

};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
