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
    it('should give bad request if the player name is not given', done => {
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
  context('/movePiece', function() {
    it('should respond with new position if its a valid move', function(done) {
      request(app)
        .post('/movePiece')
        .send({ sourceTileId: '0_1', targetTileId: '0_2' })
        .expect(200)
        .expect(/sourceTileId/)
        .end(function(err) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
    it('should respond with current position if its an invalid move', done => {
      request(app)
        .post('/movePiece')
        .send({ sourceTileId: '0_1', targetTileId: '0_9' })
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
