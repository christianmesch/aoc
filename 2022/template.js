const args = process.argv;

const input = require('./utils')
    .readInt(args[2]);

const part1 = (input) => {

};

const part2 = (input) => {

};

if (!args[3] || args[3] === '1') {
    console.log(part1(input));
} else {
    console.log(part2(input));
}
