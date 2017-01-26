var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Session = require('express-session');
var flash = require('connect-flash');
var toastr = require('express-toastr');
var sassMiddleware = require('node-sass-middleware');
var methodOverride = require('method-override');
var FileStore = require('session-file-store')(Session);var session = Session({
  store: new FileStore({ encrypt : true }),
  secret: 'YourSecret',
  resave: true,
  saveUninitialized: false
});
var helmet = require('helmet');
var moment = require('moment');

var routes = require('./app/routes/index');
var dashboard = require('./app/routes/dashboard');
var users = require('./app/routes/users');
var medias = require('./app/routes/medias');
var pages = require('./app/routes/pages');
var posts = require('./app/routes/posts');

var app = express();

app.use(helmet());
app.disable('x-powered-by');

app.use(flash());
app.use(toastr());

app.use(methodOverride('_method'));

app.set('trust proxy', 1);
app.use(session);
app.set('session',session);

// VIEW ENGINE SETUP
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'pug');

// MIDDLEWARE FOR SASS
app.use(sassMiddleware({
    src: path.join(__dirname, 'public/sass/'),
    dest: path.join(__dirname, 'public/stylesheets/'),
    indentedSyntax: true,
    debug: true,
    outputStyle: 'compressed',
    prefix:  '/stylesheets'
}));

app.use(favicon(path.join(__dirname, 'public', '/images/favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(flash());
app.use(toastr());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/dashboard', dashboard);
app.use('/dashboard/users', users);
app.use('/dashboard/posts', posts);
app.use('/dashboard/pages', pages);
app.use('/dashboard/medias', medias);

// DATABASE WITH MONGOOSE
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/xnov');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    console.log("La base de donnée est opérationelle.");
});

// ERROR 404
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
