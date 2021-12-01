const args = process.argv;

const input = require('./utils')
  .readInt(args[2])
  .sort((a, b) => a - b);

input.unshift(0);
input.push(input[input.length - 1] + 3);

const part1 = () => {
  const diffs = input.map((v, i) => {
    if (i === 0) return 0;
    return v - input[i - 1];
  });

  return (
    diffs.filter((v) => v === 1).length * diffs.filter((v) => v === 3).length
  );
};

const mem = new Map();
const part2 = (v) => {
  if (mem.has(v)) return mem.get(v);
  if (!input.includes(v)) return 0;
  if (v === input[input.length - 1]) return 1;

  const ret = part2(v + 1) + part2(v + 2) + part2(v + 3);
  mem.set(v, ret);
  return ret;
};

if (!args[3] || args[3] === '1') {
  console.log(part1());
} else {
  console.log(part2(0));
}
