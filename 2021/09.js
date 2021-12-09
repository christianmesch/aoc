const args = process.argv;

const input = require('./utils')
  .read(args[2]).map((v) => v.split('').map((c) => parseInt(c, 10)));

const adjacent = (input, x, y) => {
  const list = [];
  if (x !== 0) list.push([x - 1, y, input[y][x - 1]]);
  if (x !== input[0].length - 1) list.push([x + 1, y, input[y][x + 1]]);
  if (y !== 0) list.push([x, y - 1, input[y - 1][x]]);
  if (y !== input.length - 1) list.push([x, y + 1, input[y + 1][x]]);

  return list;
}

const lowPoints = (input) => {
  return input.flatMap((row, y) =>
    row.reduce((acc, curr, x) => {
      if (adjacent(input, x, y).every(([, , a]) => curr < a)) acc.push([x, y, curr]);
      return acc;
    }, [])
  )
};

const part1 = (input) => {
  return lowPoints(input).reduce((acc, [, , v]) => acc + v + 1, 0);
};

const part2 = (input) => {
  const visited = new Set();
  const lows = lowPoints(input);

  const res = lows.map((low) => {
    const stack = [low];
    const basin = [];

    while (stack.length !== 0) {
      const [x, y, v] = stack.pop();
      if (visited.has(`${x},${y}`)) continue;

      visited.add(`${x},${y}`);
      basin.push([x, y, v]);

      const ad = adjacent(input, x, y)
        .filter(([, , av]) => av !== 9 && av > v);

      stack.push(...ad);
    }

    return basin;
  }).map((b) => b.length)
    .sort((a, b) => b - a);

  return res[0] * res[1] * res[2];
};

if (!args[3] || args[3] === '1') {
  console.log(part1(input));
} else {
  console.log(part2(input));
}
