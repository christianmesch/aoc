const args = process.argv;

const { read, range, adjacent } = require('./utils');

const input = read(args[2]).map((l) => l.split('').map((n) => parseInt(n, 10)));

const flashed = new Set();

const cToS = (c) => `${c.x},${c.y}`;

const allCoords = range(0, 10).flatMap((x) => {
  let ret = [];
  range(0, 10).forEach((y) => ret.push({x, y}));
  return ret;
})

const increase = (input, coords) => {
  const asd = [];
  coords.forEach((c) => {
    input[c.y][c.x] =  input[c.y][c.x] + 1;
    if (input[c.y][c.x] === 0) {
      asd.push(cToS(c));
      flashed.add(cToS(c));
    }
  });

  increase(input, adjacent(input, c.x, c.y, true).filter((a) => !flashed.has(cToS(a))));
}

const part1 = (input) => {
  increase(input, allCoords);
  console.log(input);
  flashed.clear();
  increase(input, allCoords);
  console.log(input);
};

const part2 = (input) => {

};

if (!args[3] || args[3] === '1') {
  console.log(part1(input));
} else {
  console.log(part2(input));
}
