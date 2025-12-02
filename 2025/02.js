const args = process.argv;
const { inputs, lists, math } = require('./utils');

const input = inputs
    .read(args[2])
    .flatMap((row) => row.split(',')
        .flatMap((range) => {
            const [l, r] = range.split('-');
            return lists.range(Number(l), Number(r) + 1);
        })
    ).map(String);

const solve = (usePrimes = false) => {
    return input.filter((n) => {
        if (!usePrimes && n.length % 2) return false;
        const nChunks = new Set(usePrimes ? math.simpleToPrimes(n.length) : [2]);

        for (const nChunk of nChunks) {
            const chunks = new Set(lists.toChunks(n, n.length / nChunk));
            if (chunks.size === 1) return true;
        }
    }).map(Number)
    .reduce((acc, curr) => acc + curr, 0);
};

if (!args[3] || args[3] === '1') {
    console.log(solve());
} else {
    console.log(solve(true));
}
