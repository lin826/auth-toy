const { Issuer } = require('openid-client');
Issuer.discover('http://localhost:3000') // => Promise
    .then(function (googleIssuer) {
        console.log('Discovered issuer %s %O', googleIssuer.issuer, googleIssuer.metadata);
});