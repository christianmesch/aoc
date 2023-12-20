const args = process.argv;
const { inputs, math } = require('./utils');

const modules = new Map(inputs
    .read(args[2])
    .map((line) => {
        const split = line.split(' -> ');
        const to = split[1].split(', ');
        const type = ['%', '&'].includes(split[0][0]) ? split[0][0] : '';
        const name = type ? split[0].substring(1) : split[0];
        const state = false;

        return [
            name, { type, to, state }
        ];
    }));

[...modules].filter((module) => module[1].type === '&')
    .forEach((module) => {
        module[1].state = new Map([...modules].filter((m) => m[1].to.includes(module[0]))
            .map((m) => [m[0], false]));
    });


let highs = 0;
let lows = 0;

const cons = new Map([
    ['qt', 0], ['dq', 0], ['vt', 0], ['nl', 0]
]);

const sendPulse = (iteration) => {
    const queue = [['button', 'broadcaster', false]];

    while (queue.length) {
        const [from, to, pulse] = queue.shift();
        const module = modules.get(to);

        if (pulse) highs++; else lows++;
        if (!module) continue;

        let nPulse = pulse;

        switch (module.type) {
            case '%':
                if (pulse) continue;
                module.state = !module.state;
                nPulse = module.state;
                break;
            case '&':
                module.state.set(from, pulse);
                nPulse = ![...module.state].every(([, p]) => p);
                break;
        }

        if (['qt', 'dq', 'vt', 'nl'].includes(to) && !nPulse) {
            cons.set(to, iteration);
        }

        module.to.forEach((name) => queue.push([to, name, nPulse]));
    }
};

const part1 = () => {
    for (let i = 0; i < 1000; i++) sendPulse();
    
    return highs * lows;
};

const part2 = () => {
    for (let i = 0; [...cons].some(([, x]) => x === 0); i++) {
        sendPulse(i);
    }

    return math.lcm([...cons].map(([, v]) => v + 1));
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
