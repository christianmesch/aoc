const args = process.argv;

const [ts, unparsed] = require('./utils').read(args[2]);
const shuttles = unparsed.split(',');

const part1 = () => {
  const [b, t] = shuttles
    .filter((x) => x !== 'x')
    .map((x) => parseInt(x))
    .map((x) => [x, x - (ts % x)])
    .sort(([_a, a], [_b, b]) => a - b)[0];

  return b * t;
};

const part2 = () => {
  const b = shuttles
    .map((v, i) => [v, i])
    .filter(([v, _]) => v !== 'x')
    .map(([v, i]) => [parseInt(v), i]);
  const multi = b.reduce((acc, [curr, _]) => acc * curr, 1);

  let res = BigInt(0);

  for (const [v, i] of b) {
    const m = multi / v;

    let n = 1;
    while ((n * m) % v !== 1) n++;

    res += BigInt(BigInt((v - i) % v) * BigInt(m) * BigInt(n));
  }

  return res % BigInt(multi);
};

if (!args[3] || args[3] === '1') {
  console.log(part1());
} else {
  console.log(part2());
}
