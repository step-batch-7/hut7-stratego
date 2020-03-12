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
  const infoPanel = document.querySelector('.infoPanel');
  infoPanel.innerText = '';
  const name = document.querySelector('.active').id;
  const image = createImage(name, 'imageInInfo');
  const pieceName = createElementWithData('h2', name.toUpperCase());
  const requiredPiece = pieceInfo.find(
    piece => piece.Piece.toLowerCase() === name
  );
  const rank = createElementWithData('p', `Rank : ${requiredPiece.Rank}`);
  const info = createElementWithData('p', `Ability : ${requiredPiece.ability}`);
  appendChildren(infoPanel, image, pieceName, rank, info);
};

const selectPiece = function(setUpInfo, pieceContainer) {
  removeSelectedPiece();
  setUpInfo.selectedPiece = pieceContainer.querySelector('span').innerText;
  pieceContainer.querySelector('img').classList.add('active');
  showPieceInfo();
};

const decreaseCount = function(pieceName, pieces) {
  const piece = pieces.find(piece => piece.name === pieceName);
  piece.count -= 1;
  const activePiece = document.querySelector('.active');
  piece.count === 0 &&
    activePiece.closest('.pieceContainer').classList.add('unavailable');
  activePiece.parentElement.nextSibling.lastChild.innerText = 'x' + piece.count;
  removeSelectedPiece();
};

const increasePieceCount = function(pieceInfo, pieceName) {
  const piece = pieceInfo.find(piece => piece.name === pieceName);
  piece.count += 1;
  const activePiece = document.querySelector(
    `.pieceImageContainer #${pieceName}`
  );
  activePiece.closest('.pieceContainer').classList.remove('unavailable');
  activePiece.parentElement.nextSibling.lastChild.innerText = 'x' + piece.count;
};

const removePieceFromTile = function(tile, pieces) {
  const name = tile.firstElementChild.id;
  tile.firstElementChild.remove();
  increasePieceCount(pieces, name);
};

const placePiece = function(setUpInfo, tile, pieces) {
  const name = setUpInfo.selectedPiece;
  setUpInfo.piecesInfo.push({ position: tile.id, name });
  const image = createImage(name, 'boardPieceImage');
  if (tile.firstElementChild) {
    return removePieceFromTile(tile, pieces);
  }
  if (!image) {
    return;
  }
  tile.appendChild(image);
  decreaseCount(name, pieces);
  setUpInfo.selectedPiece = undefined;
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
