const args = process.argv;

const input = require('./utils')
  .read(args[2])
  .map((x) => [x[0], parseInt(x.substring(1))]);

const part1 = () => {
  let x = 0;
  let y = 0;
  let rot = 0;

  const move = (d, n) => {
    if (d === 'N') y += n;
    if (d === 'S') y -= n;
    if (d === 'E') x += n;
    if (d === 'W') x -= n;
  };

  input.forEach(([d, n]) => {
    switch (d) {
      case 'N':
      case 'S':
      case 'E':
      case 'W':
        move(d, n);
        break;
      case 'L':
        rot = (360 + rot + n) % 360;
        break;
      case 'R':
        rot = (360 + rot - n) % 360;
        break;
      case 'F':
        if (rot === 90) move('N', n);
        if (rot === 180) move('W', n);
        if (rot === 270) move('S', n);
        if (rot === 0) move('E', n);
        break;
    }
  });

  return Math.abs(x) + Math.abs(y);
};

const part2 = () => {
  let x = 0;
  let y = 0;
  let wx = 10;
  let wy = 1;

  const move = (d, n) => {
    if (d === 'N') wy += n;
    if (d === 'S') wy -= n;
    if (d === 'E') wx += n;
    if (d === 'W') wx -= n;
  };

  const rotate = (d, n) => {
    const deg = d === 'R' ? n : 360 - n;
    const tx = wx;
    const ty = wy;

    if (deg === 90) {
      wx = ty;
      wy = -tx;
    }
    if (deg === 180) {
      wx = -tx;
      wy = -ty;
    }
    if (deg === 270) {
      wx = -ty;
      wy = tx;
    }
  };

  input.forEach(([d, n]) => {
    switch (d) {
      case 'N':
      case 'S':
      case 'E':
      case 'W':
        move(d, n);
        break;
      case 'L':
      case 'R':
        rotate(d, n);
        break;
      case 'F':
        x += n * wx;
        y += n * wy;
        break;
    }
  });

  return Math.abs(x) + Math.abs(y);
};

if (!args[3] || args[3] === '1') {
  console.log(part1());
} else {
  console.log(part2());
}
