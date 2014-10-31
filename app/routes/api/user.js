var User = require('../../models/user');
var _ = require('underscore');

module.exports = function(app, isLoggedIn, isOwner) {
  app.get('/api/users', function(req, res) {
    var query = req.query ? req.query : {};
    User.find(query, function(err, user) {
      if (!err) return res.send({'data': user});
      else res.send({error: err});
    });
  });

  app.put('/api/users/:user_id', isLoggedIn, function(req, res) {
    var id = req.params.user_id;
    if (id != req.user._id) {
      return res.send({error: "unauthorized"}, 401);
    }
    User.update(
      {_id: id},
      {
        $set: req.body
      }, {multi: true}, function(err, s, data) {
        if (err) res.send({error: err});
        else res.send({data: data});
      }
    );
  });

};
