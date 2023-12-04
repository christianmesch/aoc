const args = process.argv;
const { inputs } = require('./utils');

const input = inputs
    .read(args[2])
    .map((line) => {
        let s = line.split(': ');
        let n = s[1].split(/\s+\|\s+/);
        let w = n[0].split(/\s+/).map((number) => Number(number));
        let h = n[1].split(/\s+/).map((number) => Number(number));

        return {
            id: Number(s[0].split(/\s+/)[1]),
            winning: h.filter((n) => w.includes(n)).length
        }
    });

const cards = new Map(input.map((c) => [c.id, c]));
const mem = new Map();

const scratch = (card) => {
    if (mem.has(card.id)) return mem.get(card.id);
    if (card.winning === 0) return 1;

    let num = 1;
    for (let i = card.id + 1; i <= card.id + card.winning; i++) {
        num += scratch(cards.get(i));
    }

    mem.set(card.id, num);
    return num;
};

const part1 = () => {
    return input
        .filter((card) => card.winning > 0)
        .map((card) => Math.pow(2, card.winning - 1))
        .reduce((acc, curr) => acc + curr, 0);
};

const part2 = () => {
    return [...cards].map(([,card]) => scratch(card))
        .reduce((acc, curr) => acc + curr, 0);
};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
