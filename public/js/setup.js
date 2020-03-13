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
const getCookie = function(key) {
  const regexp = new RegExp(`.*${key}=([^;]*)`);
  const result = regexp.exec(document.cookie);
  if (result) {
    return result[1];
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
    pieceImageContainer.appendChild(
      createImage(piece.name, 'pieceImage', getCookie('unit'))
    );
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
  const image = createImage(name, 'imageInInfo', getCookie('unit'));
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

const removePieceFromTile = function(tile, pieces, setUpInfo) {
  const name = tile.firstElementChild.id;
  const fightBtn = document.querySelector('.fightBtn');
  fightBtn.classList.add('disabled');
  const removedPieceIndex = setUpInfo.piecesInfo.findIndex(
    piece => piece.name === name
  );
  setUpInfo.piecesInfo.splice(removedPieceIndex, 1);
  tile.firstElementChild.remove();
  increasePieceCount(pieces, name);
};

const redirectToUrl = function(res) {
  if (res.page) {
    window.location.href = `/${res.page}`;
  }
};

const checkIfBoardSet = function(setUpInfo) {
  setUpInfo.selectedPiece = undefined;
  const { piecesInfo } = setUpInfo;
  const placedPiecesCount = piecesInfo.length;
  const fightBtn = document.querySelector('.fightBtn');
  fightBtn.classList.add('disabled');
  if (placedPiecesCount === 10) {
    fightBtn.classList.remove('disabled');
  }
};

const placePiece = function(setUpInfo, tile, pieces) {
  const name = setUpInfo.selectedPiece;
  const image = createImage(name, 'boardPieceImage', getCookie('unit'));
  if (tile.firstElementChild) {
    return removePieceFromTile(tile, pieces, setUpInfo);
  }
  if (!image) {
    return;
  }
  setUpInfo.piecesInfo.push({ position: tile.id, name });
  tile.appendChild(image);
  decreaseCount(name, pieces);
  checkIfBoardSet(setUpInfo);
};

const attachListeners = function(setUpInfo, pieces) {
  const fightBtn = document.querySelector('.fightBtn');
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
  fightBtn.addEventListener('click', function() {
    sendReq('POST', '/setupData', redirectToUrl, JSON.stringify(setUpInfo));
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
