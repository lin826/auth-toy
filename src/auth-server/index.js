const Provider = require('oidc-provider');
const express = require('express');

const { PORT = 3000, ISSUER = `http://localhost:${PORT}` } = process.env;

const configuration = {
  // ... see available options /docs
  clients: [{
    client_id: 'foo',
    client_secret: 'bar',
    redirect_uris: ['http://localhost:8080/cb'],
    // + other client properties
  }],
};

const provider = new Provider(ISSUER, configuration);
const app = express();

app.use(provider.callback);

const server = app.listen(PORT, () => {
  console.log(`application is listening on port ${PORT}, check its /.well-known/openid-configuration`);
});

module.exports = server;
