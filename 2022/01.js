const args = process.argv;

const input = require('./utils')
  .read(args[2], '\n\n')
  .map((c) => c.split('\n')
    .map(Number)
    .reduce((acc, curr) => acc + curr, 0)
  ).sort((a, b) => b - a);

const part1 = (input) => {
  return input[0];
};

const part2 = (input) => {
  return input[0] + input[1] + input[2];
};

if (!args[3] || args[3] === '1') {
  console.log(part1(input));
} else {
  console.log(part2(input));
}
