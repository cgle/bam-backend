var passport = require('passport');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var config = require('../../../config/app');
var User = require('../../models/user');

module.exports = function(app) {
  app.post('/api/authenticate/register', function(req, res) {
    var token = jwt.sign(req.body.username, config.app_secret);
    User.register(
      new User({email: req.body.email, username: req.body.username, token: token}),
      req.body.password,
      function(err, user) {
      if (err) {
        res.status(err.status || 500);
        res.send({error: err});
      } else {
        passport.authenticate('local')(req, res, function() {
          return res.send({message: 'registered', access_token: token});
        });
      }
    });
  });

  app.get('/api/authenticate/loggedin', function(req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
  });

  app.post('/api/authenticate/login', passport.authenticate('local'), function(req, res) {
    res.send({message: 'logged in'});
  });

  app.post('/api/authenticate/logout', function(req, res) {
    req.logout();
    res.send({message: 'logged out'});
  });
}
