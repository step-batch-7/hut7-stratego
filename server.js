const { app } = require('./lib/routes');

const defaultPort = 3000;
const PORT = process.env.PORT || defaultPort;
app.listen(PORT, () => process.stdout.write(`Server listening on :${PORT} \n`));
