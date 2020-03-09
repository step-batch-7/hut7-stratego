const request = require('supertest');
const { app } = require('../lib/routes');

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
        .send({ sourceTileId: '2_0', targetTileId: '3_0' })
        .expect(200)
        .expect(/sourceTileId/)
        .end(function(err) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
    it('should respond with bad request if its an invalid move', done => {
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
    it('should respond with bad request if its an immovable piece', done => {
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
  context('/join', function() {
    it('should join game with given player name and gameId for /join', done => {
      request(app)
        .post('/join')
        .send('playerName=player&gameId=1')
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
    it('should give game started if game is already started for /join', done => {
      request(app)
        .post('/join')
        .send('playerName=player&gameId=1')
        .expect(/game is already started/)
        .end(function(err) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });
});

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
  context('/setup', function() {
    it('should send to index page if cookies are not set', function(done) {
      request(app)
        .get('/setup')
        .expect(302)
        .expect(/\//)
        .end(function(err) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
    it('should send to setup if game is full', function(done) {
      request(app)
        .get('/setup')
        .set('cookie', 'gameId=1')
        .expect(302)
        .expect(/setup.html/)
        .end(function(err) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
    it('should send to waiting if game is not full', function(done) {
      request(app)
        .get('/setup')
        .set('cookie', 'gameId=2')
        .expect(302)
        .expect(/waiting.html/)
        .end(function(err) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });
});
