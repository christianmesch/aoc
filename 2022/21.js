const args = process.argv;
const utils = require('./utils');

const monkeys = utils
    .read(args[2])
    .reduce((acc, curr) => {
        const split = curr.split(': ');
        const num = parseInt(split[1]);
        acc.set(split[0], Number.isNaN(num) ? split[1] : num);
        return acc;
    }, new Map());

const yell = (monkey, second = false) => {
    const y = monkeys.get(monkey);

    if (second && monkey === 'humn') return 'x';
    if (Number.isInteger(y)) return y;

    const [a, op, b] = y.split(' ');

    if (second && monkey === 'root') {
        return [
            yell(a, second),
            utils.parseMathExpression(yell(b, second))
        ];
    }

    let val = '';
    switch (op) {
        case '+':
            val = `(${yell(a, second)} + ${yell(b, second)})`;
            break;
        case '-':
            val = `(${yell(a, second)} - ${yell(b, second)})`;
            break;
        case '*':
            val = `(${yell(a, second)} * ${yell(b, second)})`;
            break;
        case '/':
            val = `(${yell(a, second)} / ${yell(b, second)})`;
            break;
    }

    monkeys.set(monkey, val);

    return val;
};

const part1 = () => {
    return utils.parseMathExpression(yell('root'));
};

const part2 = () => {
    // I don't want to include third party libraries,
    // and really don't know how to easily solve this in a simple way.
    // I just pasted the result into https://www.mathpapa.com/equation-solver/ and let that solve x for me :)

    const res = yell('root', true);
    return res.join(' = ');
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
