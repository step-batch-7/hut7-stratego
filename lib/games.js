const { Game } = require('./game');
const { Player } = require('./player');

const createBattleField = function(numberOfRows, numberOfColumns) {
  const lakePosition = ['2_4', '3_4', '2_5', '3_5', '6_4', '7_4', '6_5', '7_5'];
  const battleField = {};
  for (let row = 0; row < numberOfRows; row++) {
    for (let column = 0; column < numberOfColumns; column++) {
      const position = `${row}_${column}`;
      battleField[position] = undefined;
      if (lakePosition.includes(position)) {
        battleField[position] = { name: 'lake' };
      }
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
      game.finishedSetup();
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

  getArmy(gameId, unit) {
    const game = this.getGame(gameId);
    return game.getArmy(unit);
  }

  movePiece(gameId, unit, from, to) {
    const game = this.getGame(gameId);
    return game.movePiece(unit, from, to);
  }

  arrangeBattleField(gameId, setUpData) {
    const game = this.getGame(gameId);
    return game.arrangeBattleField(setUpData);
  }

  attack(gameId, sourceTileId, targetTileId, unit) {
    const game = this.getGame(gameId);
    return game.attack(sourceTileId, targetTileId, unit);
  }

  isSetupDone(gameId) {
    return this.getGame(gameId).isSetupDone();
  }
}

const createGames = function() {
  return new Games();
};
module.exports = { games: createGames(), createGames, createBattleField };
