const request = require('supertest');
const { app } = require('../lib/routes');

describe('GET', () => {
  context('/game.html', function() {
    it('should response back with game.html', function(done) {
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

  context('/army', function() {
    it('should response back with piecesInfo', function(done) {
      request(app)
        .get('/army')
        .expect(200)
        .expect(/position/)
        .end(function(err) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });
});

describe('POST', () => {
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
