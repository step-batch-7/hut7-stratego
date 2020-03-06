const express = require('express');
const app = express();

const morgan = require('morgan');
app.use(express.static('public'));
app.use(morgan('dev'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => process.stdout.write(`Server listening on :${PORT} \n`));
