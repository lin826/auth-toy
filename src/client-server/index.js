const express = require('express');
const { Issuer } = require('openid-client');

const CLIENT_ID = 'foo';
const CLIENT_SECRET = 'bar';
const { PORT = 8080, ISSUER = `http://localhost:${PORT}` } = process.env;

const app = express();

app.get('/cb', function(req, res) {
  const params = client.callbackParams(req);
  client.callback(ISSUER + '/cb', params) // => Promise
    .then(function (tokenSet) {
      res.send(tokenSet);
    });
});

const server = app.listen(PORT, () => {
  console.log(`application is listening on port ${PORT}, running as ${ISSUER}`);
});
module.exports = server;

let client;
Issuer.discover('http://localhost:3000/.well-known/openid-configuration') // => Promise
  .then(function (localIssuer) {

    client = new localIssuer.Client({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uris: [`http://localhost:${PORT}/cb`],
      response_types: ['code'],
    }); // => Client

    client.authorizationUrl();
  });
