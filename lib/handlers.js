const { Games } = require('./games');
const games = new Games();

const getId = function(req, res) {
  const gameId = games.getGameId();
  res.json(gameId);
};

const hostGame = function(req, res) {
  games.createNewGame(req.body.playerName);
  res.end();
};

const getArmy = function(req, res) {
  const dummySetUpInfo = {
    unit: 'red',
    piecesInfo: [{ position: '0_9', name: 'marshal' }]
  };
  const games = new Games();
  const gameId = games.createNewGame('venky');
  const game = games.getGame(gameId);
  game.arrangeBattleField(dummySetUpInfo);
  const player = game.getPlayer(dummySetUpInfo.unit);
  const { army } = player.getStatus();
  res.json(army);
};

module.exports = { getId, hostGame, getArmy };
