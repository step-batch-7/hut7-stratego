const express = require('express');
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const {
  hasFields,
  hostGame,
  getArmy,
  movePiece,
  join,
  setup
} = require('./handlers');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(cookieParser());

app.get('/army', getArmy);
app.get('/setup', setup);
app.post('/host', hasFields('playerName'), hostGame);
app.post('/join', hasFields('playerName', 'gameId'), join);
app.post('/movePiece', movePiece);
module.exports = { app };
