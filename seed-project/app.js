var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose'); // import mongoose package

var appRoutes = require('./routes/app');
var messageRoutes = require('./routes/messages');
var userRoutes = require('./routes/user');

var app = express();
mongoose.connect('test-user:fire11@ds235788.mlab.com:35788/node-angular-messenger'); // PROD connect to mongoose server via path 
// mongoose.connect('mongodb://localhost:27017/node-angular'); // DEV connect to mongoose server via path 


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// adds headers to handle requests that come from DIFFERENT servers from this one 
// for instance, if the angular code was hosted on a different server than your server side code
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

// backend routes with leading URL /message are forwarded to messageRoutes
app.use('/message', messageRoutes);
app.use('/user', userRoutes);
// indicates that all routes (including index rout /) should be forwarded to the appRoutes module
app.use('/', appRoutes);

// shouldn't reach lines below this because all routes should flow to through appRoutes
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    return res.render('index');
});


module.exports = app;