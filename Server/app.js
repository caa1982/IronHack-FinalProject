const express       = require('express');
const path          = require('path');
const favicon       = require('serve-favicon');
const logger        = require('morgan');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const passport      = require('./config/passport');
const auth          = require('./routes/auth');
const coinmarket    = require('./routes/coinmarketcap');
const settings      = require('./routes/settings');
const cors          = require('cors');
const coinmarketcap = require('./helper/coinmarketcap');
const polo          = require('./routes/poloniex');


require('./config/database');
const app = express();


let corsOptions = {credentials: true, origin: 'http://localhost:4200'};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

app.use(passport.initialize());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', auth);
app.use('/settings', passport.authenticate('jwt', { session: false }), settings);
app.use('/coinmarketcap', passport.authenticate('jwt', { session: false }), coinmarket);
app.use('/poloniex', passport.authenticate('jwt', { session: false }), polo);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
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
  res.json(err);
});

coinmarketcap();

module.exports = app;
