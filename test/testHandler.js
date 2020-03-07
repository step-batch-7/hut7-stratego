const request = require('supertest');
const { app } = require('./../lib/routes');

describe('Server', () => {
  context('Middleware', function() {
    context('express static', function() {
      it('should response back with game.html for /game.html', function(done) {
        request(app)
          .get('/game.html')
          .expect(200)
          .expect(/Stratego/)
          .end(function(err) {
            if (err) {
              return done(err);
            }
            done();
          });
      });
    });
  });
});
