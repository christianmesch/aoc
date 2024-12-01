const args = process.argv;
const { inputs } = require('./utils');

const input = inputs
    .read(args[2], '\n\n')
    .map((p) => p.split('\n'));

const parts = input[1].map((p) => JSON.parse(p.replace(/=/g, ':').replace(/([xmas])/g, '\"$1\"')));

const workflows = new Map(input[0].map((w) => {
    const [, n, rs] = w.match(/(\w+){(.+)}/);
    const rules = rs.split(',').map((r) => {
        const split = r.split(':');
        const val = Number(split[0].substring(2));
        return {
            condition: split.length == 1 ? () => true : (part) => split[0][1] === '>'
                ? part[split[0][0]] > val
                : part[split[0][0]] < val,
            var: split[0][0],
            comp: split[0][1],
            val,
            next: split.at(-1)
        };
    });

    return [n, rules];
}));

const acceptedRanges = (currFlow, ranges) => {
    if (currFlow === 'A') return ranges;
    if (currFlow === 'R') return [];

    let tmpRanges = { ...ranges };

    return workflows.get(currFlow).flatMap((rule) => {
        const newRanges = { ...tmpRanges };

        if (rule.comp === '>') {
            tmpRanges[rule.var] = [tmpRanges[rule.var][0], Math.min(rule.val, tmpRanges[rule.var][1])];
            newRanges[rule.var] = [Math.max(rule.val, newRanges[rule.var][0]), newRanges[rule.var][1]];
            return acceptedRanges(rule.next, newRanges);
        } else if (rule.comp === '<') {
            tmpRanges[rule.var] = [Math.max(rule.val - 1, tmpRanges[rule.var][0]), tmpRanges[rule.var][1]];
            newRanges[rule.var] = [newRanges[rule.var][0], Math.min(rule.val - 1, newRanges[rule.var][1])];
            return acceptedRanges(rule.next, newRanges);
        } else {
            return acceptedRanges(rule.next, newRanges);
        }
    });
};

const part1 = () => {
    const accepted = [];

    for (const part of parts) {
        let currFlow = 'in';
        while (!['R', 'A'].includes(currFlow)) {
            const rules = workflows.get(currFlow);
            const idx = rules.findIndex((r) => r.condition(part));
            currFlow = rules[idx].next;
        }

        if (currFlow === 'A') accepted.push(part);
    }

    return accepted.map((p) => p.x + p.m + p.a + p.s)
        .reduce((acc, curr) => acc + curr, 0);
};

const part2 = () => {
    return acceptedRanges('in', {
        x: [0, 4000],
        m: [0, 4000],
        a: [0, 4000],
        s: [0, 4000]
    }).map((r) => (r.x[1] - r.x[0]) * (r.m[1] - r.m[0]) * (r.a[1] - r.a[0]) * (r.s[1] - r.s[0]))
        .reduce((acc, curr) => acc + curr, 0);
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
