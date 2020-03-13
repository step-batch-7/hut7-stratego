const { games } = require('./games');

const dummySetupData = {
  unit: 'blue',
  piecesInfo: [
    { position: '9_9', name: 'flag' },
    { position: '6_6', name: 'scout' },
    { position: '9_8', name: 'bomb' },
    { position: '4_6', name: 'miner' },
    { position: '9_7', name: 'marshal' }
  ]
};

const hostGame = function(req, res) {
  const playerName = req.body.playerName;
  const gameId = games.createNewGame(playerName);
  res.cookie('gameId', gameId);
  res.cookie('unit', 'red');
  res.redirect('/setup');
};

const hasFields = (...fields) => {
  return (req, res, next) => {
    if (fields.every(field => field in req.body)) {
      return next();
    }
    res.sendStatus(400).end();
  };
};

const getArmy = function(req, res) {
  const { unit, gameId } = req.cookies;
  if (unit && gameId) {
    res.json(games.getArmy(gameId, unit));
    return;
  }
  res.sendStatus(404);
};

const movePiece = function(req, res) {
  const { sourceTileId, targetTileId } = req.body;
  const { unit, gameId } = req.cookies;
  const isMoveSuccessful = games.movePiece(
    gameId,
    unit,
    sourceTileId,
    targetTileId
  );
  if (isMoveSuccessful) {
    res.json({ action: 'move', sourceTileId, targetTileId }).end();
    return;
  }
  res.status(400).end();
};

const attack = function(req, res) {
  const attackStatus = ['won', 'lost', 'draw'];
  const { sourceTileId, targetTileId, unit } = req.body;
  const gameId = req.cookies.gameId;
  const status = games.attack(gameId, sourceTileId, targetTileId, unit);
  if (attackStatus.includes(status)) {
    res.json({
      action: 'attack',
      sourceTileId,
      targetTileId,
      status: status
    });
    return;
  }
  res.sendStatus(400);
};

const join = function(req, res) {
  const { playerName, gameId } = req.body;
  if (games.isGameFull(gameId)) {
    res.render('join', { errorMsg: 'Game has been started' });
    return;
  }
  if (!games.addPlayerInGame(gameId, playerName)) {
    res.render('join', { errorMsg: 'Game does not exist' });
    return;
  }
  res.cookie('gameId', gameId);
  res.cookie('unit', 'blue');
  res.redirect('/setup');
};

const setup = function(req, res) {
  const { gameId } = req.cookies;
  if (!games.getGame(gameId)) {
    res.redirect('/');
    return;
  }
  if (games.isGameFull(gameId)) {
    res.render('setup');
    return;
  }
  res.render('waiting', { gameId });
};

const serveHostPage = function(req, res) {
  res.render('host');
};

const serveJoinPage = function(req, res) {
  res.render('join');
};

const areAllPlayersJoined = function(req, res) {
  const { gameId } = req.cookies;
  const isGameFull = games.isGameFull(gameId);
  if (isGameFull) {
    res.json({ playerJoined: true });
    return;
  }
  res.json({ playerJoined: false });
};

const countPieces = function(container, piece) {
  const { individualPieceInfo } = container;
  ++container.totalPieceCount;
  if (Object.keys(individualPieceInfo).includes(piece.name)) {
    ++individualPieceInfo[piece.name];
  } else {
    container.individualPieceInfo[piece.name] = 1;
  }
  return container;
};

const getPiecesCount = function(pieceInfo) {
  return pieceInfo.reduce(countPieces, {
    totalPieceCount: 0,
    individualPieceInfo: {}
  });
};

const validatePiecesCount = function(pieceSetup, individualPieceInfo) {
  const isValid = pieceSetup.reduce((valid, piece) => {
    const pieceName = piece.name;
    const individualPieces = Object.keys(individualPieceInfo);
    const isPieceAvailable = individualPieces.includes(pieceName);
    if (isPieceAvailable) {
      const expectedPieceCount = piece.count;
      const actualPieceCount = individualPieceInfo[pieceName];
      const isValidCount = expectedPieceCount === actualPieceCount;
      return valid && isValidCount;
    }
    return valid && isPieceAvailable;
  }, true);
  return isValid;
};

const validateSetupData = function(pieceInfo) {
  const pieceSetup = [
    { name: 'flag', count: 1 },
    { name: 'bomb', count: 2 },
    { name: 'marshal', count: 1 },
    { name: 'miner', count: 2 },
    { name: 'scout', count: 2 },
    { name: 'general', count: 1 },
    { name: 'spy', count: 1 }
  ];
  const { individualPieceInfo, totalPieceCount } = getPiecesCount(pieceInfo);
  const isValidPieces = validatePiecesCount(pieceSetup, individualPieceInfo);
  const piecesCount = 10;
  const isValidPiecesCount = totalPieceCount === piecesCount;
  return isValidPiecesCount && isValidPieces;
};

const setupData = function(req, res) {
  const unit = req.cookies.unit;
  const piecesInfo = req.body.piecesInfo;
  if (validateSetupData(piecesInfo)) {
    games.arrangeBattleField(req.cookies.gameId, { unit, piecesInfo });
    if (unit === 'blue') {
      dummySetupData.unit = 'red';
    }
    games.arrangeBattleField(req.cookies.gameId, dummySetupData);
    res
      .json({ page: 'game' })
      .status(200)
      .end();
    return;
  }
  res.sendStatus(400).end();
};

const gamePage = function(req, res) {
  const { gameId, unit } = req.cookies;

  if (!gameId && !unit) {
    res.redirect('/');
    return;
  }

  if (games.isSetupDone(gameId)) {
    res.render('game');
    return;
  }
  res.redirect('/setup');
};

module.exports = {
  hasFields,
  hostGame,
  getArmy,
  movePiece,
  join,
  setup,
  serveHostPage,
  serveJoinPage,
  areAllPlayersJoined,
  attack,
  setupData,
  gamePage
};
