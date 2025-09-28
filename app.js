var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var productsRouter = require('./routes/products');
const session = require('express-session');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var contactUsRouter = require('./routes/contact-us');
const db = require('./database/db');
const expressLayouts = require('express-ejs-layouts');
var apiRouter = require('./routes/api');// import the api route

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// layout setup
app.use(expressLayouts);
app.set('layout', 'layouts/main-layout');

// middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// make title available to all views (default fallback)
app.use((req, res, next) => {
  res.locals.title = 'My Express App';
  next();
});

// routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/contactus', contactUsRouter);



app.use('/api', apiRouter);// set up for api route
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.title = 'Error';
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
