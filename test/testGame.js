const assert = require('chai').assert;
const { Game } = require('./../lib/game');
const { Player } = require('./../lib/player');

describe('Game', function() {
  context('.getStatus()', function() {
    it('should give the status of the game', function() {
      const gameId = 123;
      const player = new Player('venky', 'red');
      const game = new Game(gameId, player);
      game.initBattleField(1, 1);
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
      const game = new Game(gameId, player);
      game.initBattleField();
      assert.strictEqual(game.getId(), 123);
    });
  });

  context('.addPlayer', function() {
    it('should add the given player in Game', function() {
      const player1 = new Player('venky', 'red');
      const game = new Game(123, player1);
      game.initBattleField();
      const player2 = new Player('rajat', 'blue');
      const numberOfPlayers = game.addPlayer(player2);
      assert.strictEqual(numberOfPlayers, 2);
    });
    it('should not add player if its not an instance of Player class ', function() {
      const player1 = new Player('venky', 'red');
      const game = new Game(123, player1);
      game.initBattleField();
      const player2 = {
        name: 'venky',
        unit: 'red'
      };
      const numberOfPlayers = game.addPlayer(player2);
      assert.strictEqual(numberOfPlayers, 1);
    });
  });

  context('.getPlayer', function() {
    it('should give player of given unit', function() {
      const player = new Player('venky', 'red');
      const game = new Game(123, player);
      game.initBattleField();
      assert.strictEqual(game.getPlayer('red'), player);
    });

    it('should give undefined when player of the given unit does not exists', function() {
      const player = new Player('venky', 'red');
      const game = new Game(123, player);
      game.initBattleField();
      assert.isUndefined(game.getPlayer('blue'));
    });
  });

  context('.arrangeBattleField', function() {
    let game, unit, setUpInfo;
    this.beforeEach(function() {
      const player = new Player('venky', 'red');
      game = new Game(123, player);
      game.initBattleField();
      unit = 'red';
      setUpInfo = [
        { position: '0_0', name: 'marshal' },
        { position: '1_0', name: 'bomb' },
        { position: '2_0', name: 'bomb' },
        { position: '3_0', name: 'miner' },
        { position: '4_0', name: 'miner' },
        { position: '5_0', name: 'scout' },
        { position: '6_0', name: 'scout' },
        { position: '7_0', name: 'flag' },
        { position: '8_0', name: 'general' },
        { position: '9_0', name: 'spy' }
      ];
    });

    it('should record the position of all components of the board', function() {
      assert.isTrue(game.arrangeBattleField(unit, setUpInfo));
    });

    it('should not update the battleField if unit is other than red or blue', function() {
      unit = 'green';
      assert.isFalse(game.arrangeBattleField(unit, setUpInfo));
    });

    it('should not update the battleField if piece is not a game component', function() {
      setUpInfo[0].name = 'cannon';
      assert.isFalse(game.arrangeBattleField(unit, setUpInfo));
    });

    it('should not update the battlefield if enough pieces are not given', function() {
      setUpInfo.splice(0, 1);
      assert.isFalse(game.arrangeBattleField(unit, setUpInfo));
    });
  });

  context('.updateBattleField', function() {
    it('should update piece from current position to target position', function() {
      const player = new Player('venky', 'red');
      const game = new Game(123, player);
      game.initBattleField();
      const setUpInfo = {
        unit: 'red',
        piecesInfo: [{ position: '0_0', name: 'marshal' }]
      };
      game.arrangeBattleField(setUpInfo);
      game.movePiece('red', [0, 0], [0, 1]);
      const updatedPosition = game.updateBattleField([0, 0], [0, 1]);
      assert.deepStrictEqual(updatedPosition, '0_1');
    });
  });

  context('.movePiece', function() {
    let game;
    this.beforeEach(function() {
      const player = new Player('venky', 'red');
      const player2 = new Player('rajat', 'blue');
      game = new Game(123, player);
      game.initBattleField();
      game.addPlayer(player2);
      const setUpInfo1 = [
        { position: '9_0', name: 'flag' },
        { position: '1_0', name: 'bomb' },
        { position: '4_0', name: 'bomb' },
        { position: '6_0', name: 'general' },
        { position: '0_0', name: 'marshal' },
        { position: '2_3', name: 'miner' },
        { position: '5_0', name: 'miner' },
        { position: '3_0', name: 'scout' },
        { position: '8_0', name: 'scout' },
        { position: '7_0', name: 'spy' }
      ];
      game.arrangeBattleField('red', setUpInfo1);
      const setUpInfo2 = [
        { position: '7_6', name: 'flag' },
        { position: '1_6', name: 'bomb' },
        { position: '2_6', name: 'bomb' },
        { position: '2_7', name: 'marshal' },
        { position: '7_7', name: 'general' },
        { position: '0_6', name: 'miner' },
        { position: '4_6', name: 'miner' },
        { position: '5_6', name: 'scout' },
        { position: '6_6', name: 'scout' },
        { position: '9_6', name: 'spy' }
      ];
      game.arrangeBattleField('blue', setUpInfo2);
    });

    it('should update the position of piece of given player', function() {
      assert.isTrue(game.movePiece('red', [0, 0], [0, 1]));
    });

    it('should not update the position of the piece if the given target position is a lake', function() {
      assert.isFalse(game.movePiece('red', [2, 3], [2, 4]));
    });

    it('should not update the position of the piece if the given target position is occupied', function() {
      assert.isFalse(game.movePiece('red', [8, 0], [9, 0]));
    });

    it('should not move the piece to diagonal of current position', function() {
      assert.isFalse(game.movePiece('red', [8, 0], [9, 1]));
    });

    it('should not move the piece if the piece is non-movable', function() {
      assert.isFalse(game.movePiece('red', [1, 0], [2, 0]));
    });

    it('should move the scout to as many tiles vertically and horizontally', function() {
      assert.isTrue(game.movePiece('red', [8, 0], [8, 9]));
    });

    it('should not move the scout to as many tiles vertically and horizontally if lake comes in-between', function() {
      assert.isFalse(game.movePiece('red', [3, 0], [3, 9]));
    });

    it('should not move the scout to as many tiles vertically and horizontally if other piece comes in-between', function() {
      game.movePiece('red', [8, 0], [8, 7]);
      assert.isFalse(game.movePiece('red', [8, 7], [5, 7]));
    });

    it('should not move scout diagonally', function() {
      assert.isFalse(game.movePiece('red', [3, 0], [6, 3]));
    });
  });

  context('.attack', function() {
    let game;
    this.beforeEach(function() {
      const player = new Player('venky', 'red');
      const player2 = new Player('rajat', 'blue');
      game = new Game(123, player);
      game.initBattleField();
      game.addPlayer(player2);
      const setUpInfo1 = [
        { position: '0_0', name: 'marshal' },
        { position: '0_1', name: 'bomb' },
        { position: '0_2', name: 'bomb' },
        { position: '0_3', name: 'miner' },
        { position: '0_4', name: 'miner' },
        { position: '0_5', name: 'scout' },
        { position: '0_6', name: 'scout' },
        { position: '0_7', name: 'flag' },
        { position: '0_8', name: 'general' },
        { position: '0_9', name: 'spy' }
      ];
      game.arrangeBattleField('red', setUpInfo1);
      const setUpInfo2 = [
        { position: '1_0', name: 'miner' },
        { position: '1_1', name: 'bomb' },
        { position: '1_2', name: 'bomb' },
        { position: '1_3', name: 'marshal' },
        { position: '1_4', name: 'miner' },
        { position: '1_5', name: 'scout' },
        { position: '1_6', name: 'scout' },
        { position: '1_7', name: 'flag' },
        { position: '1_8', name: 'general' },
        { position: '1_9', name: 'spy' }
      ];
      game.arrangeBattleField('blue', setUpInfo2);
    });

    it('should return attack status won if defenders rank is less than attackers rank', function() {
      assert.strictEqual(game.attack('red', [0, 0], [1, 0]), 'won');
    });

    it('should return attack status lost if defenders rank is more than attackers rank', function() {
      assert.strictEqual(game.attack('red', [0, 3], [1, 3]), 'lost');
    });

    it('should return attack status draw if defenders rank is equal to attackers rank', function() {
      assert.strictEqual(game.attack('red', [0, 5], [1, 5]), 'draw');
    });

    it('should return attack status unsuccessful if attack positions is invalid', function() {
      assert.strictEqual(game.attack('red', [2, 3], [2, 4]), 'unsuccessful');
    });
  });
});
