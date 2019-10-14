// TODO: Set up three port.
// TODO: Setting selections.

const express = require('express');

const app = express();

app.get('/', function(_req, res) {
  res.send('GET request to the homepage');
});
