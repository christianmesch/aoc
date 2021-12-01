const args = process.argv;

const input = require('./utils').read(args[2]);

const part1 = (input) => {
  return input
    .map((x) => {
      const binary = x.replace(/(F|L)/g, '0').replace(/(B|R)/g, '1');
      const row = parseInt(binary.slice(0, 7), 2);
      const column = parseInt(binary.slice(7), 2);
      return row * 8 + column;
    })
    .sort((a, b) => b - a);
};

const part2 = (input) => {
  const list = part1(input);
  for (let i = 1; i < list.length; i++) {
    if (list[i - 1] - list[i] !== 1) {
      return list[i] + 1;
    }
  }
};

if (!args[3] || args[3] === '1') {
  console.log(part1(input)[0]);
} else {
  console.log(part2(input));
}
