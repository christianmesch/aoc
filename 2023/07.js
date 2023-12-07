const args = process.argv;
const { inputs } = require('./utils');

const power = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const power2 = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'];

const types = [
    /(.)\1{4}/,
    /(.)\1{3}/,
    /(?:(?:(.)\1{1}(.)\2{2})|(?:(.)\3{2}(.)\4{1}))/,
    /(.)\1{2}/,
    /(.)\1{1}.?(.)\2{1}/,
    /(.)\1{1}/,
    /./
];

const getJType = (hand = '') => {
    const handNoJ = hand.split('').filter((c) => c !== 'J')
        .sort((a, b) => power.indexOf(a) - power.indexOf(b)).join('');
    const numJ = 5 - handNoJ.length;

    const type = types.findIndex((t) => handNoJ.match(t));

    if (type === 0 || numJ === 0) return type;
    if (numJ >= 4) return 0;
    if (numJ === 3) return type === 5 ? 0 : 1;
    if (numJ === 2) {
        if (type === 6) return 3;
        if (type === 5) return 1;
        if (type === 3) return 0;
    }
    if (numJ === 1) {
        if (type === 6) return 5;
        if (type === 5) return 3;
        if (type === 4) return 2;
        if (type === 3) return 1;
        if (type === 1) return 0;
    }
}

const compare = (a, b) => {
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return b[i] - a[i];
    }

    return 0;
};

const input = inputs
    .read(args[2])
    .map((line) => {
        const h = line.split(' ');
        const sortedCards = h[0].split('')
            .sort((a, b) => power.indexOf(a) - power.indexOf(b)).join('');
        const type = !args[3] || args[3] === '1' ? types.findIndex((t) => sortedCards.match(t))
            : getJType(h[0]);

        return {
            cards: h[0],
            bid: Number(h[1]),
            type
        };
    });

const sortByStrength = (a, b, powermap) => {
    if (a.type == b.type) {
        return compare(a.cards.split('').map((v) => powermap.indexOf(v)), 
            b.cards.split('').map((v) => powermap.indexOf(v)));
    }

    return b.type - a.type;
}

const solve = (powermap) => {
    return input.sort((a, b) => sortByStrength(a, b, powermap))
        .map((h, i) => h.bid * (i + 1))
        .reduce((acc, curr) => acc + curr, 0);
};

if (!args[3] || args[3] === '1') {
    console.log(solve(power));
} else {
    console.log(solve(power2));
}
