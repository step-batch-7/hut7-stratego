const assert = require('chai').assert;
const { Game } = require('./../lib/game');
const { Player } = require('./../lib/player');

describe('Game', () => {
  context('.getStatus()', () => {
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

    context('.addPlayer()', () => {
      it('should add the given player in Game', () => {
        const gameId = 123;
        const game = new Game(gameId);
        const player = new Player('venky', 'red');
        const numberOfPlayers = game.addPlayer(player);
        assert.strictEqual(numberOfPlayers, 1);
      });
      it('should not add the given player in Game if player is not an instance of Player class ', () => {
        const gameId = 123;
        const game = new Game(gameId);
        const player = {
          name: 'venky',
          unit: 'red'
        };
        const numberOfPlayers = game.addPlayer(player);
        assert.strictEqual(numberOfPlayers, 0);
      });
    });
  });
});
