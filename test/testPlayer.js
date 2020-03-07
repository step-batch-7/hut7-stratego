const assert = require('chai').assert;
const { Player } = require('./../lib/player');

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
});
