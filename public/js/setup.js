const createTerritory = function() {
  const territory = document.querySelector('.territory');
  for (let row = 3; row >= 0; row--) {
    for (let column = 0; column < 10; column++) {
      const tile = document.createElement('div');
      tile.id = `${row}_${column}`;
      this[tile.id];
      tile.classList.add('tile');
      territory.appendChild(tile);
    }
  }
};

const createEnemyTerritory = function() {
  const lakePositions = [
    '4_2',
    '4_3',
    '5_2',
    '5_3',
    '4_6',
    '4_7',
    '5_6',
    '5_7'
  ];
  const territory = document.querySelector('.enemyTerritory');
  for (let row = 9; row >= 4; row--) {
    for (let column = 0; column < 10; column++) {
      const tile = document.createElement('div');
      tile.id = `${row}_${column}`;
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

const createImage = (name, className) => {
  const imagesUrl = {
    scout: './images/scout.png',
    bomb: './images/bomb.png',
    captain: './images/captain.png',
    colonel: './images/colonel.png',
    flag: './images/flag.png',
    general: './images/general.png',
    lieutenant: './images/lieutenant.png',
    major: './images/major.png',
    marshal: './images/marshal.png',
    miner: './images/miner.png',
    sergeant: './images/sergeant.png',
    spy: './images/spy.png'
  };
  if (!imagesUrl[name]) {
    return;
  }
  const htmlImgElement = document.createElement('img');
  htmlImgElement.src = imagesUrl[name];
  htmlImgElement.classList.add(className);
  return htmlImgElement;
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
  const activePieces = Array.from(document.querySelectorAll('.active'));
  activePieces.forEach(activePiece => activePiece.classList.remove('active'));
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
  createTerritory();
  createEnemyTerritory();
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
