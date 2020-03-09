const assert = require('chai').assert;
const { Games, createBattleField } = require('../lib/games');
const { Game } = require('../lib/game');
const { Player } = require('./../lib/player');

describe('Games', () => {
  context('addGame', () => {
    it('should add new game into games', () => {
      const gameId = 123;
      const player = new Player('venky', 'red');
      const game = new Game(gameId, player, createBattleField(10, 10));
      const games = new Games();
      assert.strictEqual(games.addGame(game), 1);
    });
    it('should not add new game if its not instance of the game class', () => {
      const games = new Games();
      const game = {
        id: 123,
        players: [{ name: 'venky', unit: 'red' }],
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
