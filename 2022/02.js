const args = process.argv;

const input = require('./utils')
    .read(args[2]);

const part1 = (input) => {
    return input.map((round) => points.get(round))
        .reduce((acc, curr) => acc + curr, 0);
};

const part2 = (input) => {
    return input.map((round) => {
        [l, r] = round.split(' ');
        const opponent = opMap.get(l);

        switch (r) {
            case 'X':
                return `${l} ${resp[(resp.indexOf(opponent) + 2) % 3]}`;
            case 'Y':
                return `${l} ${opponent}`;
            case 'Z':
                return `${l} ${resp[(resp.indexOf(opponent) + 1) % 3]}`;
        }
    })
    .map((round) => points.get(round))
    .reduce((acc, curr) => acc + curr, 0);
};

const opMap = new Map([
    ['A', 'X'],
    ['B', 'Y'],
    ['C', 'Z']
])

const resp = ['X', 'Y', 'Z'];

const points = new Map([
    ['A X', 4],
    ['A Y', 8],
    ['A Z', 3],
    ['B X', 1],
    ['B Y', 5],
    ['B Z', 9],
    ['C X', 7],
    ['C Y', 2],
    ['C Z', 6]
]);

if (!args[3] || args[3] === '1') {
    console.log(part1(input));
} else {
    console.log(part2(input));
}