const args = process.argv;
const { inputs, lists } = require('./utils');

const input = inputs
    .read(args[2]);

const run = (input, alsoText = false) => {
    return input.map((line) => Number(`${left(line, alsoText)}${right(line, alsoText)}`))
        .reduce((acc, curr) => acc + curr, 0);
};

const left = (line, alsoText = false) => {
    for (let i = 0; i < line.length; i++) {
        if (line[i].match(/\d/)) {
            return line[i];
        }

        if (alsoText) {
            let s = [...lists.textToNumber].filter(([k, v]) => line.startsWith(k, i));
            if (s.length != 0) {
                return s[0][1];
            }
        }
    }
};

const right = (line, alsoText = false) => {
    for (let i = line.length - 1; i >= 0; i--) {
        if (line[i].match(/\d/)) {
            return line[i];
        }

        if (alsoText) {
            let s = [...lists.textToNumber].filter(([k, v]) => line.startsWith(k, i));
            if (s.length != 0) {
                return s[0][1];
            }
        }
    }
};

if (!args[3] || args[3] === '1') {
    console.log(run(input));
} else {
    console.log(run(input, true));
}
