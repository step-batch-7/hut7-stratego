const BOARD_LENGTH = 30;
const numberOfTilesInRow = 10;

const htmlLength = length => `${length}rem`;

const createTile = function(row, column) {
  const tile = document.createElement('div');
  tile.style.height = htmlLength(BOARD_LENGTH / numberOfTilesInRow);
  tile.style.width = htmlLength(BOARD_LENGTH / numberOfTilesInRow);
  tile.classList.add('tile');
  tile.id = `${row}_${column}`;
  return tile;
};

const createBoard = function() {
  const board = document.createElement('div');
  board.style.height = htmlLength(BOARD_LENGTH);
  board.style.width = htmlLength(BOARD_LENGTH);
  board.classList.add('board');
  board.id = 'board';
  for (let row = 9; row >= 0; row--) {
    for (let column = 0; column < 10; column++) {
      const tile = createTile(row, column);
      board.appendChild(tile);
    }
  }
  return board;
};
const createPiece = function() {
  const piece = document.createElement('div');
  piece.style.height = htmlLength(BOARD_LENGTH / 10 - 1);
  piece.style.width = htmlLength(BOARD_LENGTH / 10 - 1);
  piece.classList.add('piece');
  piece.classList.add('center');
  return piece;
};

const createPieceAt = function(tileId) {
  const tile = document.getElementById(tileId);
  const piece = createPiece();
  tile.appendChild(piece);
};

const main = function() {
  const root = document.getElementById('root');
  const board = createBoard();
  root.appendChild(board);
  createPieceAt('0_4');
};

window.onload = main;
