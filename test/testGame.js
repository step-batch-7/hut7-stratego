const assert = require('chai').assert;
const { Game } = require('./../lib/game');

describe('Game', () => {
  context('.getStatus', () => {
    it('should give the status of the game', () => {
      const gameId = 123;
      const game = new Game(gameId);
      assert.deepStrictEqual(game.getStatus(), {
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
      });
    });
  });
});
