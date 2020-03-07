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

  context('get', function() {
    context('/gameId', function() {
      it('should response back with gameId for /gameId', function(done) {
        request(app)
          .get('/gameId')
          .expect(200)
          .end(function(err) {
            if (err) {
              return done(err);
            }
            done();
          });
      });
    });
  });

  context('post', function() {
    context('/hostGame', function() {
      it('should create game with given player name for /hostGame', done => {
        request(app)
          .post('/hostGame')
          .expect(200)
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
