const { Game } = require('./game');
const { Player } = require('./player');

const createBattleField = function(numberOfRows, numberOfColumns) {
  const battleField = {};
  for (let row = 0; row < numberOfRows; row++) {
    for (let column = 0; column < numberOfColumns; column++) {
      battleField[`${row}_${column}`] = undefined;
    }
  }
  return battleField;
};
class Games {
  constructor() {
    this.games = [];
    this.lastGameId = 0;
  }

  getGame(gameId) {
    return this.games.find(game => game.getId() === gameId);
  }

  isGameFull(gameId) {
    const game = this.getGame(+gameId);
    if (game) {
      return game.isFull();
    }
  }

  addPlayerInGame(gameId, playerName) {
    const game = this.getGame(+gameId);
    if (game) {
      const player = new Player(playerName, 'blue');
      game.addPlayer(player);
      return true;
    }
    return false;
  }

  addGame(game) {
    game instanceof Game && this.games.push(game);
    return this.games.length;
  }

  createNewGame(playerName) {
    const gameId = ++this.lastGameId;
    const battleField = createBattleField(10, 10);
    const player = new Player(playerName, 'red');
    const game = new Game(gameId, player, battleField);
    this.addGame(game);
    return gameId;
  }
}

module.exports = { Games, createBattleField };
