const { Game } = require('./game');

class Games {
  constructor() {
    this.games = [];
    this.lastGameId = 0;
  }

  getGameId() {
    return this.lastGameId;
  }

  addGame(game) {
    game instanceof Game && this.games.push(game);
    return this.games.length;
  }

  createNewGame(playerName) {
    const gameId = this.getGameId();
    const game = new Game(gameId);
    this.addGame(game);
    game.addPlayer(playerName);
    return this.lastGameId++;
  }
}

module.exports = { Games };
