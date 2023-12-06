const args = process.argv;
const { inputs } = require('./utils');

const [time, distance] = inputs
    .read(args[2])
    .map((line) => line.split(/:\s+/)[1].split(/\s+/).map((l) => Number(l)));

const table = time.reduce((acc, curr, i) => { 
    acc.push({t: curr, d: distance[i]});
    return acc;
}, []);

const calc = (row = {t: 0, d: 0}) => {
    let w = 0;
    for (let i = 1; i < row.t; i++) {
        if ((row.t - i) * i > row.d) w++;
    }
    return w;
};

const part1 = () => {
    return table.map(calc).reduce((acc, curr) => acc * curr, 1);
};

const part2 = () => {
    return calc({ t: Number(time.join('')), d: Number(distance.join('')) });
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
