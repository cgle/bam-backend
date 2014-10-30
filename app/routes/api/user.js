var User = require('../../models/user');
var _ = require('underscore');

module.exports = function(app) {
  app.get('/api/users', function(req, res) {
    User.find(function(err, users) {
      if (!err) return res.send({'data': users});
      else res.send({error: err});
    });
  });

  app.get('/api/users/:username', function(req, res) {
    User.find({username: req.params.username}, function(err, user) {
      if (!err) return res.send({'data': user});
      else res.send({error: err});
    });
  });

  app.put('/api/users', function(req, res) {
    var id = req.body._id;
    var update = _.omit(req.body, '_id');
    User.update(
      {_id: id},
      {
        $set: update
      }, {multi: true}, function(err) {
        if (err) res.send({error: err});
        else res.send({data: update});
      }
    );
  });


};
