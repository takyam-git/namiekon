var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('hello world');
});

var listenPort = app.get('env') === 'production' ? 80 : 3000;
app.listen(listenPort);