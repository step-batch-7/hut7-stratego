const assert = require('chai').assert;
const { Piece } = require('./../lib/piece');

describe('Piece', function() {
  context('.getStatus()', function() {
    it('should give the status of the piece', function() {
      const piece = new Piece('marshal', [0, 0], true);
      assert.deepStrictEqual(piece.getStatus(), {
        name: 'marshal',
        position: [0, 0],
        rank: 10
      });
    });
  });

  context('.move()', function() {
    it('should update the position of given piece', function() {
      const piece = new Piece('marshal', [0, 0], true);
      const currentPosition = piece.move([9, 0]);
      assert.deepStrictEqual(currentPosition, [9, 0]);
    });
  });

  context('.isMovable()', function() {
    it('should return true when the piece is movable', function() {
      const piece = new Piece('marshal', [0, 0], true);
      const isMovable = piece.isMovable();
      assert.isTrue(isMovable);
    });
    it('should return false when the piece is not movable', function() {
      const piece = new Piece('bomb', [0, 0], false);
      const isMovable = piece.isMovable();
      assert.isFalse(isMovable);
    });
  });
});
