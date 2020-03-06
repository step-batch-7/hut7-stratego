const express = require('express');
const app = express();

const morgan = require('morgan');
app.use(express.static('public'));
app.use(morgan('dev'));

module.exports = { app };
