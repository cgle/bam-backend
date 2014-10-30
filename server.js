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
  app.use(express.static(__dirname + '/frontend'));
  app.set('port', process.env.PORT || 8080);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
   extended: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.get('/', express.static(path.join(__dirname, '/frontend')));
  if ('development' == app.get('env')) {
    app.use(errorHandler());
  }

  app.get('/api', function(req,res) {
    res.send({'message': 'api is running', 'status': res.status});
  });

  var User = require('./app/models/user');
  passport.use(User.createStrategy());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  require('./app/routes/api/authenticate')(app);
  require('./app/routes/api/user')(app);
  require('./app/routes/api/event')(app);
  require('./app/routes/api/vote')(app);
  //app listen port 8080
  app.listen(8080);
  console.log('Worker ' + cluster.worker.id + ' running!');
};


