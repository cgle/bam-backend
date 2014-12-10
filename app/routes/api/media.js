var async = require('async');s
var Event = require('../../models/event');
var User = require('../../models/user');
var _ = require('underscore');
var passport = require('passport');

module.exports = function(app, localauth, auth, isOwner) {
  app.get('/api/events/:event_id/media', function(req, res) {

  });

  app.get('/api/users/:user_id/media', function(req, res) {

  });

  app.post('/api/media', function(req, res) {
  });
}
