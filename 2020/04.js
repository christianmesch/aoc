const args = process.argv;

const input = require('./utils')
  .read(args[2], '\n\n')
  .map((x) => x.split(/\s/));

const reqFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];

const part1 = (input) => {
  return input
    .map((x) => x.map((y) => y.split(':')))
    .filter((x) => {
      const tmp = x.map((y) => y[0]);
      return reqFields.every((y) => tmp.includes(y));
    });
};

const part2 = (input) => {
  return part1(input).filter((x) =>
    x.every((y) => {
      switch (y[0]) {
        case 'byr':
          const byr = parseInt(y[1], 10);
          if (byr >= 1920 && byr <= 2002) return true;
          break;
        case 'iyr':
          const iyr = parseInt(y[1], 10);
          if (iyr >= 2010 && iyr <= 2020) return true;
          break;
        case 'eyr':
          const eyr = parseInt(y[1], 10);
          if (eyr >= 2020 && eyr <= 2030) return true;
          break;
        case 'hgt':
          const isCm = y[1].match(/^(\d{3})cm$/);
          const isIn = y[1].match(/^(\d{2})in$/);

          if (isCm) {
            const hgt = parseInt(isCm[1], 10);
            if (hgt >= 150 && hgt <= 193) return true;
          } else if (isIn) {
            const hgt = parseInt(isIn[1], 10);
            if (hgt >= 59 && hgt <= 76) return true;
          }
          break;
        case 'hcl':
          if (y[1].match(/^\#[0-9a-f]{6}$/)) return true;
          break;
        case 'ecl':
          if (['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(y[1]))
            return true;
          break;
        case 'pid':
          if (y[1].match(/^\d{9}$/)) return true;
          break;
        default:
          return true;
      }

      return false;
    })
  );
};

if (!args[3] || args[3] === '1') {
  console.log(part1(input).length);
} else {
  console.log(part2(input).length);
}
