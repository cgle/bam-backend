var passport = require('passport');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var redisClient = require('../../utils').redisClient;
var config = require('../../../config/app');
var User = require('../../models/user');

var TOKEN_EXPIRATION = 120; //2 hours
var TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION * 60;

module.exports = function(app) {
  app.post('/api/authenticate/register', function(req, res) {
    User.register(
      new User({email: req.body.email, username: req.body.username}),
      req.body.password,
      function(err, user) {
      if (err) {
        res.status(err.status || 500);
        res.send({error: err});
      } else {
        passport.authenticate('local')(req, res, function() {
          User.collection.ensureIndex(
              {current_pos: '2d'},
              function(err) {
                if (err) res.send({error: err});
                else res.send({message: 'registered'});
              }
            );
        });
      }
    });
  });

  app.get('/api/authenticate/loggedin', function(req, res) {
    res.send(req.isAuthenticated() ? {"message": "loggedin"} : {"error": "unauthorized"});
  });

  app.post('/api/authenticate/login', passport.authenticate(['local', 'basic']), function(req, res) {
    var token = jwt.sign(req.body.username, config.app_secret);
    redisClient.set(token, req.user._id, function(err, reply) {
      if (err) res.send({error: err});
      if (reply) {
        redisClient.expire(token, TOKEN_EXPIRATION_SEC, function (err, reply) {
          if (err) {
              res.send({error: err});
          }
          if (reply) {
              res.send({message: 'logged in', access_token: token, expireInMinutes: TOKEN_EXPIRATION});
          } else {
              res.send({error: 'redis cannot set expiration'});
          }
        });
      } else {
        res.send({error: 'Token not set in redis'});
      }
    });
  });

  app.post('/api/authenticate/logout', passport.authenticate('bearer', {session: false}), function(req, res) {
    redisClient.expire(req.authInfo.token, 0, function(err, reply) {
      if (err) {
          res.send({error: err});
      }
      if (reply) {
          req.logout();
          res.send({message: 'logged out'});
      } else {
          res.send({error: 'redis cannot set expiration'});
      }
    });
  });
}
