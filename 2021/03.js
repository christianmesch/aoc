const args = process.argv;

const input = require('./utils')
  .read(args[2]).map((val) => val.split('').map((v) => parseInt(v, 10)));

const frequency = (list, mostCommon = true) => {
  const freq = list.reduce((acc, curr) => {
    curr.forEach((val, i) => { acc[i] += val; });
    return acc;
  }, new Array(list[0].length).fill(0));

  return mostCommon ? freq.map((f) => f >= (list.length / 2) ? 1 : 0) : freq.map((f) => f < (list.length / 2) ? 1 : 0);
};

const part1 = (input) => {
  const gamma = frequency(input);
  const epsilon = gamma.map((val) => val === 1 ? 0 : 1);

  return parseInt(gamma.join(''), 2) * parseInt(epsilon.join(''), 2);
};

const part2 = (input) => {
  let oxyList = input;
  for (let i = 0; i < oxyList[0].length && oxyList.length > 1; i++) {
    const freq = frequency(oxyList);
    oxyList = oxyList.filter((val) => val[i] === freq[i]);
  }

  let coList = input;
  for (let i = 0; i < coList[0].length && coList.length > 1; i++) {
    const freq = frequency(coList, false);
    coList = coList.filter((val) => val[i] === freq[i]);
  }

  return parseInt(oxyList[0].join(''), 2) * parseInt(coList[0].join(''), 2);
};

if (!args[3] || args[3] === '1') {
  console.log(part1(input));
} else {
  console.log(part2(input));
}
