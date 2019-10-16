const express = require('express');
const Provider = require('oidc-provider');

const { PORT = 3000, ISSUER = `http://localhost:${PORT}` } = process.env;

const configuration = {
  // ... see available options /docs
  features: {
    clientCredentials: {
      enabled: true
    },
  },
  responseTypes: [
    'code',
    'id_token', 'id_token token',
    'code id_token', 'code token', 'code id_token token',
    'none',
  ],
  clients: [{
    client_id: 'code_foo',
    client_secret: 'bar',
    grant_types: ['refresh_token', 'authorization_code'],
    redirect_uris: ['https://127.0.0.1:8080/code_cb'],
    client_name: 'foo has a name',
    contacts: ['foo@email.com'],
    // + other client properties
  }, {
    client_id: 'implicit_foo',
    client_secret: '...',
    grant_types: ['implicit'],
    response_types: ['id_token token'],
    redirect_uris: ['https://127.0.0.1:8080/implicit_cb'],
    client_name: 'foo has an implicit name',
    contacts: ['foo@implicit.com'],
    // + other client properties
  }, {
    client_id: 'credential_foo',
    client_secret: 'secret',
    grant_types: ['client_credentials', 'refresh_token'],
    response_types: [],
    redirect_uris: [],
  }],
};

const provider = new Provider(ISSUER, configuration);
const app = express();

app.use(provider.callback);

module.exports = app.listen(PORT, () => {
  console.log(`application is listening on port ${PORT}, check its /.well-known/openid-configuration`);
});
