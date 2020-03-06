const assert = require('chai').assert;
const { Piece } = require('./../lib/piece');

describe('Piece', () => {
  it('should give the status of the piece', () => {
    const piece = new Piece('marshal', [0, 0]);
    assert.deepStrictEqual(piece.getStatus(), {
      name: 'marshal',
      position: [0, 0]
    });
  });

  it('should update the position of given piece', () => {
    const piece = new Piece('marshal', [0, 0]);
    const currentPosition = piece.move([9, 0]);
    assert.deepStrictEqual(currentPosition, [9, 0]);
  });
});
