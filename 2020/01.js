const args = process.argv;

const input = require('./utils')
  .readInt(args[2])
  .sort((a, b) => a - b);

const part1 = (input) => {
  for (let higher = input.length - 1; higher >= 0; higher--) {
    for (let lower = 0; lower < higher; lower++) {
      const addition = input[higher] + input[lower];
      if (addition > 2020) {
        break;
      }

      if (addition === 2020) {
        return input[higher] * input[lower];
      }
    }
  }
};

const part2 = (input) => {
  for (let higher = input.length - 1; higher >= 2; higher--) {
    for (let lower = 0; lower < higher; lower++) {
      for (let mid = higher - 1; mid > lower; mid--) {
        const addition = input[higher] + input[lower] + input[mid];
        if (addition > 2020) {
          break;
        }

        if (addition === 2020) {
          return input[higher] * input[lower] * input[mid];
        }
      }
    }
  }
};

if (!args[3] || args[3] === '1') {
  console.log(part1(input));
} else {
  console.log(part2(input));
}
