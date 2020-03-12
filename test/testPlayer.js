const assert = require('chai').assert;
const { Player } = require('./../lib/player');
const { Piece } = require('./../lib/piece');

describe('Player', function() {
  context('.getStatus()', function() {
    it('should give the status of the player', function() {
      const player = new Player('venky', 'red');
      assert.deepStrictEqual(player.getStatus(), {
        name: 'venky',
        unit: 'red',
        army: []
      });
    });
  });

  context('.addPiece()', function() {
    it('should add given piece in player army', function() {
      const player = new Player('venky', 'red');
      const piece = new Piece('marshal', [0, 0], true);
      assert.strictEqual(player.addPiece(piece), 1);
    });
    it('should not add given piece in player army if piece is not an instance of Piece class', function() {
      const player = new Player('venky', 'red');
      const piece = {
        name: 'scout',
        position: [9, 9]
      };
      assert.strictEqual(player.addPiece(piece), 0);
    });
  });
  context('.movePiece()', function() {
    it('should update position of piece to given position if piece exists', function() {
      const player = new Player('venky', 'red');
      const piece = new Piece('marshal', [0, 0], true);
      player.addPiece(piece);
      assert.isTrue(player.movePiece([0, 0], [0, 1]));
    });
    it('should not update position of piece to given position if piece does not exists', function() {
      const player = new Player('venky', 'red');
      const piece = new Piece('marshal', [9, 9], true);
      player.addPiece(piece);
      assert.isFalse(player.movePiece([0, 0], [0, 1]));
    });
    it('should not update position of piece to given position if piece is immovable', function() {
      const player = new Player('venky', 'red');
      const piece = new Piece('bomb', [0, 1], false);
      player.addPiece(piece);
      assert.isFalse(player.movePiece([0, 1], [0, 2]));
    });
  });
  context('.killPiece()', function() {
    it('should kill the piece of given position', function() {
      const player = new Player('venky', 'red');
      const piece = new Piece('marshal', [0, 0], true);
      player.addPiece(piece);
      assert.isTrue(player.killPiece([0, 0]));
    });
  });
});
