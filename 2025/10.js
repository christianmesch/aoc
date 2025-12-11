const args = process.argv;
const { inputs, lists, math, Cache } = require('./utils');
const { init } = require('z3-solver');

const input = inputs.read(args[2])
    .map((row) => row.match(/\[(.*)\]\s(\(.*\)\s?)+\s\{(.*)\}/))
    .map((matches) => {
        const lights = parseInt(matches[1].split('')
            .map((v) => v === '.' ? 0 : 1).reverse().join(''), 2);

        const joltage = matches[3].split(',').map(Number).reverse();

        const buttons = matches[2].split(' ').map((btn) => {
            const p = btn.slice(1, -1).split(',').map(Number);
            const bin = new Array(joltage.length).fill(0);
            p.forEach((i) => bin[i] = 1);

            return bin.reverse();
        });

        return { lights, buttons, joltage };
    });

const part1 = () => {
    return input.map((machine) => {
        return lists.combinations(machine.buttons).find((bs) => {
            const xor = bs.reduce((acc, curr) => acc ^= parseInt(curr.join(''), 2), 0);
            return xor === machine.lights;
        });
    }).reduce((acc, curr) => acc + curr.length, 0);
};

const solveJoltage = async (Context, m) => {
    const { Optimize, Int } = new Context('main');
    const reals = new Cache();
    const opt = new Optimize();

    m.joltage.forEach((v, i) => {
        const terms = [];
        m.buttons.forEach((bs, j) => {
            if (bs[i] === 1) {
                const r = reals.getOrCompute(j, () => Int.const(`x${j}`));
                opt.add(r.ge(0));
                terms.push(r);
            }
        });

        const sum = terms.reduce((acc, r) => acc.add(r), Int.val(0));
        opt.add(sum.eq(Int.val(v)));
    });

    const total = m.buttons.map((_, j) => 
        reals.getOrCompute(j, () => Int.const(`x${j}`))
    ).reduce((acc, r) => acc.add(r), Int.val(0));

    opt.minimize(total);

    
    if ((await opt.check()) !== 'sat') {
        return -1;
    }

    const model = opt.model();

    return m.buttons.map((_, j) => model.eval(reals.getOrCompute(j, () => Int.const(`x${j}`))))
        .map(Number);
};

const part2 = async () => {
    const { Context } = await init();
    
    return (await Promise.all(input.map(async (machine) => await solveJoltage(Context, machine))))
        .flatMap((m) => m)
        .reduce((acc, curr) => acc + curr, 0);
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    part2().then(console.log);
}
