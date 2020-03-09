const assert = require('chai').assert;
const { Player } = require('./../lib/player');
const { Piece } = require('./../lib/piece');

describe('Player', () => {
  context('.getStatus()', function() {
    it('should give the status of the player', () => {
      const player = new Player('venky', 'red');
      assert.deepStrictEqual(player.getStatus(), {
        name: 'venky',
        unit: 'red',
        army: []
      });
    });
  });

  context('.addPiece()', function() {
    it('should add given piece in player army', () => {
      const player = new Player('venky', 'red');
      const piece = new Piece('marshal', [0, 0]);
      assert.strictEqual(player.addPiece(piece), 1);
    });
    it('should not add given piece in player army if piece is not an instance of Piece class', () => {
      const player = new Player('venky', 'red');
      const piece = {
        name: 'scout',
        position: [9, 9]
      };
      assert.strictEqual(player.addPiece(piece), 0);
    });
  });
  context('.movePiece()', function() {
    it('should update position of piece to given position if piece exists', () => {
      const player = new Player('venky', 'red');
      const piece = new Piece('marshal', [0, 0]);
      player.addPiece(piece);
      const currentPosition = player.movePiece([0, 0], [0, 7]);
      const expected = {
        done: true,
        sourceTileId: [0, 0],
        targetTileId: [0, 7]
      };
      assert.deepStrictEqual(currentPosition, expected);
    });
    it('should not update position of piece to given position if piece does not exists', () => {
      const player = new Player('venky', 'red');
      const piece = new Piece('marshal', [9, 9]);
      player.addPiece(piece);
      const currentPosition = player.movePiece([0, 0], [0, 7]);
      const expected = {
        done: false
      };
      assert.deepStrictEqual(currentPosition, expected);
    });
  });
});
