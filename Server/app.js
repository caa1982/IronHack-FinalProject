var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
const passport   = require('./config/passport');
var auth         = require('./routes/auth');
var settings        = require('./routes/settings');
var cors         = require('cors');



require('./config/database');
var app = express();


var corsOptions = {credentials: true, origin: 'http://localhost:4200'};
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

app.use(passport.initialize());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// app.use('/', index);

// app.use('/users', users);
app.use('/', auth);
app.use('/settings', passport.authenticate('jwt', { session: false }), settings);

// app.use(function(req, res) {
//   res.sendfile(__dirname + '/public/index.html');
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
