const args = process.argv;

const [head, ...tail] = require('./utils').read(args[2], '\n\n');
const numbers = head.split(',').map((v) => parseInt(v, 10));
let boards = tail.map((v) => v.trim().replace(/\s+/g, ',').split(',').map((v) => ({ v: parseInt(v, 10), b: false })));

const whichHasBingo = (bs) => {
  for (let bi = 0; bi < bs.length; bi++) {
    if (boardHasBingo(bs[bi])) return bi;
  }

  return -1;
}

const hasBingo = (board) => {
    // Vertical
    for (let i = 0; i < 5; i++) {
      if (board[i].b && board[i + 5].b && board[i + 10].b && board[i + 15].b && board[i + 20].b) {
        return true;
      }
    }

    // Horizontal
    for (let i = 0; i < board.length - 1; i += 5) {
      if (board[i].b && board[i + 1].b && board[i + 2].b && board[i + 3].b && board[i + 4].b) {
        return true;
      }
    }

    return false;
}

const calculateScore = (board) => {
  return board.filter((v) => !v.b).reduce((acc, curr) => acc += curr.v, 0);
}

const part1 = () => {
  let bingo = -1;
  let i = 0;
  for (; i < numbers.length && bingo == -1; i++) {
    boards.forEach((b) => {
      const index = b.findIndex((v) => v.v === numbers[i]);
      if (index != -1) b[index].b = true;
    });

    bingo = whichHasBingo(boards);
  }

  return calculateScore(boards[bingo]) * numbers[i - 1];
};

const part2 = () => {
  let i = 0;
  for (; i < numbers.length; i++) {
    boards.forEach((b) => {
      const index = b.findIndex((v) => v.v === numbers[i]);
      if (index != -1) b[index].b = true;
    });

    if (boards.length > 1) {
      boards = boards.filter((board) => !hasBingo(board));
    } else {
      if (hasBingo(boards[0])) break;
    }
  }

  return calculateScore(boards[0]) * numbers[i];
};

if (!args[3] || args[3] === '1') {
  console.log(part1());
} else {
  console.log(part2());
}
