const express = require('express');
const app = express();
const morgan = require('morgan');
const { hasFields, hostGame, getArmy, movePiece } = require('./handlers');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(morgan('dev'));

app.get('/army', getArmy);
app.post('/host', hasFields('playerName'), hostGame);
app.post('/movePiece', movePiece);
module.exports = { app };
