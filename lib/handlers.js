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

module.exports = { getId, hostGame };
