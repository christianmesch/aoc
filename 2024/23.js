const args = process.argv;
const { inputs, MMap, sets } = require('./utils');

const input = inputs
    .read(args[2])
    .reduce((acc, curr) => {
        const [a, b] = curr.split('-');
        acc.set(a, acc.has(a) ? acc.get(a).add(b) : new Set([b]));
        return acc.set(b, acc.has(b) ? acc.get(b).add(a) : new Set([a]));
    }, new MMap());

const part1 = () => {
    return input.entries().filter(([key]) => key.startsWith('t'))
        .reduce((acc, [first, connections]) => {
            [...connections].forEach((second) => {
                [...sets.intersection(connections, input.get(second))].forEach((third) => {
                    acc.add([first, second, third].sort().join(','));
                });
            });

            return acc;
        }, new Set()).size;
};

const part2 = () => {
    return input.entries()
        .reduce((acc, [first, connections]) => {
            const intersections = [...connections].map((second) => 
                sets.intersection(connections, input.get(second)).add(second));

            for (let l = 0; l < intersections.length; l++) {
                const left = intersections[l];
                if (left.size + 1 <= acc.length) continue;

                let count = 0;
                for (let r = l + 1; r < intersections.length; r++) {
                    const right = intersections[r];
                    if (sets.eq(left, right)) {
                        count++;
                    }
                }

                if (count + 1 === left.size) {
                    acc = [...left, first];
                }
            }

            return acc;
        }, []).sort().join(',');
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
