const args = process.argv;

const range = require('./utils').range;
const input = require('./utils').read(args[2], '\n\n');

const rules = input[0].split('\n').map((x) => {
  const r = x.split(': ');
  const o = r[1].split(' or ');

  const ranges = o.flatMap((y) => {
    const v = y.split('-');
    return range(parseInt(v[0]), parseInt(v[1]) + 1);
  });

  return {
    name: r[0],
    ranges,
  };
});

const my = input[1]
  .split('\n')[1]
  .split(',')
  .map((x) => parseInt(x));

const [, ...tmpNearby] = input[2].split('\n');
const nearby = tmpNearby.map((n) => n.split(',').map((x) => parseInt(x)));

const allValidRules = new Set(rules.flatMap((r) => r.ranges));

const part1 = () => {
  return nearby
    .flatMap((ticket) => ticket.filter((num) => !allValidRules.has(num)))
    .reduce((acc, cur) => acc + cur, 0);
};

const part2 = () => {
  const possibleFields = my.map(() => new Map());
  const validNearby = nearby.filter((ticket) =>
    ticket.every((num) => allValidRules.has(num))
  );

  // Find possible fields per index
  validNearby.forEach((ticket) => {
    ticket.forEach((num, i) => {
      rules.forEach((rule) => {
        if (rule.ranges.includes(num)) {
          const n = possibleFields[i].get(rule.name);
          possibleFields[i].set(rule.name, n ? n + 1 : 1);
        }
      });
    });
  });

  // Find actual field for an index
  const fields = [];
  while (fields.length < my.length) {
    possibleFields.forEach((fs, i) => {
      if (!fields[i]) {
        const entries = [...fs.entries()].filter(
          ([v, n]) => n === validNearby.length && !fields.includes(v)
        );

        if (entries.length === 1) {
          fields[i] = entries[0][0];
        }
      }
    });
  }

  // Multiply values for result
  return fields
    .map((v, i) => [v, i])
    .filter(([v]) => v.startsWith('departure'))
    .map(([, i]) => my[i])
    .reduce((acc, cur) => acc * cur, 1);
};

if (!args[3] || args[3] === '1') {
  console.log(part1());
} else {
  console.log(part2());
}
