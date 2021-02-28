var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user.route');
//Router imports
const moviesRouter=require('./routes/movie.route')
const DirectorsRouter=require('./routes/director.route')

//DB connection
const db = require('./helpers/db')();

var app = express();
//token middleware
const verifyToken=require('./middleware/verify-token')
const config=require('./config');
app.set('api_secret_key',config.api_secret_key)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api',verifyToken)//middleware was used here

//Router define to use according to document
app.use('/api/movies',moviesRouter)
app.use('/api/directors',DirectorsRouter)

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
  // res.render('error');
  //typed by us to show on page detailed errors 
  res.json({error:{message:err.message,code:err.code}})
});

module.exports = app;
