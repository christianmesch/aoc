const args = process.argv;

const input = require('./utils')
  .read(args[2]).map((val) => val.split('').map((v) => parseInt(v, 10)));

const frequency = (list, mostCommon = true) => {
  const freq = list.reduce((acc, curr) =>
    acc.map((val, i) => val + curr[i]), new Array(list[0].length).fill(0));

  return mostCommon ? freq.map((f) => f >= (list.length / 2) ? 1 : 0) : freq.map((f) => f < (list.length / 2) ? 1 : 0);
};

const part1 = (input) => {
  const gamma = frequency(input);
  const epsilon = gamma.map((val) => val === 1 ? 0 : 1);

  return parseInt(gamma.join(''), 2) * parseInt(epsilon.join(''), 2);
};

const part2 = (input, mostCommon = true) => {
  let list = input;
  for (let i = 0; i < list[0].length && list.length > 1; i++) {
    const freq = frequency(list, mostCommon);
    list = list.filter((val) => val[i] === freq[i]);
  }

  return parseInt(list[0].join(''), 2);
};

if (!args[3] || args[3] === '1') {
  console.log(part1(input));
} else {
  console.log(part2(input) * part2(input, false));
}
