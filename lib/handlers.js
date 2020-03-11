const { Games } = require('./games');
const games = new Games();
const gameId = games.createNewGame('venky');
const game = games.getGame(gameId);
const dummySetUpInfo = {
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
    { position: '7_1', name: 'spy' },
    { position: '2_0', name: 'marshal' }
  ]
};
game.arrangeBattleField(dummySetUpInfo);

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
  const player = game.getPlayer(dummySetUpInfo.unit);
  const { army } = player.getStatus();
  res.json(army);
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

const join = function(req, res) {
  const { playerName, gameId } = req.body;
  if (games.isGameFull(gameId)) {
    res.redirect('/join.html?err=started');
    return;
  }
  if (!games.addPlayerInGame(gameId, playerName)) {
    res.redirect('/join.html?err=notexist');
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
    res.redirect('setup.html');
    return;
  }
  res.redirect('waiting.html');
};

module.exports = { hasFields, hostGame, getArmy, movePiece, join, setup };
