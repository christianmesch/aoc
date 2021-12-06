const args = process.argv;

const input = require('./utils')
  .readInt(args[2], ',');

const mem = new Map();

const fish = (days) => {
  // Fish never dies and doesn't multiply
  if (days < 1) return 1;
  // Creates new fish and "restart" itself
  if (!mem.has(days - 9)) mem.set(days - 9, fish(days - 9));
  if (!mem.has(days - 7)) mem.set(days - 7, fish(days - 7));
  return mem.get(days - 9) + mem.get(days - 7);
};

const solve = (input, days) => {
  return input.map((c) => fish(days - c)).reduce((acc, curr) => acc += curr, 0);
}

if (!args[3] || args[3] === '1') {
  console.log(solve(input, 80));
} else {
  console.log(solve(input, 256));
}
