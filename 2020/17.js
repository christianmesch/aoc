const args = process.argv;

const input = require('./utils').read(args[2]);

const dimension = new Set();

input.forEach((v, y) => {
  v.split('').forEach((c, x) => {
    if (c === '#') {
      dimension.add([x, y, 0, 0].join(','));
    }
  });
});

const toCoord = (str) => {
  const tmp = str.split(',').map((x) => parseInt(x, 10));
  return { x: tmp[0], y: tmp[1], z: tmp[2], w: tmp[3] };
};

const getNeighbors = (xyzw, is4d) => {
  const coord = toCoord(xyzw);
  const neighbors = new Map();

  for (let w = coord.w - 1; w <= coord.w + 1; w++) {
    if (!is4d && w !== 0) continue;

    for (let x = coord.x - 1; x <= coord.x + 1; x++) {
      for (let y = coord.y - 1; y <= coord.y + 1; y++) {
        for (let z = coord.z - 1; z <= coord.z + 1; z++) {
          const c = [x, y, z, w].join(',');
          if (c !== xyzw) {
            neighbors.set(c, dimension.has(c));
          }
        }
      }
    }
  }

  return neighbors;
};

const solve = (is4d) => {
  for (let cycle = 0; cycle < 6; cycle++) {
    const diff = new Map();

    for (const xyzw of dimension.values()) {
      const neighbors = getNeighbors(xyzw, is4d);
      const inactiveNeighbors = [...neighbors.entries()].filter(([, a]) => !a);
      const numActiveNeighbors = (is4d ? 80 : 26) - inactiveNeighbors.length;

      if (![2, 3].includes(numActiveNeighbors)) {
        diff.set(xyzw, false);
      }

      for (const [ixyzw] of inactiveNeighbors) {
        if (!diff.has(ixyzw)) {
          const ineighbors = getNeighbors(ixyzw, is4d);
          const inumActiveNeighbors = [...ineighbors.entries()].filter(
            ([, a]) => a
          ).length;
          diff.set(ixyzw, inumActiveNeighbors === 3);
        }
      }
    }

    for (const [xyzw, a] of diff.entries()) {
      if (a) {
        dimension.add(xyzw);
      } else {
        dimension.delete(xyzw);
      }
    }
  }

  return dimension.size;
};

if (!args[3] || args[3] === '1') {
  console.log(solve());
} else {
  console.log(solve(true));
}
