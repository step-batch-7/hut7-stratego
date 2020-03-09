const express = require('express');
const app = express();
const morgan = require('morgan');
const { getArmy, hasFields, hostGame } = require('./handlers');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/army', getArmy);
app.post('/host', hasFields('playerName'), hostGame);
app.use(express.static('public'));
module.exports = { app };
