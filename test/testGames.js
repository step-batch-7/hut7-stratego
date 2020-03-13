const assert = require('chai').assert;
const { createGames } = require('../lib/games');
const { Game } = require('../lib/game');
const { Player } = require('./../lib/player');

describe('Games', function() {
  context('.addGame()', function() {
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

  context('.getGame()', function() {
    it('should return the game of given gameId', function() {
      const games = createGames();
      const gameId = games.createNewGame('stratego');
      const game = games.getGame(gameId);
      assert.isTrue(game instanceof Game);
    });
  });

  context('.createNewGame()', function() {
    it('should give game id of the new game', function() {
      const games = createGames();
      assert.strictEqual(games.createNewGame('player'), 1);
    });
  });

  context('.addPlayerInGame()', function() {
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

  context('.isGameFull()', function() {
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

  context('.getArmy()', function() {
    it('should return the army of a player', () => {
      const games = createGames();
      const gameId = games.createNewGame('venky');
      games.addPlayerInGame(gameId, 'venky');
      const dummySetupData = {
        unit: 'blue',
        piecesInfo: [{ position: '9_9', name: 'flag' }]
      };
      games.arrangeBattleField(gameId, dummySetupData);
      const expected = {
        redArmy: [],
        blueArmy: [
          {
            name: 'flag',
            position: [9, 9]
          }
        ]
      };
      assert.deepStrictEqual(games.getArmy(gameId, 'blue'), expected);
    });

    it('should return the army of a player', () => {
      const games = createGames();
      const gameId = games.createNewGame('venky');
      games.addPlayerInGame(gameId, 'venky');
      const dummySetupData = {
        unit: 'red',
        piecesInfo: [{ position: '9_9', name: 'flag' }]
      };
      games.arrangeBattleField(gameId, dummySetupData);
      const expected = {
        redArmy: [
          {
            name: 'flag',
            position: [9, 9]
          }
        ],
        blueArmy: []
      };
      assert.deepStrictEqual(games.getArmy(gameId, 'red'), expected);
    });
  });

  context('.movePiece()', function() {
    const games = createGames();
    const gameId = games.createNewGame('venky');
    this.beforeEach(() => {
      games.addPlayerInGame(gameId, 'venky');
      const dummySetupData = {
        unit: 'blue',
        piecesInfo: [
          { position: '9_9', name: 'flag' },
          { position: '0_0', name: 'marshal' }
        ]
      };
      games.arrangeBattleField(gameId, dummySetupData);
    });

    it('should move the piece to the given target Position', () => {
      assert.isTrue(games.movePiece(gameId, 'blue', '0_0', '0_1'));
    });

    it('should not move the piece to the given target Position when move is invalid', () => {
      assert.isFalse(games.movePiece(gameId, 'blue', '0_0', '0_9'));
    });

    it('should move the piece to the given target Position when piece is immovable', () => {
      assert.isFalse(games.movePiece(gameId, 'blue', '9_9', '8_9'));
    });
  });

  context('.isSetupDone()', function() {
    it('should give true if setup is done', function() {
      const games = createGames();
      const gameId = games.createNewGame('venky');
      assert.isFalse(games.isSetupDone(gameId));
    });

    it('should give true if setup is done', function() {
      const games = createGames();
      const gameId = games.createNewGame('venky');
      games.addPlayerInGame(gameId, 'player');
      assert.isTrue(games.isSetupDone(gameId));
    });
  });

  context('.attack()', function() {
    const games = createGames();
    const gameId = games.createNewGame('venky');
    this.beforeEach(() => {
      games.addPlayerInGame(gameId, 'venky');
      const dummySetupData1 = {
        unit: 'red',
        piecesInfo: [
          { position: '0_0', name: 'flag' },
          { position: '1_2', name: 'marshal' }
        ]
      };
      const dummySetupData2 = {
        unit: 'blue',
        piecesInfo: [
          { position: '2_2', name: 'flag' },
          { position: '9_8', name: 'marshal' },
          { position: '0_2', name: 'flag' }
        ]
      };
      games.arrangeBattleField(gameId, dummySetupData1);
      games.arrangeBattleField(gameId, dummySetupData2);
    });

    it('should return attack status won if defenders rank is less than attackers rank', () => {
      assert.strictEqual(games.attack(gameId, '1_2', '2_2', 'red'), 'won');
    });

    it('should return attack status lost if defenders rank is greater than attackers rank', () => {
      assert.strictEqual(games.attack(gameId, '1_2', '0_2', 'red'), 'won');
    });
  });
});
