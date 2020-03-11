const BOARD_LENGTH = 74;
const numberOfTilesInRow = 10;

const htmlLength = length => `${length}vh`;

const createTile = function(row, column) {
  const tile = document.createElement('div');
  tile.style.height = htmlLength(BOARD_LENGTH / numberOfTilesInRow);
  tile.style.width = htmlLength(BOARD_LENGTH / numberOfTilesInRow);
  tile.classList.add('tile');
  tile.id = `${column}_${row}`;
  lakePositions.includes(tile.id) && tile.classList.add('lake');
  return tile;
};

const createBoard = function() {
  const board = document.createElement('div');
  board.style.height = htmlLength(BOARD_LENGTH);
  board.style.width = htmlLength(BOARD_LENGTH);
  board.className = 'board center';
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
  piece.classList.add('piece');
  return piece;
};

const movePiece = function(res) {
  const sourceTile = document.getElementById(res.sourceTileId);
  const targetTile = document.getElementById(res.targetTileId);
  const piece = sourceTile.firstChild;
  targetTile.appendChild(piece);
};

const updateTile = function(moveInfo) {
  const clickedTile = event.target;
  const hasPiece = clickedTile.className.includes('piece');
  if (hasPiece) {
    moveInfo.sourceTileId = clickedTile.parentElement.id;
  } else {
    moveInfo.targetTileId = clickedTile.id;
    const isAnyFieldEmpty = Object.values(moveInfo).every(
      tileId => tileId !== ''
    );
    if (isAnyFieldEmpty) {
      sendReq('POST', '/movePiece', movePiece, JSON.stringify(moveInfo));
    }
  }
};

const createPieceAt = function(pieceName, tileId) {
  const tile = document.getElementById(tileId);
  const piece = createPiece(pieceName);
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
    tile.onclick = updateTile.bind(null, moveInfo);
  });
};

const main = function() {
  const root = document.getElementById('root');
  const board = createBoard();
  root.appendChild(board);
  sendReq('GET', '/army', setupBoard);
};

window.onload = main;
