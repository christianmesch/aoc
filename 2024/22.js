const args = process.argv;
const { inputs } = require('./utils');

const input = inputs
    .read(args[2]).map(BigInt);

const mix = (secret, value) => {
    return value ^ secret;
};

const prune = (secret) => {
    return secret % BigInt(16777216);
};

const part1 = () => {
    return input.reduce((acc, secret) => {
        for (let i = 0; i < 2000; i++) {
            secret = prune(mix(secret, secret * BigInt(64)));
            secret = prune(mix(secret, secret / BigInt(32)));
            secret = prune(mix(secret, secret * BigInt(2048)));
        }

        return acc + secret;
    }, BigInt(0));
};

const part2 = () => {

};

if (!args[3] || args[3] === '1') {
    console.log(part1());
} else {
    console.log(part2());
}
