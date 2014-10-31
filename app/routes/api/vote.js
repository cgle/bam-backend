var async = require('async');
var Vote = require('../../models/vote');
var Event = require('../../models/event');
var User = require('../../models/user');

module.exports = function(app, isLoggedIn, isOwner) {
  app.get('/api/events/:event_id/votes', function(req, res) {
    var query = req.query ? req.query : {};
    query['event_id'] = req.params.event_id;
    Vote.find(query, function(err, votes) {
      if (err) res.send(err);
      else res.send({'data': votes});
    });
  });

  app.get('/api/users/:user_id/votes', function(req, res) {
    Vote.find({user_id: req.params.user_id}, function(err, votes) {
      if (err) res.send(err);
      else res.send({'data': votes});
    });
  });

  app.post('/api/events/:event_id/votes', isLoggedIn, function(req, res) {
    var vote = new Vote({
      event_id: req.params.event_id,
      user_id: req.user._id,
      is_upvote: req.body.is_upvote
    });

    var up = vote.is_upvote ? 1 : 0;
    var down = 1 - up;

    async.parallel([
      function(callback) {
        vote.save(function(err) {
          if (err) callback(err);
          else callback(null);
        });
      },
      function(callback) {
        Event.update(
          {_id: vote.event_id},
          {
            $inc: {upvotes: up, downvotes: down},
            $addToSet: {
              attendants: vote.user_id
            },
            $set: {
              updatedAt: Date.now()
            }
          }, function(err) {
            if (err) callback(err);
            else callback(null);
          }
        );
      },
      function(callback) {
        User.update(
          {_id: vote.user_id},
          {
            $addToSet: {
              attended_events: vote.event_id
            }
          }, function(err) {
            if (err) callback(err);
            else callback(null);
          }
        );
      }
    ],
    function(err) {
      if (err) res.send({error: err});
      else res.send({data: vote});
    });
  });

  app.put('/api/events/:event_id/votes/:vote_id', isLoggedIn, isOwner, function(req, res) {
    var up = req.body.is_upvote ? 1 : -1;
    var down = -1 * up;
    async.parallel([
      function(callback) {
        Vote.update(
          {event_id: req.params.event_id, user_id: req.user._id},
          {
            $set: {is_upvote: req.body.is_upvote, updatedAt: Date.now()}
          }, function(err, data) {
            if (err) callback(err);
            else callback(null, data);
          }
        );
      },
      function(callback) {
        Event.update(
          {_id: req.params.event_id},
          {
            $inc: {upvotes: up, downvotes: down},
            $set: {updatedAt: Date.now()}
          }, function(err, data) {
            if (err) callback(err);
            else callback(null, data);
          }
        );
      }
    ],
    function(err, data) {
      if (err) res.send({error: err});
      else res.send({data: data[1]});
    });
  });
}
