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
  palette.innerHTML = '';
  pieces.forEach(piece => {
    const pieceContainer = createElement('div', 'pieceContainer');
    piece.count === 0 && pieceContainer.classList.add('unavailable');
    const pieceImageContainer = createElement('div', 'pieceImageContainer');
    pieceImageContainer.appendChild(createImage(piece.name, 'pieceImage'));
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

const showPieceInfo = function() {
  const infoPanel = document.querySelector('#panel');
  document.querySelector('.infoPanel').remove();
  const selectedPiece = document.querySelector('.active').src;
  const name = selectedPiece
    .split('/')
    .pop()
    .split('.')[0];
  const image = createImage(name, 'imageInInfo');
  const pieceName = createElementWithData('h3', name);
  const info = createElementWithData('p', 'somecontent');
  const div = createElement('div', 'infoPanel');
  appendChildren(infoPanel, div);
  appendChildren(div, image, pieceName, info);
};

const selectPiece = function(setUpInfo, pieceContainer) {
  removeSelectedPiece();
  setUpInfo.selectedPiece =
    pieceContainer.lastElementChild.firstElementChild.innerText;
  pieceContainer.firstElementChild.firstElementChild.classList.add('active');
  showPieceInfo();
};

const decreaseCount = function(pieceName, pieces) {
  const piece = pieces.find(piece => piece.name === pieceName);
  piece.count--;
  const activePiece = document.querySelector('.active');
  piece.count === 0 &&
    activePiece.parentElement.parentElement.classList.add('unavailable');
  activePiece.parentElement.nextSibling.lastChild.innerText = 'x' + piece.count;
};

const placePiece = function(setUpInfo, tile, pieces) {
  const position = tile.id;
  const name = setUpInfo.selectedPiece;
  setUpInfo.piecesInfo.push({ position, name });
  const image = createImage(name, 'boardPieceImage');
  if (!image || tile.firstElementChild) {
    return;
  }
  tile.appendChild(image);
  decreaseCount(name, pieces);
  setUpInfo.selectedPiece = undefined;
  removeSelectedPiece();
};

const attachListeners = function(setUpInfo, pieces) {
  const pieceContainers = Array.from(
    document.querySelectorAll('.pieceContainer')
  );
  pieceContainers.forEach(pieceContainer => {
    pieceContainer.onclick = selectPiece.bind(null, setUpInfo, pieceContainer);
  });

  const tiles = Array.from(document.querySelectorAll('.tile'));
  tiles.forEach(tile => {
    tile.onclick = placePiece.bind(null, setUpInfo, tile, pieces);
  });
};

const main = function() {
  const setUpInfo = { selectedPiece: '', piecesInfo: [] };
  createEnemyTerritory();
  createTerritory();
  const pieces = [
    { name: 'flag', count: 1 },
    { name: 'bomb', count: 2 },
    { name: 'marshal', count: 1 },
    { name: 'miner', count: 2 },
    { name: 'scout', count: 2 },
    { name: 'general', count: 1 },
    { name: 'spy', count: 1 },
    { name: 'colonel', count: 0 },
    { name: 'lieutenant', count: 0 },
    { name: 'sergeant', count: 0 },
    { name: 'captain', count: 0 },
    { name: 'major', count: 0 }
  ];
  createPalette(pieces);
  attachListeners.bind(null, setUpInfo, pieces)();
};
window.onload = main;
