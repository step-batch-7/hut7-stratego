const { Games } = require('./games');
const games = new Games();

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
    res.status(400).end();
  };
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

module.exports = { hasFields, hostGame, getArmy };
