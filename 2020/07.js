const args = process.argv;

const input = require('./utils')
  .read(args[2])
  .map((x) => {
    const [outer, inner] = x.split(' bags contain ');
    const innerSplit = inner.split(', ');

    if (innerSplit[0].startsWith('no ')) {
      return {
        outer,
        inner: [],
      };
    }

    const innerArr = innerSplit.map((y) => {
      const ySplit = y.split(' ');

      return {
        amount: parseInt(ySplit[0]),
        color: `${ySplit[1]} ${ySplit[2]}`,
      };
    });

    return {
      outer,
      inner: innerArr === [undefined] ? [] : innerArr,
    };
  });

const inputMap = new Map(input.map((x) => [x.outer, x.inner]));

const part1 = () => {
  const previouslyFound = new Set();
  const newlyFound = new Set(['shiny gold']);
  const allFound = new Set();

  while (newlyFound.size) {
    newlyFound.forEach((x) => previouslyFound.add(x));
    newlyFound.clear();

    previouslyFound.forEach((prev) => {
      input.forEach((inp) => {
        if (inp.inner.map((inner) => inner.color).includes(prev)) {
          newlyFound.add(inp.outer);
          allFound.add(inp.outer);
        }
      });
    });

    previouslyFound.clear();
  }

  return allFound.size;
};

const part2 = (inner) => {
  return inner
    .map((x) => x.amount * part2(inputMap.get(x.color)))
    .reduce((acc, curr) => acc + curr, 1);
};

if (!args[3] || args[3] === '1') {
  console.log(part1());
} else {
  console.log(part2(inputMap.get('shiny gold')) - 1);
}
