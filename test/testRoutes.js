const request = require('supertest');
const { app } = require('../lib/routes');
const { games } = require('../lib/games');
const { replace, restore, stub } = require('sinon');

describe('GET', () => {
  afterEach(() => {
    restore();
  });
  context('/game', function() {
    it('should response back with game', function(done) {
      request(app)
        .get('/game')
        .set('cookie', ['gameId=1', 'unit=red'])
        .expect(200)
        .expect(/Stratego/)
        .end(function(err) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should redirect to /setup when game is not full', function(done) {
      const isSetupDone = stub()
        .withArgs(1)
        .returns(false);
      replace(games, 'isSetupDone', isSetupDone);
      request(app)
        .get('/game')
        .set('cookie', ['gameId=1', 'unit=red'])
        .expect(302)
        .expect(/setup/)
        .end(function(err) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should redirect to /', function(done) {
      request(app)
        .get('/game')
        .expect(302)
        .expect(/\//)
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
      const getGame = stub()
        .withArgs(1)
        .returns(false);
      replace(games, 'getGame', getGame);
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
      const isGameFull = stub()
        .withArgs(1)
        .returns(true);
      const getGame = stub()
        .withArgs(1)
        .returns(true);
      replace(games, 'isGameFull', isGameFull);
      replace(games, 'getGame', getGame);
      request(app)
        .get('/setup')
        .set('cookie', 'gameId=1')
        .expect(200)
        .expect(/Stratego | Setup/)
        .end(function(err) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
    it('should send to waiting if game is not full', function(done) {
      const isGameFull = stub()
        .withArgs(1)
        .returns(false);
      const getGame = stub()
        .withArgs(1)
        .returns(true);
      replace(games, 'isGameFull', isGameFull);
      replace(games, 'getGame', getGame);
      request(app)
        .get('/setup')
        .set('cookie', 'gameId=1')
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
      const isGameFull = stub()
        .withArgs(1)
        .returns(false);
      replace(games, 'isGameFull', isGameFull);
      request(app)
        .get('/areAllPlayersJoined')
        .set('cookie', 'gameId=1')
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
      const isGameFull = stub()
        .withArgs(1)
        .returns(true);
      replace(games, 'isGameFull', isGameFull);
      request(app)
        .get('/areAllPlayersJoined')
        .set('cookie', 'gameId=1')
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

describe('POST', () => {
  afterEach(() => {
    restore();
  });
  context('/host', function() {
    beforeEach(() => {
      const createNewGame = stub()
        .withArgs('player1')
        .returns(1);
      replace(games, 'createNewGame', createNewGame);
    });

    it('should create game with given player name for /host', function(done) {
      request(app)
        .post('/host')
        .send('playerName=player')
        .expect(302)
        .expect('set-cookie', /gameId=1/)
        .expect('set-cookie', /unit=red/)
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
    beforeEach(() => {
      const getArmy = stub()
        .withArgs('blue')
        .returns([{}]);
      replace(games, 'getArmy', getArmy);
    });

    it('should response back with piecesInfo', function(done) {
      request(app)
        .get('/army')
        .set('Cookie', ['unit=blue', 'gameId=1'])
        .expect(200)
        .expect(/[{}]]/)
        .end(function(err) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should response back with piecesInfo', function(done) {
      request(app)
        .get('/army')
        .expect(404)
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
      const movePiece = stub()
        .withArgs(1, 'blue', '5_5', '4_5')
        .returns(true);
      replace(games, 'movePiece', movePiece);
      request(app)
        .post('/movePiece')
        .set('Cookie', ['unit=blue', 'gameId=1'])
        .send({ sourceTileId: '5_5', targetTileId: '4_5' })
        .expect(200)
        .expect(/sourceTileId/)
        .end(function(err) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with bad request if its an immovable piece', function(done) {
      const movePiece = stub()
        .withArgs(1, 'blue', '0_1', '0_9')
        .returns(false);
      replace(games, 'movePiece', movePiece);
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
      const isGameFull = stub()
        .withArgs(1)
        .returns(false);
      const addPlayerInGame = stub()
        .withArgs(1, 'player1')
        .returns(true);
      replace(games, 'isGameFull', isGameFull);
      replace(games, 'addPlayerInGame', addPlayerInGame);
      request(app)
        .post('/join')
        .send('playerName=player1&gameId=1')
        .expect(302)
        .end(function(err) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should give game started if game is already started for /join', function(done) {
      this.timeout(4000);
      const isGameFull = stub()
        .withArgs(1)
        .returns(true);
      const addPlayerInGame = stub()
        .withArgs(1, 'player1')
        .returns(false);
      replace(games, 'isGameFull', isGameFull);
      replace(games, 'addPlayerInGame', addPlayerInGame);
      request(app)
        .post('/join')
        .send('playerName=player1&gameId=1')
        .expect(200)
        .end(function(err) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
    it('should give not exist if game does not exists', function(done) {
      const isGameFull = stub()
        .withArgs(1)
        .returns(false);
      const addPlayerInGame = stub()
        .withArgs(1, 'player1')
        .returns(false);
      replace(games, 'isGameFull', isGameFull);
      replace(games, 'addPlayerInGame', addPlayerInGame);
      request(app)
        .post('/join')
        .send('playerName=player1&gameId=1')
        .expect(200)
        .end(function(err) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });
  context('/setupData', function() {
    it('should tell to go to game page when the pieceInfo is valid', done => {
      const arrangeBattleField = stub()
        .withArgs(1, [{}])
        .returns(true);
      replace(games, 'arrangeBattleField', arrangeBattleField);
      const piecesInfo = [
        { position: '9_9', name: 'flag' },
        { position: '1_0', name: 'marshal' },
        { position: '2_0', name: 'scout' },
        { position: '3_0', name: 'miner' },
        { position: '4_0', name: 'bomb' },
        { position: '5_0', name: 'bomb' },
        { position: '6_0', name: 'miner' },
        { position: '7_0', name: 'scout' },
        { position: '8_0', name: 'general' },
        { position: '9_0', name: 'spy' }
      ];
      request(app)
        .post('/setupData')
        .set('cookie', 'unit=blue')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ piecesInfo }))
        .expect(200)
        .expect(/game/)
        .end(function(err) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should tell to go to game page when the pieceInfo is valid', done => {
      const arrangeBattleField = stub()
        .withArgs(1, [{}])
        .returns(true);
      replace(games, 'arrangeBattleField', arrangeBattleField);
      const piecesInfo = [
        { position: '1_0', name: 'marshal' },
        { position: '2_0', name: 'scout' },
        { position: '3_0', name: 'miner' },
        { position: '4_0', name: 'bomb' },
        { position: '5_0', name: 'bomb' },
        { position: '6_0', name: 'miner' },
        { position: '7_0', name: 'scout' },
        { position: '8_0', name: 'general' },
        { position: '9_0', name: 'spy' }
      ];
      request(app)
        .post('/setupData')
        .set('cookie', 'unit=blue')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ piecesInfo }))
        .expect(/Bad Request/)
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
