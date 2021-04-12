var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
const favoriteMovies = require('./routes/favorite_movies');
const users = require('./routes/users');
const axiosRoutes = require('./routes/axios');

var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var ExpressPinoLogger = require('express-pino-logger');
var pino = ExpressPinoLogger({
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      user: req.raw.user,
      cookie: req.cookies,
      session: req.session,
    }),
  },
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'key',
  saveUninitialized: true,
  resave: true,
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(pino);

app.use('/', indexRouter);
app.use('/users',users);
app.use('/movies/favorite',favoriteMovies);
app.use('/movies', axiosRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
