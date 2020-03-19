const assert = require('chai').assert;
const { Player } = require('./../lib/player');

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
      assert.strictEqual(player.addPiece('marshal', [0, 0]), 1);
    });
  });

  context('.movePiece()', function() {
    it('should update position of piece to given position if piece exists', function() {
      const player = new Player('venky', 'red');
      player.addPiece('marshal', [0, 0]);
      assert.isTrue(player.movePiece([0, 0], [0, 1]));
    });

    it('should not update position of piece to given position if piece does not exists', function() {
      const player = new Player('venky', 'red');
      player.addPiece('marshal', [9, 9]);
      assert.isFalse(player.movePiece([0, 0], [0, 1]));
    });

    it('should not update position of piece to given position if piece is immovable', function() {
      const player = new Player('venky', 'red');
      player.addPiece('bomb', [0, 1]);
      assert.isFalse(player.movePiece([0, 1], [0, 2]));
    });
  });

  context('.killPiece()', function() {
    it('should kill the piece of given position', function() {
      const player = new Player('venky', 'red');
      player.addPiece('marshal', [0, 0]);
      assert.isTrue(player.killPiece([0, 0]));
    });
  });
});
