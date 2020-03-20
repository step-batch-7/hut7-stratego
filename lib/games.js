const { Game } = require('./game');
const { Player } = require('./player');

class Games {
  constructor() {
    this.games = [];
    this.lastGameId = 0;
  }

  getGame(gameId) {
    return this.games.find(game => game.getId() == gameId);
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
    const player = new Player(playerName, 'red');
    const game = new Game(gameId, player);
    game.initBattleField();
    this.addGame(game);
    return gameId;
  }

  getArmy(gameId, unit) {
    const game = this.getGame(gameId);
    return game.getArmy(unit);
  }

  movePiece(gameId, unit, from, to) {
    const game = this.getGame(gameId);
    if (game) {
      return game.movePiece(unit, from, to);
    }
    return false;
  }

  arrangeBattleField(gameId, unit, setUpData) {
    const game = this.getGame(gameId);
    return game.arrangeBattleField(unit, setUpData);
  }

  attack(gameId, unit, sourceTileId, targetTileId) {
    const game = this.getGame(gameId);
    if (game) {
      return game.attack(unit, sourceTileId, targetTileId);
    }
    return 'unsuccessful';
  }

  isSetupDone(gameId) {
    return this.getGame(gameId).isSetupDone();
  }
}

const createGames = function() {
  return new Games();
};

module.exports = { games: createGames(), createGames };
