const args = process.argv;

const input = require('./utils').readInt(args[2]);
const preamble = args[2].includes('example') ? 5 : 25;

const verify = (index) => {
  const val = input[index];
  for (let i = index - preamble; i < index; i++) {
    for (let j = i + 1; j < index; j++) {
      if (input[i] + input[j] === val) {
        return true;
      }
    }
  }

  return false;
};

const part1 = () => {
  for (let i = preamble; i < input.length; i++) {
    if (!verify(i)) return input[i];
  }
};

const part2 = () => {
  const invalid = part1();

  for (let i = 0; i < input.length; i++) {
    let min = input[i];
    let max = input[i];
    let sum = input[i];

    for (let j = 1; j < input.length - i; j++) {
      sum += input[i + j];
      min = min < input[i + j] ? min : input[i + j];
      max = max > input[i + j] ? max : input[i + j];

      if (sum === invalid) return min + max;
      if (sum > invalid) break;
    }
  }
};

if (!args[3] || args[3] === '1') {
  console.log(part1());
} else {
  console.log(part2());
}
