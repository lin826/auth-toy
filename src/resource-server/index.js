const express = require('express');

const { PORT = 3001, ISSUER = `http://localhost:${PORT}` } = process.env;

const app = express();

app.get('/OAuth2.0/authenticate', function(_req, res) {
  // TODO: Check if the user click on "Agree".
  res.status(200).send();
});

const server = app.listen(PORT, () => {
  console.log(`application is listening on port ${PORT}, running as ${ISSUER}`);
});

module.exports = server;
