const args = process.argv;

const input = require('./utils').read(args[2]);

const xMax = input[0].length;
const yMax = input.length;

// Includes myself
const adjacentOccupied = (arr, x, y) => {
  const xStart = x - 1 < 0 ? 0 : x - 1;
  const xEnd = x + 2 > xMax ? xMax : x + 2;
  const yStart = y - 1 < 0 ? 0 : y - 1;
  const yEnd = y + 2 > yMax ? yMax : y + 2;

  return arr
    .slice(yStart, yEnd)
    .map((w) => w.slice(xStart, xEnd))
    .flatMap((w) => [...w])
    .filter((w) => w === '#').length;
};

const firstSeen = (arr, x, y, dx, dy) => {
  let cx = x + dx;
  let cy = y + dy;

  while (cx < xMax && cx >= 0 && cy < yMax && cy >= 0) {
    if (arr[cy][cx] !== '.') return arr[cy][cx];

    cx += dx;
    cy += dy;
  }

  return '.';
};

// Doesn't include myself
const seenOccupied = (arr, x, y) => {
  return [
    firstSeen(arr, x, y, 1, 0),
    firstSeen(arr, x, y, 1, 1),
    firstSeen(arr, x, y, 0, 1),
    firstSeen(arr, x, y, 1, -1),
    firstSeen(arr, x, y, -1, 0),
    firstSeen(arr, x, y, -1, 1),
    firstSeen(arr, x, y, 0, -1),
    firstSeen(arr, x, y, -1, -1),
  ].filter((w) => w === '#').length;
};

const solve = (occupiedFunc) => {
  let curr = [...input];
  let prev = [];

  while (!curr.every((w) => prev.includes(w))) {
    prev = [...curr];
    for (let y = 0; y < yMax; y++) {
      for (let x = 0; x < xMax; x++) {
        let char = prev[y][x];
        switch (char) {
          case 'L':
            char = occupiedFunc(prev, x, y) ? 'L' : '#';
            break;
          case '#':
            // Works because of the changed "limits"
            char = occupiedFunc(prev, x, y) > 4 ? 'L' : '#';
            break;
        }

        curr[y] = curr[y].substring(0, x) + char + curr[y].substring(x + 1);
      }
    }
  }

  return curr.flatMap((w) => [...w]).filter((w) => w === '#').length;
};

if (!args[3] || args[3] === '1') {
  console.log(solve(adjacentOccupied));
} else {
  console.log(solve(seenOccupied));
}
