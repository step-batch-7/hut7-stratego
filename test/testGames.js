const assert = require('chai').assert;
const { Games, createBattleField } = require('../lib/games');
const { Game } = require('../lib/game');
const { Player } = require('./../lib/player');

describe('Games', () => {
  context('.addGame()', () => {
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

  context('.getGame()', () => {
    it('should return the game of given gameId', () => {
      const games = new Games();
      const gameId = games.createNewGame('stratego');
      const game = games.getGame(gameId);
      assert.isTrue(game instanceof Game);
    });
  });

  context('.createNewGame()', () => {
    it('should give game id of the new game', () => {
      const games = new Games();
      assert.strictEqual(games.createNewGame('player'), 1);
    });
  });

  context('.addPlayerInGame()', () => {
    it('should add player in the existing game', () => {
      const games = new Games();
      const gameId = games.createNewGame('player');
      assert.strictEqual(games.addPlayerInGame(gameId, 'player1'), true);
    });
    it('should not add player in the non existing game', () => {
      const games = new Games();
      games.createNewGame('player');
      assert.strictEqual(games.addPlayerInGame(500, 'player1'), false);
    });
  });

  context('.isGameFull()', () => {
    it('should send true if game is full', () => {
      const games = new Games();
      const gameId = games.createNewGame('player');
      games.addPlayerInGame(gameId, 'player1');
      assert.strictEqual(games.isGameFull(gameId), true);
    });
    it('should send false if game is not full', () => {
      const games = new Games();
      const gameId = games.createNewGame('player');
      assert.strictEqual(games.isGameFull(gameId), false);
    });
    it('should give undefined if game is not existed', () => {
      const games = new Games();
      assert.strictEqual(games.isGameFull(10), undefined);
    });
  });
});
