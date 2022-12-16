const args = process.argv;
const utils = require('./utils');

const valves = utils
    .read(args[2])
    .reduce((acc, curr) => {
        const split = curr.split(' ');
        return acc.set(split[1], {
            valve: split[1],
            flow: Number(split[4].split('=')[1].slice(0, -1)),
            connected: split.slice(9).join('').split(','),
        })
    }, new Map());

const valveNames = [...valves].map(([key,]) => key);
const valvesWithFlow = [...valves].map(([, v]) => v).filter((v) => v.flow);

const distances = new Array(valveNames.length)
    .fill()
    .map(() => new Array(valveNames.length).fill().map(() => Number.POSITIVE_INFINITY));

const calculateDistances = () => {
    for (const valve of valves.values()) {
        const queue = [];
        const visited = new Set([valve.valve]);
        const startIndex = valveNames.indexOf(valve.valve);
        let prevIndex = valveNames.indexOf(valve.valve);

        distances[startIndex][prevIndex] = 0;
        queue.push(valve);

        while (queue.length) {
            const curr = queue.shift();
            const currIndex = valveNames.indexOf(curr.valve);

            curr.connected
                .filter((v) => !visited.has(v))
                .map((v) => valves.get(v))
                .forEach((v) => {
                    const vIndex = valveNames.indexOf(v.valve);
                    const tmp = distances[startIndex][currIndex] + 1;
                    if (tmp < distances[startIndex][vIndex]) {
                        distances[startIndex][vIndex] = tmp;
                        queue.push(v);
                        prevIndex = currIndex;
                    }
                });
        }
    }
};

const traverse = (timeLeft, unopened) => {
    const stack = [{
        valve: 'AA',
        valves: unopened,
        timeLeft,
        finished: false,
        pressure: 0
    }];

    for (let i = 0; i < stack.length; i++) {
        const curr = stack.at(i);
        let stepTaken = false;

        if (curr.timeLeft <= 0) curr.finished = true;
        if (curr.finished) continue;

        const dFromCurr = distances[valveNames.indexOf(curr.valve)];
        curr.valves.forEach((v) => {
            if (curr.valve === v.valve
                || curr.timeLeft - dFromCurr[valveNames.indexOf(v.valve)] <= 1) return;

            stack.push({
                valve: v.valve,
                valves: curr.valves.filter((x) => x.valve !== v.valve),
                timeLeft: curr.timeLeft - dFromCurr[valveNames.indexOf(v.valve)] - 1,
                finished: false,
                pressure: curr.pressure + (curr.timeLeft - dFromCurr[valveNames.indexOf(v.valve)] - 1) * v.flow
            });

            stepTaken = true;
        });

        if (!stepTaken) curr.finished = true;
    }

    return stack;
}

calculateDistances();

const part1 = () => {
    return traverse(30, valvesWithFlow).filter((v) => v.finished).sort((a, b) => b.pressure - a.pressure)[0].pressure;
};

const part2 = () => {
    const elephant = traverse(26, valvesWithFlow).filter((v) => v.finished).sort((a, b) => b.pressure - a.pressure)[0];
    const me = traverse(26, elephant.valves).filter((v) => v.finished).sort((a, b) => b.pressure - a.pressure)[0];

    return elephant.pressure + me.pressure;

};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
