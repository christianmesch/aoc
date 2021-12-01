const args = process.argv;

const input = require('./utils').read(args[2]);

const mem = new Map();
let mask;

const toBinaryString = (s) => {
  return parseInt(s, 10).toString(2).padStart(36, '0');
};

const applyMask = (val) => {
  const res = [];
  for (let i = 0; i < mask.length; i++) {
    res[i] = mask[i] === 'X' ? val[i] : mask[i];
  }

  return res.join('');
};

const part1 = () => {
  for (const inst of input) {
    const [op, val] = inst.split(' = ');

    if (op === 'mask') {
      mask = val;
    } else {
      const address = parseInt(op.substring(4, op.length - 1));
      mem.set(address, applyMask(toBinaryString(val)));
    }
  }

  return [...mem.values()]
    .map((x) => parseInt(x, 2))
    .reduce((acc, curr) => acc + curr, 0);
};

const applyMaskV2 = (val) => {
  const res = [];
  for (let i = 0; i < mask.length; i++) {
    res[i] = mask[i] === '0' ? val[i] : mask[i];
  }

  return res.join('');
};

const expand = (addr) => {
  const numX = addr.match(/X/g).length;
  const variants = [];
  const addresses = [];

  for (let i = 0; i < Math.pow(2, numX); i++)
    variants.push(i.toString(2).padStart(numX, '0'));

  for (let i = 0; i < variants.length; i++) {
    let address = '';
    let idx = 0;

    for (const char of addr) {
      if (char === 'X') {
        address += variants[i][idx];
        idx++;
      } else {
        address += char;
      }
    }

    addresses.push(address);
  }

  return addresses;
};

const part2 = () => {
  for (const inst of input) {
    const [op, val] = inst.split(' = ');

    if (op === 'mask') {
      mask = val;
    } else {
      const floatingAddress = applyMaskV2(
        toBinaryString(op.substring(4, op.length - 1))
      );

      expand(floatingAddress)
        .map((a) => parseInt(a, 2))
        .forEach((a) => mem.set(a, parseInt(val, 10)));
    }
  }

  return [...mem.values()].reduce((acc, curr) => acc + curr, 0);
};

if (!args[3] || args[3] === '1') {
  console.log(part1());
} else {
  console.log(part2());
}
