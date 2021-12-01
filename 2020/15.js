const args = process.argv;

const input = require('./utils')
  .read(args[2])[0]
  .split(',')
  .map((x) => parseInt(x));

const mem = new Map();

const solve = (turns) => {
  input.forEach((num, turn) => mem.set(num, turn + 1));
  let next = 0;

  for (let turn = input.length + 1; turn < turns; turn++) {
    const curr = next;
    next = mem.has(curr) ? turn - mem.get(curr) : 0;
    mem.set(curr, turn);
  }

  return next;
};

if (!args[3] || args[3] === '1') {
  console.log(solve(2020));
} else {
  console.log(solve(30000000));
}
