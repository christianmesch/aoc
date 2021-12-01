const args = process.argv;

const input = require('./utils').read(args[2]);

const parenthesis = /\((?=[^\(]*$)[^\)]+\)/;
const terms = /\s[\+\*]\d+/;

const part1 = () => {
  let found = input[1].match(parenthesis);
  console.log(found);

  while (found.length !== 0) {
    const xx = ('' + found[0]).match(terms);
    console.log(xx);
    break;
  }
};

const part2 = () => {};

if (!args[3] || args[3] === '1') {
  console.log(part1());
} else {
  console.log(part2());
}
