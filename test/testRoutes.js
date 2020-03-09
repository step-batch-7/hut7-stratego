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
});

describe('POST', () => {
  context('/host', function() {
    it('should create game with given player name for /host', done => {
      request(app)
        .post('/host')
        .send('playerName=player')
        .expect(302)
        .end(function(err) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });
<<<<<<< HEAD

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
=======
  context('/host', function() {
    it('should give bad request if the player name is not given', done => {
>>>>>>> |#13|Apurva/Sravani|Modified hostpage.
      request(app)
        .post('/host')
        .send('name=player')
        .expect(400)
        .end(function(err) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });
});
