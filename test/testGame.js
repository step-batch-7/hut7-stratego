const assert = require('chai').assert;
const { Game } = require('./../lib/game');
const { Player } = require('./../lib/player');
const { createBattleField } = require('./../lib/games');

describe('Game', function() {
  context('.getStatus()', function() {
    it('should give the status of the game', function() {
      const gameId = 123;
      const player = new Player('venky', 'red');
      const game = new Game(gameId, player, createBattleField(1, 1));
      assert.deepStrictEqual(game.getStatus(), {
        id: 123,
        players: [player],
        battleField: { '0_0': undefined }
      });
    });
  });

  context('.getId', function() {
    it('should return the id of the game', function() {
      const gameId = 123;
      const player = new Player('venky', 'red');
      const game = new Game(gameId, player, createBattleField(1, 1));
      assert.strictEqual(game.getId(), 123);
    });
  });

  context('.addPlayer()', function() {
    it('should add the given player in Game', function() {
      const player1 = new Player('venky', 'red');
      const game = new Game(123, player1, createBattleField(10, 10));
      const player2 = new Player('rajat', 'blue');
      const numberOfPlayers = game.addPlayer(player2);
      assert.strictEqual(numberOfPlayers, 2);
    });
    it('should not add player if its not an instance of Player class ', function() {
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

  context('.getPlayer()', function() {
    it('should give player of given unit', function() {
      const player = new Player('venky', 'red');
      const game = new Game(123, player, createBattleField(10, 10));
      assert.strictEqual(game.getPlayer('red'), player);
    });

    it('should give undefined when player of the given unit does not exists', function() {
      const player = new Player('venky', 'red');
      const game = new Game(123, player, createBattleField(10, 10));
      assert.isUndefined(game.getPlayer('blue'));
    });
  });

  context('.arrangeBattleField()', function() {
    it('should record the position of all components of the board', function() {
      const player = new Player('venky', 'red');
      const game = new Game(123, player, createBattleField(10, 10));
      const setUpInfo = {
        unit: 'red',
        piecesInfo: [{ position: '0_0', name: 'marshal' }]
      };
      assert.isTrue(game.arrangeBattleField(setUpInfo));
    });

    it('should not update the battleField if unit is other than red or blue', function() {
      const player = new Player('venky', 'red');
      const game = new Game(123, player, createBattleField(10, 10));
      const setUpInfo = {
        unit: 'green',
        piecesInfo: [{ position: '0_0', name: 'marshal' }]
      };
      assert.isFalse(game.arrangeBattleField(setUpInfo));
    });

    it('should not update the battleField if piece is not a game component', function() {
      const player = new Player('venky', 'red');
      const game = new Game(123, player, createBattleField(10, 10));
      const setUpInfo = {
        unit: 'red',
        piecesInfo: [{ position: '0_0', name: 'cannon' }]
      };
      assert.isFalse(game.arrangeBattleField(setUpInfo));
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

    it('should return false if given position is not occupied', function() {
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

  context('updateBattleField', function() {
    it('should update piece from current position to target position', function() {
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

  context('.movePiece()', function() {
    it('should update the position of piece of given player', function() {
      const player = new Player('venky', 'red');
      const game = new Game(123, player, createBattleField(10, 10));
      const setUpInfo = {
        unit: 'red',
        piecesInfo: [{ position: '0_0', name: 'marshal' }]
      };
      game.arrangeBattleField(setUpInfo);
      assert.isTrue(game.movePiece('red', '0_0', '0_1'));
    });

    it('should not update the position of the piece if the given target position is a lake', function() {
      const player = new Player('venky', 'red');
      const game = new Game(123, player, createBattleField(10, 10));
      const setUpInfo = {
        unit: 'red',
        piecesInfo: [{ position: '1_4', name: 'marshal' }]
      };
      game.arrangeBattleField(setUpInfo);
      assert.isFalse(game.movePiece('red', '1_4', '2_4'));
    });

    it('should not update the position of the piece if the given target position is occupied', function() {
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

    it('should not move the piece to diagonal of current position', function() {
      const player = new Player('venky', 'red');
      const game = new Game(123, player, createBattleField(10, 10));
      const setUpInfo = {
        unit: 'red',
        piecesInfo: [{ position: '1_4', name: 'marshal' }]
      };
      game.arrangeBattleField(setUpInfo);
      assert.isFalse(game.movePiece('red', '1_4', '3_4'));
    });

    it('should not move the piece if the piece is immovalble', function() {
      const player = new Player('venky', 'red');
      const game = new Game(123, player, createBattleField(10, 10));
      const setUpInfo = {
        unit: 'red',
        piecesInfo: [{ position: '1_4', name: 'bomb' }]
      };
      game.arrangeBattleField(setUpInfo);
      assert.isFalse(game.movePiece('red', '1_4', '3_4'));
    });

    it('should move the scout to as many tiles vertically and horizontally', function() {
      const player = new Player('venky', 'red');
      const game = new Game(123, player, createBattleField(10, 10));
      const setUpInfo = {
        unit: 'red',
        piecesInfo: [{ position: '1_4', name: 'scout' }]
      };
      game.arrangeBattleField(setUpInfo);
      assert.isTrue(game.movePiece('red', '1_4', '1_8'));
    });

    it('should not move the scout to as many tiles vertically and horizontally if lake comes in-between', function() {
      const player = new Player('venky', 'red');
      const game = new Game(123, player, createBattleField(10, 10));
      const setUpInfo = {
        unit: 'red',
        piecesInfo: [{ position: '1_4', name: 'scout' }]
      };
      game.arrangeBattleField(setUpInfo);
      assert.isFalse(game.movePiece('red', '1_4', '8_4'));
    });

    it('should not move the scout to as many tiles vertically and horizontally if other piece comes in-between', function() {
      const player = new Player('venky', 'red');
      const game = new Game(123, player, createBattleField(10, 10));
      const setUpInfo = {
        unit: 'red',
        piecesInfo: [
          { position: '2_3', name: 'scout' },
          { position: '4_3', name: 'marshal' }
        ]
      };
      game.arrangeBattleField(setUpInfo);
      assert.isFalse(game.movePiece('red', '2_3', '7_3'));
    });

    it('should not move scout diagonaly', function() {
      const player = new Player('venky', 'red');
      const game = new Game(123, player, createBattleField(10, 10));
      const setUpInfo = {
        unit: 'red',
        piecesInfo: [{ position: '2_3', name: 'scout' }]
      };
      game.arrangeBattleField(setUpInfo);
      assert.isFalse(game.movePiece('red', '2_3', '3_2'));
    });
  });
});
