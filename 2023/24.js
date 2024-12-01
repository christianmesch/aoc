const args = process.argv;
const { inputs, Point } = require('./utils');
const { init } = require('z3-solver');

const input = inputs
    .read(args[2])
    .map((line) => {
        const split = line.split(' @ ');
        return [
            new Point(split[0].split(', ').map(Number)),
            new Point(split[1].split(', ').map(Number))
        ]
    });

const part1 = () => {
    let count = 0;

    const bounds = {
        min: [200000000000000, 200000000000000], max: [400000000000000, 400000000000000]
    };

    for (let ai = 0; ai < input.length; ai++) {
        const [a, ad] = input[ai];

        for (let bi = ai + 1; bi < input.length; bi++) {
            const [b, bd] = input[bi];

            const dx = b.x() - a.x();
            const dy = b.y() - a.y();

            const det = bd.x() * ad.y() - bd.y() * ad.x();

            if (det === 0) continue;

            const u = (dy * bd.x() - dx * bd.y()) / det;
            const v = (dy * ad.x() - dx * ad.y()) / det;

            if (u > 0 && v > 0) {
                const intersection = new Point([a.x() + ad.x() * u, a.y() + ad.y() * u]);
                if (intersection.isInBounds(bounds)) count++;
            }
        }
    }

    return count;
};

const part2 = async () => {
    const { Context } = await init();
    const { Solver, Real } = new Context('main');
    
    const x = Real.const('x');
    const y = Real.const('y');
    const z = Real.const('z');
    const vx = Real.const('vx');
    const vy = Real.const('vy');
    const vz = Real.const('vz');

    const solver = new Solver();

    input.forEach(([p, v], i) => {
        const t = Real.const(`t${i}`);

        solver.add(t.ge(0))
        solver.add(x.add(t.mul(vx)).eq(t.mul(v.x()).add(p.x())));
        solver.add(y.add(t.mul(vy)).eq(t.mul(v.y()).add(p.y())));
        solver.add(z.add(t.mul(vz)).eq(t.mul(v.z()).add(p.z())));
    });

    if ((await solver.check()) !== 'sat') {
        return -1;
    }

    const model = solver.model();

    return [model.eval(x), model.eval(y), model.eval(z)]
        .map(Number).reduce((acc, curr) => acc + curr, 0);
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    part2().then(console.log);
}
