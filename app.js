var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var glob = require('glob');
var mysql = require('mysql');
const config = require('./config');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var db = require('./db/index')

app.use(function(req, res, next) {
  //set user value
  res.locals.user = req.cookies.user

  //ser admin value
  res.locals.admin = (req.cookies.admin)?true:false

  next();
});

/* Configure routes */
var routes = glob.sync('./routes/*.js');
routes.forEach(function(route) {
  require(route)(app, db);
})

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
