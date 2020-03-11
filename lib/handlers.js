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
  res.redirect('setup.html');
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

module.exports = { hasFields, hostGame, getArmy, movePiece };
