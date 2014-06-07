var express = require('express')
  , http = require('http')
  , path = require('path')
  , favicon = require('static-favicon')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , routes = require('./routes/index')
  , users = require('./routes/users')
  , app = express()
  , socketIO = require('socket.io')
  , debug = require('debug')('namiekon')
  , cookie = require('cookie')
  , Session = require('express-session')
  , connect = require('connect')
  , sessionStore = new Session.MemoryStore();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(Session({
  secret: 'appSecretKey',
  store: sessionStore
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var server = http.createServer(app);

app.set('port', process.env.PORT || 3000);
server.listen(app.get('port'), function () {
  debug('Express server listening on port ' + server.address().port);
});

var io = socketIO.listen(server);

var parseCookie = cookieParser('appSecretKey');
io.use(function (socket, callback) {
  var handshakeData = socket.request;
  if (handshakeData.headers.cookie) {
    parseCookie(handshakeData, null, function(err, cookie) {
      if (err) {
        return accept('Error parseCookie.', false);
      }
      var sessionID = handshakeData.signedCookies['connect.sid'];
      // セッションをストレージから取得
      sessionStore.get(sessionID, function (err, session) {
        if (err) {
          //セッションが取得できなかったら
          console.dir(err);
          callback(new Error(err.message));
        }
        else if (!session) {
          console.log('session not found');
          callback(new Error('session not found'));
        }
        else {
          console.log("authorization success");

          // socket.ioからもセッションを参照できるようにする
          handshakeData.cookie = cookie;
          handshakeData.sessionID = sessionID;
          handshakeData.sessionStore = sessionStore;
          handshakeData.session = new Session(handshakeData, session);
          callback();
        }
      });
    });
  }
  else {
    //cookieが見つからなかった時
    return callback('cookie not found', false);
  }
});

io.on('connection', function (socket) {
//  console.log('session data', socket.handshake);
  console.log('session data', socket.request.sessionID);

  socket.on("hoge", function(message) {
    console.log(socket.request.sessionID);
  });

  //Expressのセッションを定期的に更新する
  var sessionReloadIntervalID = setInterval(function() {
    socket.handshake.session.reload(function() {
      socket.handshake.session.touch().save();
    });
  }, 60 * 2 * 1000);
  socket.on("disconnect", function(message) {
    clearInterval(sessionReloadIntervalID);
  });
});

module.exports = app;
