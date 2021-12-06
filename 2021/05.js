const args = process.argv;

const input = require('./utils')
  .read(args[2]).map((v) => v.split(' -> ')).map(([a, b]) => {
    const [x1, y1] = a.split(',');
    const [x2, y2] = b.split(',');
    return [{ x: parseInt(x1, 10), y: parseInt(y1, 10) }, { x: parseInt(x2, 10), y: parseInt(y2, 10) }];
  });

const compareTo = require('./utils').compareTo;

const mapPoints = ([p1, p2]) => {
  const acc = [];

  for (let i = 0; i <= Math.abs(p1.x - p2.x) || i <= Math.abs(p1.y - p2.y); i++) {
    acc.push({ x: p1.x + (compareTo(p2.x, p1.x) * i), y: p1.y + (compareTo(p2.y, p1.y) * i) })
  }

  return acc;
};

const reduceOverlapping = (acc, curr) => {
  const currS = `${curr.x},${curr.y}`;
  if (acc.has(currS)) {
    acc.set(currS, acc.get(currS) + 1);
  } else {
    acc.set(currS, 1);
  }

  return acc;
};

const solve = (input) => {
  const freq = input
    .flatMap((v) => mapPoints(v))
    .reduce(reduceOverlapping, new Map());

  return [...freq].filter(([_, a]) => a > 1).length;
};

if (!args[3] || args[3] === '1') {
  console.log(solve(input.filter(([p1, p2]) => p1.x === p2.x || p1.y === p2.y)));
} else {
  console.log(solve(input));
}
