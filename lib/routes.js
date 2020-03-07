const express = require('express');
const app = express();
const morgan = require('morgan');
const { getId, hostGame } = require('./handlers');

app.use(express.json());
app.use(express.static('public'));

app.use(morgan('dev'));
app.use(express.static('public'));

app.get('/gameId', getId);
app.post('/hostGame', hostGame);
module.exports = { app };
