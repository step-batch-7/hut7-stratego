const assert = require('chai').assert;
const { Game, createBattleFieldTemplate } = require('./../lib/game');
const { Player } = require('./../lib/player');

describe('Game', () => {
  context('.getStatus()', () => {
    it('should give the status of the game', () => {
      const gameId = 123;
      const game = new Game(gameId, createBattleFieldTemplate(1, 1));
      assert.deepStrictEqual(game.getStatus(), {
        id: 123,
        players: [],
        battleField: { '0_0': undefined },
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
  context('.addPlayer()', () => {
    it('should add the given player in Game', () => {
      const game = new Game(123, createBattleFieldTemplate(10, 10));
      const player = new Player('venky', 'red');
      const numberOfPlayers = game.addPlayer(player);
      assert.strictEqual(numberOfPlayers, 1);
    });
    it('should not add the given player in Game if player is not an instance of Player class ', () => {
      const game = new Game(123, createBattleFieldTemplate(10, 10));
      const player = {
        name: 'venky',
        unit: 'red'
      };
      const numberOfPlayers = game.addPlayer(player);
      assert.strictEqual(numberOfPlayers, 0);
    });
  });

  context('.getPlayer()', () => {
    it('should give player of given unit', () => {
      const game = new Game(123, createBattleFieldTemplate(10, 10));
      const player = new Player('venky', 'red');
      game.addPlayer(player);
      assert.strictEqual(game.getPlayer('red'), player);
    });
      
    it('should give undefined when player of the given unit does not exists', () => {
      const game = new Game(123, createBattleFieldTemplate(10, 10));
      const player = new Player('venky', 'red');
      game.addPlayer(player);
      assert.isUndefined(game.getPlayer('blue'));
    });
  });

  context('.arrangeBattleField()', () => {
    it('should record the position of all components of the board', () => {
      const game = new Game(123, createBattleFieldTemplate(10, 10));
      const player = new Player('venky', 'red');
      game.addPlayer(player);
      const setUpInfo = {
        unit: 'red',
        piecesInfo: [{ position: '0_0', name: 'marshal' }]
      };
      assert.isTrue(game.arrangeBattleField(setUpInfo));
    });

    it('should not update the battleField if unit is other than red or blue', () => {
      const game = new Game(123, createBattleFieldTemplate(10, 10));
      const player = new Player('venky', 'green');
      game.addPlayer(player);
      const setUpInfo = {
        unit: 'green',
        piecesInfo: [{ position: '0_0', name: 'marshal' }]
      };
      assert.isFalse(game.arrangeBattleField(setUpInfo));
    });

    it('should not update the battleField if piece is not a game component', () => {
      const game = new Game(123, createBattleFieldTemplate(10, 10));
      const player = new Player('venky', 'red');
      game.addPlayer(player);
      const setUpInfo = {
        unit: 'red',
        piecesInfo: [{ position: '0_0', name: 'cannon' }]
      };
      assert.isFalse(game.arrangeBattleField(setUpInfo));
    });
  });
});
