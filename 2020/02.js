const args = process.argv;

const input = require('./utils')
  .read(args[2])
  .map((x) => {
    const i = x.split(' ');
    const minmax = i[0].split('-');
    return {
      min: parseInt(minmax[0]),
      max: parseInt(minmax[1]),
      char: i[1].split(':')[0],
      password: i[2],
    };
  });

const part1 = (input) => {
  return input.filter((x) => {
    const found = [...x.password.matchAll(new RegExp(x.char, 'g'))].length;
    return found >= x.min && found <= x.max;
  }).length;
};

const part2 = (input) => {
  return input.filter(
    (x) =>
      (x.password[x.min - 1] === x.char) != (x.password[x.max - 1] === x.char)
  ).length;
};

if (!args[3] || args[3] === '1') {
  console.log(part1(input));
} else {
  console.log(part2(input));
}
