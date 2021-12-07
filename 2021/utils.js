const read = (inputFileName, sep = '\n') => {
  return require('fs')
    .readFileSync(inputFileName, 'utf-8')
    .split(sep)
    .filter((x) => x.length != 0);
};

const readInt = (inputFileName, sep = '\n') => {
  return read(inputFileName, sep).map(Number);
};

const range = (start, end) => {
  return new Array(end - start).fill().map((_, i) => i + start);
};

const compareTo = (a, b) => {
  if (a === b) return 0;
  if (a < b) return -1;
  return 1;
}

const median = (numbers) => {
  if (numbers.length === 0) return 0;

  const sorted = numbers.sort(compareTo);
  const middle = Math.ceil(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle] + sorted[middle - 1]) / 2;
  }

  return sorted[middle];
}

const mean = (numbers) => {
  if (numbers.length === 0) return 0;

  return numbers.reduce((acc, curr) => acc + curr, 0) / numbers.length;
}

module.exports = {
  read,
  readInt,
  range,
  compareTo,
  median,
  mean,
};
