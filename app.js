var createError = require('http-errors');
var express = require('express');
var path = require('path');
// var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db=require('./config/connection.js');
var session = require('express-session')


var hbs = require('express-handlebars');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs.engine({extname:'hbs' , defaultLayout:'layout' , layoutsDir:__dirname+'/views/layout' , partialsDir:__dirname+'/views/partials/'}))

app.use(logger('dev'));
app.use(express.json());
// app.use(express.urlencoded());
app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var session = require('express-session');

app.use(session({secret:"Key",cookie:{maxAge:600000}}));
app.use('/', usersRouter);
// app.use('/login', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

db.connect((err)=>{
  if(err)
    console.log("Connection error"+err)    
  else
    console.log("Database connected to port 27017");
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
