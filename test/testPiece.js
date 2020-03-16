const assert = require('chai').assert;
const { Piece, StablePiece } = require('./../lib/piece');

describe('Piece', function() {
  context('.getStatus()', function() {
    it('should give the status of the piece', function() {
      const piece = new Piece('marshal', [0, 0]);
      assert.deepStrictEqual(piece.getStatus(), {
        name: 'marshal',
        position: [0, 0],
        rank: 10
      });
    });
  });

  context('.move()', function() {
    it('should update the position of given piece', function() {
      const piece = new Piece('marshal', [0, 0]);
      const currentPosition = piece.move([9, 0]);
      assert.deepStrictEqual(currentPosition, [9, 0]);
    });
  });

  context('.getAttackStatus()', function() {
    it('should return won when the mainer attacks the bomb', function() {
      const piece = new StablePiece('bomb', [0, 0]);
      const actual = piece.getAttackStatus('miner');
      assert.strictEqual(actual, 'won');
    });
    it('should return lost when the mainer attacks the flag', function() {
      const piece = new StablePiece('flag', [0, 0]);
      const actual = piece.getAttackStatus('miner');
      assert.strictEqual(actual, 'lost');
    });
  });
});
