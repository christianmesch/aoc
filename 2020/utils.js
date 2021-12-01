const read = (inputFileName, sep = '\n') => {
  return require('fs')
    .readFileSync(inputFileName, 'utf-8')
    .split(sep)
    .filter((x) => x.length != 0);
};

const readInt = (inputFileName) => {
  return read(inputFileName).map((x) => parseInt(x));
};

const range = (start, end) => {
  return new Array(end - start).fill().map((_, i) => i + start);
};

module.exports = {
  read,
  readInt,
  range,
};
