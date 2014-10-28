var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverrid = require('method-override');

//load project modules & configs
var databae = require('./config/database');

mongoose.connect(database.url);

app.use(express.static(__dirname + '/frontend'));

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
    runService();
  }
});

var runServer = function() {
  app.configure(function() {
    app.set('port', process.env.PORT || 8000);
  });

  app.get('/', express.static(path.join(__dirname, '/frontend')));


  app.listen(8080);
  console.log('Worker ' + cluster.worker.id + ' running!');
};


