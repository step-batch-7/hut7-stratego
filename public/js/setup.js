const createTerritory = function() {
  const territory = document.querySelector('.territory');
  for (let row = 3; row >= 0; row--) {
    for (let column = 0; column < 10; column++) {
      const tile = document.createElement('div');
      tile.id = `${column}_${row}`;
      tile.classList.add('tile');
      territory.appendChild(tile);
    }
  }
};

const createEnemyTerritory = function() {
  const lakePositions = [
    '2_4',
    '3_4',
    '2_5',
    '3_5',
    '6_4',
    '7_4',
    '6_5',
    '7_5'
  ];
  const territory = document.querySelector('.enemyTerritory');
  for (let row = 9; row >= 4; row--) {
    for (let column = 0; column < 10; column++) {
      const tile = document.createElement('div');
      tile.id = `${column}_${row}`;
      this[tile.id];
      lakePositions.includes(tile.id) && tile.classList.add('lake');
      tile.classList.add('enemyTerritoryTile');
      territory.appendChild(tile);
    }
  }
};

const createElement = (element, className) => {
  const htmlElement = document.createElement(element);
  htmlElement.classList.add(className);
  return htmlElement;
};

const createElementWithData = (element, data) => {
  const htmlElement = document.createElement(element);
  htmlElement.innerText = data;
  return htmlElement;
};

const appendChildren = function(parent, ...children) {
  children.forEach(child => parent.appendChild(child));
};

const createPalette = function(pieces) {
  const palette = document.querySelector('.palette');
  pieces.forEach(piece => {
    const pieceContainer = createElement('div', 'pieceContainer');
    const pieceImageContainer = createElement('div', 'pieceImageContainer');
    const pieceImage = createImage(piece.name, 'pieceImage');
    pieceImageContainer.appendChild(pieceImage);
    const pieceData = createElement('div', 'pieceData');
    const pieceName = createElementWithData('span', piece.name);
    const pieceCount = createElementWithData('span', 'x' + piece.count);
    appendChildren(pieceData, pieceName, pieceCount);
    appendChildren(pieceContainer, pieceImageContainer, pieceData);
    palette.appendChild(pieceContainer);
  });
};

const removeSelectedPiece = function() {
  const activePiece = document.querySelector('.active');
  activePiece && activePiece.classList.remove('active');
};

const selectPiece = function(setUpInfo, pieceContainer) {
  removeSelectedPiece();
  setUpInfo.selectedPiece =
    pieceContainer.lastElementChild.firstElementChild.innerText;
  pieceContainer.firstElementChild.firstElementChild.classList.add('active');
};

const placePiece = function(setUpInfo, tile) {
  const position = tile.id;
  const name = setUpInfo.selectedPiece;
  setUpInfo.piecesInfo.push({ position, name });
  const image = createImage(name, 'boardPieceImage');
  if (!image) {
    return;
  }
  tile.firstElementChild || tile.appendChild(image);
  setUpInfo.selectedPiece = undefined;
  removeSelectedPiece();
};

const attachListeners = function() {
  const pieceContainers = Array.from(
    document.querySelectorAll('.pieceContainer')
  );
  pieceContainers.forEach(pieceContainer => {
    pieceContainer.onclick = selectPiece.bind(null, this, pieceContainer);
  });

  const tiles = Array.from(document.querySelectorAll('.tile'));
  tiles.forEach(tile => {
    tile.onclick = placePiece.bind(null, this, tile);
  });
};

const main = function() {
  const setUpInfo = { selectedPiece: '', piecesInfo: [] };
  createEnemyTerritory();
  createTerritory();
  const pieces = [
    { name: 'marshal', count: 1 },
    { name: 'scout', count: 2 },
    { name: 'bomb', count: 2 },
    { name: 'miner', count: 2 },
    { name: 'flag', count: 1 },
    { name: 'colonel', count: 1 },
    { name: 'general', count: 1 },
    { name: 'lieutenant', count: 1 },
    { name: 'sergeant', count: 1 },
    { name: 'captain', count: 1 },
    { name: 'major', count: 1 },
    { name: 'spy', count: 1 }
  ];
  createPalette(pieces);
  attachListeners.bind(setUpInfo)();
};
window.onload = main;
