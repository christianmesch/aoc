const args = process.argv;
const { inputs } = require('./utils');

const input = inputs
    .read(args[2])
    .map((row) => row.split(': '))
    .map(([a, b]) => ({
        result: Number(a),
        terms: b.split(' ').map(Number)
    }));

const evaluate = (equation, sum, i, conc) => {
    if (equation.terms.length - 1 === i) {
        return equation.result === sum;
    }

    if (equation.result < sum) return false;

    return evaluate(equation, sum + equation.terms[i + 1], i + 1, conc)
        || evaluate(equation, sum * equation.terms[i + 1], i + 1, conc)
        || (conc && evaluate(equation, Number(`${sum}${equation.terms[i + 1]}`), i + 1, conc));
};

const solve = (conc) => {
    return input.filter((equation) => evaluate(equation, equation.terms[0], 0, conc))
        .reduce((acc, curr) => acc + curr.result, 0);
};

if (!args[3] || args[3] === '1') {
    console.log(solve(false));
} else {
    console.log(solve(true));
}
