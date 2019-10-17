const fs = require('fs');
const https = require('https');
const express = require('express');
const { Issuer, generators } = require('openid-client');

const { PORT = 8080, ISSUER = `https://127.0.0.1:${PORT}` } = process.env;
const app = express();

let code_client, implicit_client, credential_client;
Issuer.discover('http://localhost:3000/.well-known/openid-configuration')
.then((localIssuer) => {
  code_client = new localIssuer.Client({
    client_id: 'code_foo',
    client_secret: 'bar',
    redirect_uris: [`${ISSUER}/code_cb`],
    response_types: ['code'],
  }); // => Client

  implicit_client = new localIssuer.Client({
    client_id: 'implicit_foo',
    redirect_uris: [`${ISSUER}/implicit_cb`],
    response_types: ['id_token token'],
    // id_token_signed_response_alg (default "RS256")
  }); // => Client

  credential_client = new localIssuer.Client({
    client_id: 'credential_foo',
    client_secret: 'secret',
  });
}); // => Promise

app.get('/credential_start', (_req, res) => {
  credential_client.grant({
    grant_type: 'client_credentials',
  }).then((tokenSet) => {
    res.send(tokenSet);
  });
});

const code_verifier = generators.codeVerifier();
const code_challenge = generators.codeChallenge(code_verifier);
app.get('/code_start', (_req, res) => {
  const url = code_client.authorizationUrl({
    scope: 'openid',
    code_challenge_method: 'S256',
    code_challenge: code_challenge,
  });
  console.log('Redirected to ', url);
  res.redirect(url);
});

app.get('/code_cb', (req, res) => {
  const params = code_client.callbackParams(req);
  code_client.callback(`${ISSUER}/code_cb`, params, { code_verifier }) // => Promise
  .then(function (tokenSet) {
    code_client.tokenSet = tokenSet;
    console.log(`Redirected to ${ISSUER}/code_userinfo`);
    res.redirect(`${ISSUER}/code_userinfo`);
  });
});

app.get('/code_userinfo', (_req, res) => {
  code_client.userinfo(code_client.tokenSet['access_token']) // => Promise
  .then(function (userinfo) {
    res.send({
      tokenSet: code_client.tokenSet,
      userinfo: userinfo,
    });
  });
});

app.get('/implicit_start', (_req, res) => {
  const url = implicit_client.authorizationUrl({
    scope: 'openid email profiles',
    response_mode: 'fragment',
    nonce,
  });
  console.log('Redirected to ', url);
  res.redirect(url);
});

app.get('/implicit_cb', (_req, res) => {
  res.type('.html');
  // ref: https://openid.net/specs/openid-connect-core-1_0.html#FragmentNotes
  res.send(`
    <script type="text/javascript">
      const req = new XMLHttpRequest();
      req.open('POST', '${ISSUER}' + '/implicit_response', true);
      req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

      const postBody = location.hash.substring(1);
      req.onreadystatechange = function (e) {
        if (req.readyState >= 4) {
          if (req.status == 200) {
            alert('Login complete!');
            window.location = 'https://' + window.location.host + '/implicit_userinfo'
          }
        }
      };
      req.send(postBody);
    </script>
  `);
});

const nonce = generators.nonce();
app.use(express.urlencoded({ extended: true }));
app.post('/implicit_response', (req, res) => {
  const params = implicit_client.callbackParams(req);
  implicit_client.callback(`${ISSUER}/implicit_cb`, params, { nonce }) // => Promise
  .then(function (tokenSet) {
    implicit_client.tokenSet = tokenSet;
    console.log('validated ID Token claims %j', tokenSet.claims());
  });
  res.send(req.body);
});

app.get('/implicit_userinfo', (_req, res) => {
  implicit_client.userinfo(implicit_client.tokenSet['access_token']) // => Promise
  .then(function (userinfo) {
    res.send({
      tokenSet: implicit_client.tokenSet,
      userinfo: userinfo
    });
  });
});

const privateKey  = fs.readFileSync('./server.key', 'utf8');
const certificate = fs.readFileSync('./server.crt', 'utf8');
const httpsServer = https.createServer({ key: privateKey, cert: certificate }, app);
httpsServer.listen(PORT, () => {
  console.log(`Client Server application is listening on port ${PORT}.`);
});
module.exports = httpsServer;
