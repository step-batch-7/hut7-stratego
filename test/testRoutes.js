const request = require('supertest');
const { app } = require('../lib/routes');

describe('POST', () => {
  context('/host', function() {
    it('should create game with given player name for /host', function(done) {
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
    it('should give bad request if the player name is not given', function(done) {
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
    it('should respond with bad request if its an invalid move', function(done) {
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
    it('should respond with bad request if its an immovable piece', function(done) {
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
    it('should join game with given player name and gameId for /join', function(done) {
      request(app)
        .post('/join')
        .send('playerName=player&gameId=2')
        .expect(302)
        .end(function(err) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
    it('should give bad request if the player name is not given', function(done) {
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
    it('should give game started if game is already started for /join', function(done) {
      this.timeout(4000);
      request(app)
        .post('/join')
        .send('playerName=player&gameId=2')
        .expect(200)
        .end(function(err) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
    it('should give not exist if game does not exists', function(done) {
      request(app)
        .post('/join')
        .send('playerName=player&gameId=100')
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
        .expect(200)
        .expect(/setup/)
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
        .set('cookie', 'gameId=3')
        .expect(200)
        .expect(/Stratego | Waiting/)
        .end(function(err) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });
  context('/host', function() {
    it('should serve the host page', function(done) {
      request(app)
        .get('/host')
        .expect(200)
        .expect(/Stratego | Host/)
        .end(function(err) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });
  context('/join', function() {
    it('should serve the join page', function(done) {
      request(app)
        .get('/join')
        .expect(200)
        .expect(/Stratego | Join/)
        .end(function(err) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });
  context('/areAllPlayersJoined', function() {
    it('should give false if the game is not full', function(done) {
      request(app)
        .get('/areAllPlayersJoined')
        .set('cookie', 'gameId=6')
        .expect(200)
        .expect('{"playerJoined":false}')
        .end(function(err) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
    it('should give true if the game is full', function(done) {
      request(app)
        .get('/areAllPlayersJoined')
        .set('cookie', 'gameId=2')
        .expect(200)
        .expect('{"playerJoined":true}')
        .end(function(err) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });
});
