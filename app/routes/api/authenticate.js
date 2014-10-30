var passport = require('passport');
var User = require('../../models/user');

module.exports = function(app) {
  app.post('/api/authenticate/register', function(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
      if (err) {
        res.status(err.status || 500);
        res.send({error: err});
      } else {
        passport.authenticate('local')(req, res, function() {
          return res.send(user);
        });
      }
    });
  });

  app.get('/api/authenticate/loggedin', function(req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
  });

  app.post('/api/authenticate/login', passport.authenticate('local'), function(req, res) {
    res.send(req.user);
  });
}
