var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var morgan = require('morgan');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var session = require('express-session');
//load project modules & configs
var database = require('./config/database');

mongoose.connect(database.url);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));

db.on('open', function () {
  //clustering implementation on CPU cores
  if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });

  cluster.on('disconnect', function(worker) {
    console.error('disconnect!');
    cluster.fork();
  });

  } else {
    runServer();
  }
});

var runServer = function() {
  app.use(morgan('dev'));
  app.use(express.static(__dirname + '/frontend'));
  app.set('port', process.env.PORT || 8080);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
   extended: true
  }));
  app.use(methodOverride());

  app.use(session({secret: 'dollhouse1606stclairave'}));
  app.use(passport.initialize());
  app.use(passport.session());

  if ('development' == app.get('env')) {
    app.use(errorHandler());
  }

  var User = require('./app/models/user');

  passport.use(User.createStrategy());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  app.get('/', express.static(path.join(__dirname, '/frontend')));
  app.get('/api', function(req,res) {
    res.send({'message': 'api is running', 'status': res.status});
  });

  var isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) return next();
    else {
      res.send({error: 'unauthorized'}, 401);
    }
  }

  require('./app/routes/api/authenticate')(app);
  require('./app/routes/api/user')(app, isLoggedIn);
  require('./app/routes/api/event')(app, isLoggedIn);
  require('./app/routes/api/vote')(app, isLoggedIn);
  //app listen port 8080
  app.listen(8080);
  console.log('Worker ' + cluster.worker.id + ' running!');
};


