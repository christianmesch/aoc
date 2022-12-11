const args = process.argv;
const utils = require('./utils');

const monkeys = utils
    .read(args[2], '\n\n')
    .map((m) => {
        const split = m.split('\n');
        const ops = split[2].split(' ').slice(-2);

        return {
            items: split[1].split(': ')[1].split(', ').map(Number),
            operation: (val) => {
                const num = ops[1] === 'old' ? val : Number(ops[1]);
                switch (ops[0]) {
                    case '+':
                        return val + num;
                    case '*':
                        return val * num;
                }
            },
            test: [
                Number(split[3].split(' ').at(-1)),
                Number(split[4].split(' ').at(-1)),
                Number(split[5].split(' ').at(-1))
            ],
            inspections: 0,
        }
    })

const solve = (rounds, handleWorry) => {
    for (let r = 0; r < rounds; r++) {
        for (let m = 0; m < monkeys.length; m++) {
            const monkey = monkeys[m];

            monkey.inspections += monkey.items.length;
            monkey.items.map(monkey.operation)
                .map(handleWorry)
                .forEach((item) => {
                    const rMonkey = item % monkey.test[0] === 0 ? monkey.test[1] : monkey.test[2];
                    monkeys.at(rMonkey).items.push(item);
                });
            monkey.items = [];
        }
    }

    return monkeys.map((m) => m.inspections)
        .sort((a, b) => b - a)
        .slice(0, 2)
        .reduce((acc, curr) => acc * curr, 1);
}

const part1 = () => {
    return solve(20, (v) => Math.floor(v / 3));
};

const part2 = () => {
    const d = monkeys.map((m) => m.test[0]).reduce((acc, curr) => acc * curr, 1);
    return solve(10000, (v) => v % d);
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
