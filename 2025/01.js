const args = process.argv;
const { inputs } = require('./utils');

const MAX = 100;

const input = inputs
    .read(args[2])
    .map((row) => {
        const val = Number(row.slice(1));
        const num = val % MAX;
        return [row[0] === 'L' ? -num : num, Math.floor(val / MAX)];
    });

const solve = (countRevs = false) => {
    let count = 0;
    input.reduce((pPos, [curr, revs]) => {
        const move = pPos + curr;
        const nPos = (MAX + move) % MAX;
        
        if (countRevs) {
            count += revs;
            if ((move < 1 && pPos !== 0) || move > 99) count++;
        } else if (nPos === 0) {
            count++;
        }

        return nPos;
    }, 50);

    return count;
};

if (!args[3] || args[3] === '1') {
    console.log(solve());
} else {
    console.log(solve(true));
}
