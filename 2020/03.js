const args = process.argv;

const input = require('./utils').read(args[2]);

const width = input[0].length;

const part1 = (input, right, down) => {
  let trees = 0;

  for (let i = down; i < input.length; i += down) {
    if (input[i][((i / down) * right) % width] === '#') trees++;
  }

  return trees;
};

const part2 = (input) => {
  return [
    { r: 1, d: 1 },
    { r: 3, d: 1 },
    { r: 5, d: 1 },
    { r: 7, d: 1 },
    { r: 1, d: 2 },
  ]
    .map((x) => part1(input, x.r, x.d))
    .reduce((acc, curr) => acc * curr, 1);
};

if (!args[3] || args[3] === '1') {
  console.log(part1(input, 3, 1));
} else {
  console.log(part2(input));
}
