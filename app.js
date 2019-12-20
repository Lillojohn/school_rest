var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var js2xmlparser  = require("js2xmlparser");

var routes = require('./routes/index');
var users = require('./routes/users');
var voting = require('./routes/voting');
var contact = require('./routes/contact');
var over = require('./routes/over');
var inzenden = require('./routes/inzenden');
var inloggen = require('./routes/inloggen');
voteRouter = require('./routes/voteRoutes');
stellingRouter = require('./routes/stellingRoutes');

var db = mongoose.connect('mongodb://188.166.3.49/Rest');

var Vote = require('./models/voteModel');
var Stelling = require('./models/stellingModel');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.use('/', routes);
app.use('/users', users);
app.use('/voting', voting);
app.use('/over', over);
app.use('/inzenden', inzenden);
app.use('/inloggen', inloggen);
app.use('/api/vote', voteRouter(Vote));
app.use('/api/stelling', stellingRouter(Stelling, js2xmlparser));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});




module.exports = app;
