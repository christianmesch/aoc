const args = process.argv;

const input = require('./utils')
  .readInt(args[2], ',');

const median = require('./utils').median;

const part1 = (input) => {
  const medianPos = median(input);
  return input.map((pos) => Math.abs(pos - medianPos)).reduce((acc, curr) => acc + curr, 0);
};

const part2 = (input) => {
  // Need to try both roundings
  const meanPosFloor = Math.floor(input.reduce((acc, curr) => acc + curr, 0) / input.length);
  const meanPosCeil = Math.ceil(input.reduce((acc, curr) => acc + curr, 0) / input.length);

  return Math.min(
    input.map((pos) => Math.abs(pos - meanPosFloor)).map((diff) => (diff * diff + diff) / 2).reduce((acc, curr) => acc + curr, 0),
    input.map((pos) => Math.abs(pos - meanPosCeil)).map((diff) => (diff * diff + diff) / 2).reduce((acc, curr) => acc + curr, 0)
  );
};

if (!args[3] || args[3] === '1') {
  console.log(part1(input));
} else {
  console.log(part2(input));
}
