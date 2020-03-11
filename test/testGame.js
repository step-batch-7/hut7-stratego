const assert = require('chai').assert;
const { Game } = require('./../lib/game');
const { Player } = require('./../lib/player');
const { createBattleField } = require('./../lib/games');

describe('Game', () => {
  context('.getStatus()', () => {
    it('should give the status of the game', () => {
      const gameId = 123;
      const player = new Player('venky', 'red');
      const game = new Game(gameId, player, createBattleField(1, 1));
      assert.deepStrictEqual(game.getStatus(), {
        id: 123,
        players: [player],
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

  context('.getId', () => {
    it('should return the id of the game', () => {
      const gameId = 123;
      const player = new Player('venky', 'red');
      const game = new Game(gameId, player, createBattleField(1, 1));
      assert.strictEqual(game.getId(), 123);
    });
  });

  context('.addPlayer()', () => {
    it('should add the given player in Game', () => {
      const player1 = new Player('venky', 'red');
      const game = new Game(123, player1, createBattleField(10, 10));
      const player2 = new Player('rajat', 'blue');
      const numberOfPlayers = game.addPlayer(player2);
      assert.strictEqual(numberOfPlayers, 2);
    });
    it('should not add player if its not an instance of Player class ', () => {
      const player1 = new Player('venky', 'red');
      const game = new Game(123, player1, createBattleField(10, 10));
      const player2 = {
        name: 'venky',
        unit: 'red'
      };
      const numberOfPlayers = game.addPlayer(player2);
      assert.strictEqual(numberOfPlayers, 1);
    });
  });

  context('.getPlayer()', () => {
    it('should give player of given unit', () => {
      const player = new Player('venky', 'red');
      const game = new Game(123, player, createBattleField(10, 10));
      assert.strictEqual(game.getPlayer('red'), player);
    });

    it('should give undefined when player of the given unit does not exists', () => {
      const player = new Player('venky', 'red');
      const game = new Game(123, player, createBattleField(10, 10));
      assert.isUndefined(game.getPlayer('blue'));
    });
  });

  context('.arrangeBattleField()', () => {
    it('should record the position of all components of the board', () => {
      const player = new Player('venky', 'red');
      const game = new Game(123, player, createBattleField(10, 10));
      const setUpInfo = {
        unit: 'red',
        piecesInfo: [{ position: '0_0', name: 'marshal' }]
      };
      assert.isTrue(game.arrangeBattleField(setUpInfo));
    });

    it('should not update the battleField if unit is other than red or blue', () => {
      const player = new Player('venky', 'red');
      const game = new Game(123, player, createBattleField(10, 10));
      const setUpInfo = {
        unit: 'green',
        piecesInfo: [{ position: '0_0', name: 'marshal' }]
      };
      assert.isFalse(game.arrangeBattleField(setUpInfo));
    });

    it('should not update the battleField if piece is not a game component', () => {
      const player = new Player('venky', 'red');
      const game = new Game(123, player, createBattleField(10, 10));
      const setUpInfo = {
        unit: 'red',
        piecesInfo: [{ position: '0_0', name: 'cannon' }]
      };
      assert.isFalse(game.arrangeBattleField(setUpInfo));
    });
  });

  context('.isTargetOnLake()', () => {
    it('should return true if target is on Lake', () => {
      const player = new Player('venky', 'red');
      const game = new Game(123, player, createBattleField(10, 10));
      const setUpInfo = {
        unit: 'red',
        piecesInfo: [{ position: '2_4', name: 'marshal' }]
      };
      game.arrangeBattleField(setUpInfo);
      assert.isTrue(game.isTargetOnLake([2, 4]));
    });

    it('should return false if target is not on Lake', () => {
      const player = new Player('venky', 'red');
      const game = new Game(123, player, createBattleField(10, 10));
      const setUpInfo = {
        unit: 'red',
        piecesInfo: [{ position: '0_0', name: 'marshal' }]
      };
      game.arrangeBattleField(setUpInfo);
      assert.isFalse(game.isTargetOnLake([1, 4]));
    });
  });

  context('.isOccupied()', () => {
    it('should return true if given position is occupied', () => {
      const player = new Player('venky', 'red');
      const game = new Game(123, player, createBattleField(10, 10));
      const setUpInfo = {
        unit: 'red',
        piecesInfo: [{ position: '0_0', name: 'marshal' }]
      };
      game.arrangeBattleField(setUpInfo);
      assert.isTrue(game.isOccupied([0, 0]));
    });

    it('should return false if given position is not occupied', () => {
      const player = new Player('venky', 'red');
      const game = new Game(123, player, createBattleField(10, 10));
      const setUpInfo = {
        unit: 'red',
        piecesInfo: [{ position: '0_0', name: 'marshal' }]
      };
      game.arrangeBattleField(setUpInfo);
      assert.isFalse(game.isOccupied([0, 1]));
    });
  });

  context('updateBattleField', () => {
    it('should update piece from current position to target position', () => {
      const player = new Player('venky', 'red');
      const game = new Game(123, player, createBattleField(10, 10));
      const setUpInfo = {
        unit: 'red',
        piecesInfo: [{ position: '0_0', name: 'marshal' }]
      };
      game.arrangeBattleField(setUpInfo);
      game.movePiece('red', '0_0', '0_1');
      const updatedPosition = game.updateBattleField('0_0', '0_1');
      assert.deepStrictEqual(updatedPosition, '0_1');
    });
  });

  context('.movePiece()', () => {
    it('should update the position of piece of given player', () => {
      const player = new Player('venky', 'red');
      const game = new Game(123, player, createBattleField(10, 10));
      const setUpInfo = {
        unit: 'red',
        piecesInfo: [{ position: '0_0', name: 'marshal' }]
      };
      game.arrangeBattleField(setUpInfo);
      assert.isTrue(game.movePiece('red', '0_0', '0_1'));
    });

    it('should not update the position of the piece if the given target position is a lake', () => {
      const player = new Player('venky', 'red');
      const game = new Game(123, player, createBattleField(10, 10));
      const setUpInfo = {
        unit: 'red',
        piecesInfo: [{ position: '1_4', name: 'marshal' }]
      };
      game.arrangeBattleField(setUpInfo);
      assert.isFalse(game.movePiece('red', '1_4', '2_4'));
    });

    it('should not update the position of the piece if the given target position is occupied', () => {
      const player = new Player('venky', 'red');
      const game = new Game(123, player, createBattleField(10, 10));
      const setUpInfo = {
        unit: 'red',
        piecesInfo: [
          { position: '1_4', name: 'marshal' },
          { position: '2_4', name: 'scout' }
        ]
      };
      game.arrangeBattleField(setUpInfo);
      assert.isFalse(game.movePiece('red', '1_4', '2_4'));
    });

    it('should not move the piece to diagonal of current position', () => {
      const player = new Player('venky', 'red');
      const game = new Game(123, player, createBattleField(10, 10));
      const setUpInfo = {
        unit: 'red',
        piecesInfo: [{ position: '1_4', name: 'marshal' }]
      };
      game.arrangeBattleField(setUpInfo);
      assert.isFalse(game.movePiece('red', '1_4', '3_4'));
    });

    it('should not move the piece if the piece is immovalble', () => {
      const player = new Player('venky', 'red');
      const game = new Game(123, player, createBattleField(10, 10));
      const setUpInfo = {
        unit: 'red',
        piecesInfo: [{ position: '1_4', name: 'bomb' }]
      };
      game.arrangeBattleField(setUpInfo);
      assert.isFalse(game.movePiece('red', '1_4', '3_4'));
    });

    it('should move the scout to as many tiles vertically and horizontally', () => {
      const player = new Player('venky', 'red');
      const game = new Game(123, player, createBattleField(10, 10));
      const setUpInfo = {
        unit: 'red',
        piecesInfo: [{ position: '1_4', name: 'scout' }]
      };
      game.arrangeBattleField(setUpInfo);
      assert.isTrue(game.movePiece('red', '1_4', '8_4'));
    });
  });
});
