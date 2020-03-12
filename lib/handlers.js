const { games } = require('./games');
const gameId = games.createNewGame('venky');
games.addPlayerInGame(gameId, 'venky');
const dummySetupData = {
  unit: 'blue',
  piecesInfo: [
    { position: '9_9', name: 'flag' },
    { position: '6_3', name: 'scout' },
    { position: '9_8', name: 'bomb' },
    { position: '4_6', name: 'miner' },
    { position: '9_7', name: 'marshal' }
  ]
};
games.arrangeBattleField(gameId, dummySetupData);

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
  res.json(games.getArmy(gameId, unit));
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
  if (!(req.cookies && req.cookies.gameId)) {
    res.redirect('/');
    return;
  }
  const { gameId } = req.cookies;
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

const setupData = function(req, res) {
  if (req.body.piecesInfo.length === 10) {
    const setupData = {
      unit: req.cookies.unit,
      piecesInfo: req.body.piecesInfo
    };
    games.arrangeBattleField(req.cookies.gameId, setupData);
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
  res.render('game');
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
