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

const createPiece = function(pieceName, unit) {
  const piece = createImage(pieceName, 'pieceImage');
  piece.classList.add('piece');
  piece.classList.add(unit);
  return piece;
};

const createPieceAt = function(pieceName, tileId, unit) {
  const tile = document.getElementById(tileId);
  const piece = createPiece(pieceName, unit);
  tile.appendChild(piece);
};

const attackPiece = function(res) {
  const { sourceTileId, targetTileId, status } = res;
  const tileIds = {
    won: [targetTileId],
    lost: [sourceTileId],
    draw: [sourceTileId, targetTileId]
  };

  const tileIdToClear = tileIds[status];
  tileIdToClear.forEach(tileId => {
    document.getElementById(tileId).innerHTML = '';
  });
};

const movePiece = function(res) {
  const sourceTile = document.getElementById(res.sourceTileId);
  const targetTile = document.getElementById(res.targetTileId);
  const piece = sourceTile.firstChild;
  targetTile.appendChild(piece);
};

const isMyPiece = function(tile) {
  return tile.firstChild && tile.firstChild.classList.contains('red');
};

const hasAllFields = function({ sourceTileId, targetTileId }) {
  return sourceTileId && targetTileId;
};

const sendActionReq = function(moveInfo) {
  const reqUrls = { move: '/movePiece', attack: '/attack' };
  const callbackLookup = { move: movePiece, attack: attackPiece };
  const url = reqUrls[moveInfo.action];
  const callback = callbackLookup[moveInfo.action];
  sendReq('POST', url, callback, JSON.stringify(moveInfo));
};

const updateMoveInfo = function(moveInfo, tile) {
  if (isMyPiece(tile)) {
    moveInfo.sourceTileId = tile.id;
    return;
  }
  moveInfo.targetTileId = tile.id;
  moveInfo.action = tile.firstChild ? 'attack' : 'move';
  if (hasAllFields(moveInfo)) {
    sendActionReq(moveInfo);
  }
  moveInfo.sourceTileId = '';
  moveInfo.targetTileId = '';
};

const placeArmyOnBoard = function(army, unit) {
  army.forEach(soldier => {
    const { name, position } = soldier;
    const tileId = position.join('_');
    createPieceAt(name, tileId, unit);
  });
};

const setupBoard = function(army) {
  const moveInfo = {
    sourceTileId: '',
    targetTileId: '',
    action: 'move',
    unit: 'red'
  };
  const { redArmy, blueArmy } = army;
  placeArmyOnBoard(redArmy, 'red');
  placeArmyOnBoard(blueArmy, 'blue');
  attachListeners(moveInfo);
};

const attachListeners = function(moveInfo) {
  const tiles = Array.from(document.querySelectorAll('.tile'));
  tiles.forEach(tile => {
    tile.onclick = updateMoveInfo.bind(null, moveInfo, tile);
  });
};

const main = function() {
  const root = document.getElementById('root');
  const board = createBoard();
  root.appendChild(board);
  sendReq('GET', '/army', setupBoard);
};

window.onload = main;
