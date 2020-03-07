const { Game } = require('./game');

class Games {
  constructor() {
    this.games = [];
    this.lastGameId = 0;
  }

  addGame(game) {
    game instanceof Game && this.games.push(game);
    return this.games.length;
  }

  createNewGame(playerName) {
    const gameId = this.lastGameId;
    const game = new Game(gameId);
    this.addGame(game);
    game.addPlayer(playerName);
    return this.lastGameId++;
  }
}

module.exports = { Games };
