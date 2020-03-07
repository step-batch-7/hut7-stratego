const assert = require('chai').assert;
const { Games } = require('../lib/games');
const { Game } = require('../lib/game');

describe('Games', () => {
  context('addGame', () => {
    it('should add new game into games', () => {
      const gameId = 123;
      const game = new Game(gameId);
      const games = new Games();
      assert.strictEqual(games.addGame(game), 1);
    });
    it('should not add new game into games if the new game is not instance of the game class', () => {
      const games = new Games();
      const game = {
        id: 123,
        players: [],
        battleField: {},
        lakePositions: [
          [2, 4],
          [3, 4],
          [2, 5],
          [3, 5],
          [6, 4],
          [7, 4],
          [6, 5],
          [7, 5]
        ]
      };
      assert.strictEqual(games.addGame(game), 0);
    });
  });
  context('createNewGame', () => {
    it('should give game id of the new game', () => {
      const games = new Games();
      assert.strictEqual(games.createNewGame('player'), 0);
    });
  });
  context('getGameId', () => {
    it('should give the last game id', () => {
      const games = new Games();
      assert.strictEqual(games.getGameId(), 0);
    });
  });
});
