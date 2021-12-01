const args = process.argv;

const Console = require('./game-console').Console;

const input = require('./utils')
  .read(args[2])
  .map((x) => {
    const [op, arg] = x.split(' ');
    return {
      op,
      arg: parseInt(arg, 10),
    };
  });

const part1 = () => {
  const c = new Console(input);
  c.haltOnLoop = true;
  c.run();
  return c.accumulator;
};

const part2 = () => {
  const permutations = [];

  input.forEach(({ op }, i) => {
    if (op === 'nop' || op === 'jmp') {
      const copy = [...input];
      copy[i] = {
        op: op === 'jmp' ? 'nop' : 'jmp',
        arg: input[i].arg,
      };

      permutations.push(copy);
    }
  });

  for (const perm of permutations) {
    const c = new Console(perm);
    c.haltOnLoop = true;

    if (c.run() === 0) {
      return c.accumulator;
    }
  }
};

if (!args[3] || args[3] === '1') {
  console.log(part1());
} else {
  console.log(part2());
}
