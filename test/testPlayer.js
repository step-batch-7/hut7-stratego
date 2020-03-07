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
    it('should add given piece in player army', () => {
      const player = new Player('venky', 'red');
      const piece = {
        name: 'scout',
        position: [9, 9]
      };
      assert.strictEqual(player.addPiece(piece), 0);
    });
  });
});
