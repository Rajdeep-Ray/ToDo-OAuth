var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const passport = require('passport');
const authenticate = require('./authenticate');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/auth');
var todoRouter = require('./routes/todoRouter');

require('dotenv').config()


const mongoose = require('mongoose');

const connect = mongoose.connect(process.env.MONGODB_URL);

connect.then((db) => {
  console.log("Connected correctly to Database");
}, (err) => { console.log(err); });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/auth', usersRouter);
app.use('/todo', todoRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
