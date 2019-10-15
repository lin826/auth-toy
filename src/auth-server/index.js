const express = require('express');
const Provider = require('oidc-provider');

const { PORT = 3000, ISSUER = `http://localhost:${PORT}` } = process.env;

const configuration = {
  // ... see available options /docs
  clients: [{
    client_id: 'foo',
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
    response_types: ['id_token'],
    redirect_uris: ['https://127.0.0.1:8080/implicit_cb'],
    client_name: 'foo has an implicit name',
    contacts: ['foo@implicit.com'],
    // + other client properties
  }, {
    "grant_types": [
        "implicit"
    ],
    "response_types": [
        "id_token"
    ],
    "token_endpoint_auth_method": "none",
    "application_type": "web",
    "require_auth_time": false,
    "subject_type": "public",
    "introspection_endpoint_auth_method": "none",
    "revocation_endpoint_auth_method": "none",
    "backchannel_logout_session_required": false,
    "frontchannel_logout_session_required": false,
    "request_uris": [],
    "tls_client_certificate_bound_access_tokens": false,
    "client_id": "wd-1mWCwRIOrMyqpX-hBQ",
    "redirect_uris": [
        "https://127.0.0.1:8080/implicit_cb"
    ],
}],
};

const provider = new Provider(ISSUER, configuration);
const app = express();

app.use(provider.callback);

module.exports = app.listen(PORT, () => {
  console.log(`application is listening on port ${PORT}, check its /.well-known/openid-configuration`);
});
