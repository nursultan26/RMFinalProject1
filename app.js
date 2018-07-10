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


var con = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.dbPassword,
  database: config.database	
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query(`CREATE TABLE IF NOT EXISTS User (
  		Id int NOT NULL AUTO_INCREMENT,
  		Email VARCHAR(255) UNIQUE NOT NULL,
  		Password VARCHAR(255) NOT NULL,
  		Name VARCHAR(255),
  		PRIMARY KEY (Id)
  	);`, function (err, result) {
    	if (err) throw err;
    	console.log("Users table created");
  });

  con.query(`CREATE TABLE IF NOT EXISTS Book (
      Id int NOT NULL AUTO_INCREMENT,
      Title VARCHAR(255) NOT NULL,
      Description VARCHAR(255) NOT NULL,
      Image VARCHAR(255) NOT NULL,
      Author VARCHAR(255) NOT NULL,
      PRIMARY KEY (Id)
    );`, function (err, result) {
      if (err) throw err;
      console.log("Books table created");
  });
});

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
  require(route)(app, con);
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
