const assert = require('chai').assert;
const { createGames } = require('../lib/games');
const { Game } = require('../lib/game');
const { Player } = require('./../lib/player');

describe('Games', function() {
  context('.addGame', function() {
    it('should add new game into games', function() {
      const gameId = 123;
      const player = new Player('venky', 'red');
      const game = new Game(gameId, player);
      game.initBattleField();
      const games = createGames();
      assert.strictEqual(games.addGame(game), 1);
    });

    it('should not add new game if its not instance of the game class', function() {
      const games = createGames();
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

  context('.getGame', function() {
    it('should return the game of given gameId', function() {
      const games = createGames();
      const gameId = games.createNewGame('stratego');
      const game = games.getGame(gameId);
      assert.isTrue(game instanceof Game);
    });
  });

  context('.createNewGame', function() {
    it('should give game id of the new game', function() {
      const games = createGames();
      assert.strictEqual(games.createNewGame('player'), 1);
    });
  });

  context('.addPlayerInGame', function() {
    it('should add player in the existing game', function() {
      const games = createGames();
      const gameId = games.createNewGame('player');
      assert.strictEqual(games.addPlayerInGame(gameId, 'player1'), true);
    });

    it('should not add player in the non existing game', function() {
      const games = createGames();
      games.createNewGame('player');
      assert.strictEqual(games.addPlayerInGame(500, 'player1'), false);
    });
  });

  context('.isGameFull', function() {
    it('should send true if game is full', function() {
      const games = createGames();
      const gameId = games.createNewGame('player');
      games.addPlayerInGame(gameId, 'player1');
      assert.strictEqual(games.isGameFull(gameId), true);
    });

    it('should send false if game is not full', function() {
      const games = createGames();
      const gameId = games.createNewGame('player');
      assert.strictEqual(games.isGameFull(gameId), false);
    });

    it('should give undefined if game is not existed', function() {
      const games = createGames();
      assert.strictEqual(games.isGameFull(10), undefined);
    });
  });

  context('.getArmy', function() {
    let games, gameId;
    this.beforeEach(function() {
      games = createGames();
      gameId = games.createNewGame('venky');
      games.addPlayerInGame(gameId, 'rajat');
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
      games.arrangeBattleField(gameId, 'red', setUpInfo1);
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
      games.arrangeBattleField(gameId, 'blue', setUpInfo2);
    });

    it('should return the army of the red player', function() {
      const expected = {
        redArmy: [
          { position: [9, 0], name: 'flag' },
          { position: [1, 0], name: 'bomb' },
          { position: [4, 0], name: 'bomb' },
          { position: [6, 0], name: 'general' },
          { position: [0, 0], name: 'marshal' },
          { position: [2, 3], name: 'miner' },
          { position: [5, 0], name: 'miner' },
          { position: [3, 0], name: 'scout' },
          { position: [8, 0], name: 'scout' },
          { position: [7, 0], name: 'spy' }
        ],
        blueArmy: [
          { position: [7, 6], name: 'flag' },
          { position: [1, 6], name: 'bomb' },
          { position: [2, 6], name: 'bomb' },
          { position: [2, 7], name: 'marshal' },
          { position: [7, 7], name: 'general' },
          { position: [0, 6], name: 'miner' },
          { position: [4, 6], name: 'miner' },
          { position: [5, 6], name: 'scout' },
          { position: [6, 6], name: 'scout' },
          { position: [9, 6], name: 'spy' }
        ]
      };
      assert.deepStrictEqual(games.getArmy(gameId, 'blue'), expected);
    });

    it('should return the army of the blue player', function() {
      const expected = {
        redArmy: [
          { position: [9, 0], name: 'flag' },
          { position: [1, 0], name: 'bomb' },
          { position: [4, 0], name: 'bomb' },
          { position: [6, 0], name: 'general' },
          { position: [0, 0], name: 'marshal' },
          { position: [2, 3], name: 'miner' },
          { position: [5, 0], name: 'miner' },
          { position: [3, 0], name: 'scout' },
          { position: [8, 0], name: 'scout' },
          { position: [7, 0], name: 'spy' }
        ],
        blueArmy: [
          { position: [7, 6], name: 'flag' },
          { position: [1, 6], name: 'bomb' },
          { position: [2, 6], name: 'bomb' },
          { position: [2, 7], name: 'marshal' },
          { position: [7, 7], name: 'general' },
          { position: [0, 6], name: 'miner' },
          { position: [4, 6], name: 'miner' },
          { position: [5, 6], name: 'scout' },
          { position: [6, 6], name: 'scout' },
          { position: [9, 6], name: 'spy' }
        ]
      };
      assert.deepStrictEqual(games.getArmy(gameId, 'red'), expected);
    });
  });

  context('.movePiece', function() {
    let games, gameId;
    this.beforeEach(function() {
      games = createGames();
      gameId = games.createNewGame('venky');
      games.addPlayerInGame(gameId, 'rajat');
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
      games.arrangeBattleField(gameId, 'red', setUpInfo1);
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
      games.arrangeBattleField(gameId, 'blue', setUpInfo2);
    });

    it('should not move the piece when the game is not available', function() {
      assert.isFalse(games.movePiece(gameId + 3, 'blue', [0, 0], [0, 1]));
    });

    it('should move the piece to the given target Position', function() {
      assert.isTrue(games.movePiece(gameId, 'blue', [6, 6], [6, 7]));
    });

    it('should not move the piece to the given target Position when move is invalid', function() {
      assert.isFalse(games.movePiece(gameId, 'blue', [0, 6], [0, 9]));
    });

    it('should move the piece to the given target Position when piece is immovable', function() {
      assert.isFalse(games.movePiece(gameId, 'blue', [2, 6], [3, 6]));
    });
  });

  context('.isSetupDone', function() {
    let games, gameId;
    this.beforeEach(function() {
      games = createGames();
      gameId = games.createNewGame('venky');
      games.addPlayerInGame(gameId, 'rajat');
    });

    it('should give false if setup is not ', function() {
      assert.isFalse(games.isSetupDone(gameId));
    });

    it('should give true if setup is ', function() {
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
      games.arrangeBattleField(gameId, 'red', setUpInfo1);
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
      games.arrangeBattleField(gameId, 'blue', setUpInfo2);
      assert.isTrue(games.isSetupDone(gameId));
    });
  });

  context('.attack', function() {
    let games, gameId;
    this.beforeEach(function() {
      games = createGames();
      gameId = games.createNewGame('venky');
      games.addPlayerInGame(gameId, 'rajat');
      const setUpInfo1 = [
        { position: '9_0', name: 'flag' },
        { position: '1_0', name: 'bomb' },
        { position: '4_0', name: 'bomb' },
        { position: '6_0', name: 'general' },
        { position: '0_0', name: 'marshal' },
        { position: '3_7', name: 'miner' },
        { position: '5_0', name: 'miner' },
        { position: '3_0', name: 'scout' },
        { position: '8_0', name: 'scout' },
        { position: '7_0', name: 'spy' }
      ];
      games.arrangeBattleField(gameId, 'red', setUpInfo1);
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
      games.arrangeBattleField(gameId, 'blue', setUpInfo2);
      assert.isTrue(games.isSetupDone(gameId));
    });

    it('should return attack status won if defenders rank is less than attackers rank', function() {
      assert.strictEqual(games.attack(gameId, 'blue', [2, 7], [3, 7]), 'won');
    });

    it('should return attack status lost if defenders rank is greater than attackers rank', function() {
      assert.strictEqual(games.attack(gameId, 'red', [3, 7], [2, 7]), 'lost');
    });

    it('should reply with unsuccessful status when gameId is wrong', function() {
      assert.strictEqual(
        games.attack(gameId + 3, 'red', [3, 7], [2, 7]),
        'unsuccessful'
      );
    });
  });
});
