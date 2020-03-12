const { Games } = require('./games');
const { Player } = require('./player');
const games = new Games();
const gameId = games.createNewGame('venky');
const game = games.getGame(gameId);
const player2 = new Player('rajat', 'blue');
game.addPlayer(player2);

const dummySetUpInfo1 = {
  unit: 'red',
  piecesInfo: [
    { position: '0_0', name: 'flag' },
    { position: '4_0', name: 'scout' },
    { position: '9_0', name: 'scout' },
    { position: '1_0', name: 'bomb' },
    { position: '0_1', name: 'bomb' },
    { position: '7_3', name: 'general' },
    { position: '2_2', name: 'miner' },
    { position: '1_1', name: 'miner' },
    { position: '7_0', name: 'spy' },
    { position: '2_0', name: 'marshal' }
  ]
};
const dummySetUpInfo2 = {
  unit: 'blue',
  piecesInfo: [
    { position: '9_9', name: 'flag' },
    { position: '6_3', name: 'scout' },
    { position: '9_8', name: 'bomb' },
    { position: '4_6', name: 'miner' },
    { position: '9_7', name: 'marshal' }
  ]
};
game.arrangeBattleField(dummySetUpInfo1);
game.arrangeBattleField(dummySetUpInfo2);

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
  res.json(game.getArmy(dummySetUpInfo1.unit));
};

const movePiece = function(req, res) {
  const { sourceTileId, targetTileId } = req.body;
  const isMoveSuccessful = game.movePiece('red', sourceTileId, targetTileId);
  if (isMoveSuccessful) {
    res.json({ action: 'move', sourceTileId, targetTileId }).end();
    return;
  }
  res.status(400).end();
};

const attack = function(req, res) {
  const attackStatus = ['won', 'lost', 'draw'];
  const { sourceTileId, targetTileId, unit } = req.body;
  const status = game.attack(sourceTileId, targetTileId, unit);
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
  attack
};
