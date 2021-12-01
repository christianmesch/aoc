const args = process.argv;

const input = require('./utils')
  .readInt(args[2]);

const countLargerThanPrevious = (acc, curr, i, arr) => {
  if (i !== 0 && curr > arr[i - 1]) return acc + 1;
  return acc;
}; 

const part1 = (input) => {
  return input.reduce(countLargerThanPrevious, 0);
};

const part2 = (input) => {
  return input.reduce((acc, curr, i, arr) => {
    if (i !== arr.length - 1 && i !== arr.length - 2) {
      acc.push(curr + arr[i + 1] + arr[i + 2]);
    }
    return acc;
  }, [])
  .reduce(countLargerThanPrevious, 0);
};

if (!args[3] || args[3] === '1') {
  console.log(part1(input));
} else {
  console.log(part2(input));
}
