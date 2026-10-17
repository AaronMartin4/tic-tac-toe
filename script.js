const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const HUMAN = 'X';
const COMPUTER = 'O';
const board = document.getElementById('board');
const cells = [...document.querySelectorAll('.cell')];
const statusEl = document.getElementById('status');
const roundLabel = document.getElementById('round-label');
const newRoundButton = document.getElementById('new-round');
const resetScoreButton = document.getElementById('reset-score');
const scoreEls = {
  X: document.getElementById('x-score'),
  O: document.getElementById('o-score'),
  draw: document.getElementById('draw-score')
};

const state = {
  board: Array(9).fill(''),
  currentPlayer: HUMAN,
  gameOver: false,
  round: 1,
  scores: { X: 0, O: 0, draw: 0 }
};

function getWinner(boardState) {
  return winningLines.find(([a, b, c]) =>
    boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]
  );
}

function render() {
  cells.forEach((cell, index) => {
    const value = state.board[index];
    cell.textContent = value;
    cell.className = `cell ${value ? value.toLowerCase() : ''}`;
    cell.disabled = Boolean(value) || state.gameOver || state.currentPlayer === COMPUTER;
    cell.setAttribute('aria-label', value ? `${value} in cell ${index + 1}` : `Empty cell ${index + 1}`);
  });

  scoreEls.X.textContent = state.scores.X;
  scoreEls.O.textContent = state.scores.O;
  scoreEls.draw.textContent = state.scores.draw;
  roundLabel.textContent = `Round ${state.round}`;
}

function finishRound(winningLine) {
  state.gameOver = true;

  if (winningLine) {
    winningLine.forEach((index) => cells[index].classList.add('winner'));
    state.scores[state.currentPlayer] += 1;
    statusEl.textContent = state.currentPlayer === HUMAN ? 'You win!' : 'Computer wins!';
  } else {
    state.scores.draw += 1;
    statusEl.textContent = "It's a draw!";
  }
}

function completeMove() {
  const winningLine = getWinner(state.board);
  render();

  if (winningLine || state.board.every(Boolean)) {
    finishRound(winningLine);
    render();
    return true;
  }

  return false;
}

function getComputerMove() {
  const openCells = state.board
    .map((value, index) => value ? null : index)
    .filter((index) => index !== null);

  for (const index of openCells) {
    const testBoard = [...state.board];
    testBoard[index] = COMPUTER;
    if (getWinner(testBoard)) return index;
  }

  for (const index of openCells) {
    const testBoard = [...state.board];
    testBoard[index] = HUMAN;
    if (getWinner(testBoard)) return index;
  }

  if (!state.board[4]) return 4;

  const corners = [0, 2, 6, 8].filter((index) => !state.board[index]);
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];

  return openCells[Math.floor(Math.random() * openCells.length)];
}

function computerTurn() {
  if (state.gameOver) return;

  const index = getComputerMove();
  if (index === undefined) return;

  state.currentPlayer = COMPUTER;
  state.board[index] = COMPUTER;

  if (completeMove()) return;

  state.currentPlayer = HUMAN;
  statusEl.textContent = "Your turn — X";
  render();
}

function play(index) {
  if (state.gameOver || state.currentPlayer !== HUMAN || state.board[index]) return;

  state.board[index] = HUMAN;
  if (completeMove()) return;

  state.currentPlayer = COMPUTER;
  statusEl.textContent = 'Computer is thinking...';
  render();
  window.setTimeout(computerTurn, 350);
}

function startRound() {
  state.board = Array(9).fill('');
  state.currentPlayer = HUMAN;
  state.gameOver = false;
  statusEl.textContent = "Your turn — X";
  render();
}

cells.forEach((cell) => cell.addEventListener('click', () => play(Number(cell.dataset.index))));
newRoundButton.addEventListener('click', () => {
  state.round += 1;
  startRound();
});
resetScoreButton.addEventListener('click', () => {
  state.scores = { X: 0, O: 0, draw: 0 };
  state.round = 1;
  startRound();
});

startRound();
