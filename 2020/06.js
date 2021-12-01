const args = process.argv;

const input = require('./utils')
  .read(args[2], '\n\n')
  .map((x) => x.split('\n'));

const part1 = (input) => {
  return input
    .map((x) => x.flatMap((y) => y.split('')))
    .map((x) => {
      const set = new Set(x);
      return set.size;
    })
    .reduce((acc, curr) => acc + curr, 0);
};

const part2 = (input) => {
  return input
    .map((x) =>
      x
        .map((y) => y.split(''))
        .reduce((acc, curr) => {
          const intersection = new Set();
          for (let e of curr) {
            if (acc.has(e)) {
              intersection.add(e);
            }
          }

          return intersection;
        }, new Set(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']))
    )
    .map((x) => {
      return x.size;
    })
    .reduce((acc, curr) => acc + curr, 0);
};

if (!args[3] || args[3] === '1') {
  console.log(part1(input));
} else {
  console.log(part2(input));
}
