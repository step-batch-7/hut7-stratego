const assert = require('chai').assert;
const { Piece } = require('./../lib/piece');

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
    it('should return won when the spy attacks the marshal', function() {
      const piece = new Piece('spy', [0, 0]);
      const actual = piece.getAttackStatus('marshal');
      assert.deepStrictEqual(actual, 'won');
    });
    it('should return won when the miner attacks the bomb', function() {
      const piece = new Piece('miner', [0, 0]);
      const actual = piece.getAttackStatus('bomb');
      assert.deepStrictEqual(actual, 'won');
    });
  });
});
