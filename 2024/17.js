const args = process.argv;
const { inputs } = require('./utils');

let [regA, regB, regC, ...program] = inputs
    .readMatch(args[2], /\d+/g)
    .map(Number);

const outArr = [];
let pointer = 0;

const combo = (operand) => {
    switch (operand) {
        case 0:
        case 1:
        case 2:
        case 3:
            return operand;
        case 4:
            return regA;
        case 5:
            return regB;
        case 6:
            return regC;
    }
}

const adv = () => {
    console.log(`program: ${program[pointer]}`);
    console.log(`combo: ${combo(program[pointer])}`);
    console.log(`adv: ${regA} / ${2 ** combo(program[pointer])} = ${Math.floor(regA / (2 ** combo(program[pointer])))}`);
    regA = Math.floor(regA / (2 ** combo(program[pointer])));
    pointer++;
};

const bxl = () => {
    regB = (regB ^ program[pointer]) >>> 0;
    pointer++;
};

const bst = () => {
    regB = combo(program[pointer]) % 8;
    pointer++;
};

const jnz = () => {
    if (regA !== 0) {
        pointer = program[pointer];
    } else {
        pointer++;
    }
};

const bxc = () => {
    regB = (regB ^ regC) >>> 0;
    pointer++;
};

const out = () => {
    outArr.push(combo(program[pointer]) % 8);
    pointer++;
};

const bdv = () => {
    regB = Math.floor(regA / (2 ** combo(program[pointer])));
    pointer++;
};

const cdv = () => {
    regC = Math.floor(regA / (2 ** combo(program[pointer])));
    pointer++;
};

const run = () => {
    while (pointer < program.length) {
        console.log(pointer, program[pointer], regA, regB, regC);
        const curr = program[pointer];
        pointer++;
        switch (curr) {
            case 0:
                adv();
                break;
            case 1:
                bxl();
                break;
            case 2:
                bst();
                break;
            case 3:
                jnz();
                break;
            case 4:
                bxc();
                break;
            case 5:
                out();
                break;
            case 6:
                bdv();
                break;
            case 7:
                cdv();
                break;
        }
    }
};

const part1 = () => {
    run();

    return outArr.join(',');
};

const part2 = () => {

};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
