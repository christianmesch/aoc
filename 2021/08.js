const args = process.argv;

const input = require('./utils')
  .read(args[2]).map((v) => {
    const [signal, output] = v.split(' | ');
    return {
      signal: signal.split(' ').map((s) => new Set(s)),
      output: output.split(' ').map((s) => new Set(s))
    };
  });

const set = require('./utils').set;

const parseNumbers = (line) => {
  const numseg = new Map();
  numseg.set(1, line.signal.find((s) => s.size === 2));
  numseg.set(4, line.signal.find((s) => s.size === 4));
  numseg.set(7, line.signal.find((s) => s.size === 3));
  numseg.set(8, line.signal.find((s) => s.size === 7));
  numseg.set(9, line.signal.find((s) => s.size === 6 && set.superset(s, set.union(numseg.get(4), numseg.get(7)))));
  numseg.set(6, line.signal.find((s) => s.size === 6 && set.superset(s, set.diff(numseg.get(8), numseg.get(1)))));
  numseg.set(0, line.signal.find((s) => s.size === 6 && !set.superset(s, numseg.get(6)) && !set.superset(s, numseg.get(9))));
  numseg.set(3, line.signal.find((s) => s.size === 5 && set.superset(s, numseg.get(1))));
  numseg.set(5, line.signal.find((s) => s.size === 5 && !set.superset(s, set.diff(numseg.get(8), numseg.get(6)))));
  numseg.set(2, line.signal.find((s) => s.size === 5 && !set.superset(s, numseg.get(3)) && !set.superset(s, numseg.get(5))));

  return numseg;
}

const part1 = (input) => {
  return input.map((v) => v.output.filter((o) => o.size === 2 || o.size === 3 || o.size === 4 || o.size === 7))
    .reduce((acc, curr) => acc + curr.length, 0);
};

const part2 = (input) => {
  return input.map((line) => {
    const numseg = parseNumbers(line);
    
    const res = line.output.reduce((acc, curr) => {
      const [num] = [...numseg].find(([_, s]) => set.eq(curr, s));
      return `${acc}${num}`;
    }, '');
    
    return parseInt(res, 10);
  }).reduce((acc, curr) => acc + curr, 0);
};

if (!args[3] || args[3] === '1') {
  console.log(part1(input));
} else {
  console.log(part2(input));
}
