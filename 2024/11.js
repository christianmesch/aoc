const args = process.argv;
const { inputs } = require('./utils');

let stones = inputs
    .readInt(args[2], ' ')
    .map((v) => [v, 1]);

const blink = (stone) => {
    if (stone === 0) return [1];
    const stoneStr = `${stone}`;
    if (!(stoneStr.length % 2)) {
        return [
            Number(stoneStr.slice(0, stoneStr.length / 2)), 
            Number(stoneStr.slice(stoneStr.length / 2, stoneStr.length))
        ];
    }

    return [stone * 2024];
};

const solve = (blinks) => {
    for (let i = 0; i < blinks; i++) {
        stones = [...stones.flatMap(([stone, count]) => blink(stone).map((s) => [s, count]))
            .reduce((acc, [stone, count]) => {
                acc.set(stone, (acc.get(stone) || 0) + count);
                return acc;
            }, new Map())];
    }

    return stones.reduce((acc, [, curr]) => acc + curr, 0);
};

if (!args[3] || args[3] === '1') {
    console.log(solve(25));
} else {
    console.log(solve(75));
}
