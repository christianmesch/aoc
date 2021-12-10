const args = process.argv;

const input = require('./utils')
  .read(args[2]);

const openers = ['(', '[', '{', '<'];
const closers = [')', ']', '}', '>'];
const opclo = new Map([['(', ')'], ['[', ']'], ['{', '}'], ['<', '>']]);
const lexPoints = new Map([[')', 3], [']', 57], ['}', 1197], ['>', 25137]]);
const autoPoints = new Map([[')', 1], [']', 2], ['}', 3], ['>', 4]]);

const parse = (input) => {
  return input.map((line) => {
    const stack = [];
    for (const c of line) {
      if (openers.includes(c)) {
        stack.push(c);
      } else if (closers.includes(c) && opclo.get(stack.pop()) !== c) {
        return { l: line, r: 1, d: c };
      }
    }

    return { l: line, r: 0, d: stack };
  });
}

const part1 = (input) => {
  return parse(input).filter((l) => l.r === 1)
    .reduce((acc, curr) => acc + lexPoints.get(curr.d), 0);
};

const part2 = (input) => {
  const res = parse(input).filter((l) => l.r === 0)
    .map((l) => l.d.reverse()
      .map((c) => opclo.get(c))
      .reduce((acc, curr) => (acc * 5) + autoPoints.get(curr), 0)
    ).sort((a, b) => a - b);

  return res[Math.floor(res.length / 2)];
};

if (!args[3] || args[3] === '1') {
  console.log(part1(input));
} else {
  console.log(part2(input));
}
