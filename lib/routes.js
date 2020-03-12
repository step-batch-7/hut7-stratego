const express = require('express');
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const {
  hasFields,
  hostGame,
  getArmy,
  movePiece,
  attack,
  join,
  setup,
  serveHostPage,
  serveJoinPage,
  areAllPlayersJoined,
  setupData,
  gamePage
} = require('./handlers');

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(cookieParser());

app.get('/army', getArmy);
app.get('/game', gamePage);
app.get('/setup', setup);
app.get('/host', serveHostPage);
app.get('/join', serveJoinPage);
app.get('/areAllPlayersJoined', areAllPlayersJoined);
app.post('/host', hasFields('playerName'), hostGame);
app.post('/join', hasFields('playerName', 'gameId'), join);
app.post('/movePiece', movePiece);
app.post('/attack', attack);
app.post('/setupData', setupData);
module.exports = { app };
