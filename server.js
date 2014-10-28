var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');

//load project modules & configs
var database = require('./config/database');

mongoose.connect(database.url);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));

db.on('open', function () {
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

  app.get('/', express.static(path.join(__dirname, '/frontend')));


  app.listen(8080);
  console.log('Worker ' + cluster.worker.id + ' running!');
};


