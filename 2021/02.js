const args = process.argv;

const input = require('./utils')
  .read(args[2])
  .map(v => ({ c: v.split(' ')[0], u: Number(v.split(' ')[1]) }));

const part1 = (input) => {
  let res = input.reduce((acc, curr) => {
    switch (curr.c) {
      case 'forward': return { h: acc.h + curr.u, d: acc.d };
      case 'up': return { h: acc.h, d: acc.d - curr.u };
      case 'down': return { h: acc.h, d: acc.d + curr.u };
    }
  }, {h: 0, d: 0});

  return res.h * res.d;
};

const part2 = (input) => {
  let res = input.reduce((acc, curr) => {
    switch (curr.c) {
      case 'forward': return { h: acc.h + curr.u, d: acc.d + (acc.a * curr.u), a: acc.a };
      case 'up': return { h: acc.h, d: acc.d, a: acc.a - curr.u };
      case 'down': return { h: acc.h, d: acc.d, a: acc.a + curr.u };
    }
   }, {h: 0, d: 0, a: 0});

  return res.h * res.d;
};

if (!args[3] || args[3] === '1') {
  console.log(part1(input));
} else {
  console.log(part2(input));
}
