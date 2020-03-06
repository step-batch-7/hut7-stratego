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
});
