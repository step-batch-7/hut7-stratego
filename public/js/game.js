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

const createPiece = function(pieceName) {
  const piece = createImage(pieceName, 'pieceImage');
  const pieceLength = BOARD_LENGTH / numberOfTilesInRow;
  piece.style.height = htmlLength(pieceLength);
  piece.style.width = htmlLength(pieceLength);
  piece.classList.add('piece');
  return piece;
};

const selectPiece = function(moveInfo) {
  moveInfo.sourceTileId = event.target.parentElement.id;
};

const movePiece = function(moveInfo, coordinates) {
  const position = coordinates.join('_');
  const sourceTileId = moveInfo.sourceTileId;
  const sourceTile = document.getElementById(sourceTileId);
  const targetTile = document.getElementById(position);
  const piece = sourceTile.firstChild;
  targetTile.appendChild(piece);
};

const selectTile = function(moveInfo) {
  moveInfo.targetTileId = event.target.id;
  sendReq(
    'POST',
    '/movePiece',
    movePiece.bind(null, moveInfo),
    JSON.stringify(moveInfo)
  );
};

const createPieceAt = function(pieceName, tileId) {
  const tile = document.getElementById(tileId);
  const piece = createPiece(pieceName);
  piece.onclick = selectPiece;
  tile.appendChild(piece);
};

const setupBoard = function(army) {
  const moveInfo = { sourceTileId: '', targetTileId: '' };
  army.forEach(soldier => {
    const { name, position } = soldier;
    const tileId = position.join('_');
    createPieceAt(name, tileId);
  });
  attachListeners(moveInfo);
};

const attachListeners = function(moveInfo) {
  const tiles = Array.from(document.querySelectorAll('.tile'));
  tiles.forEach(tile => {
    tile.onclick = selectTile.bind(null, moveInfo);
  });

  const pieces = Array.from(document.querySelectorAll('.piece'));
  pieces.forEach(piece => {
    piece.onclick = selectPiece.bind(null, moveInfo);
  });
};

const main = function() {
  const root = document.getElementById('root');
  const board = createBoard();
  root.appendChild(board);
  sendReq('GET', '/army', setupBoard);
};

window.onload = main;
