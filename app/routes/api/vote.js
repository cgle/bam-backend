var async = require('async');
var Vote = require('../../models/vote');
var Event = require('../../models/event');
var User = require('../../models/user');

module.exports = function(app, isLoggedIn) {
  app.get('/api/votes/:event_id', function(req, res) {
    Vote.find({event: req.params.event_id}, function(err, votes) {
      if (err) res.send(err);
      else res.send({'data': votes});
    });
  });

  app.post('/api/votes', isLoggedIn, function(req, res) {
    var vote = new Vote({
      event: req.body.event,
      voter: req.body.voter,
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
          {_id: vote.event},
          {
            $inc: {upvotes: up, downvotes: down},
            $addToSet: {
              attendants: vote.voter
            }
          }, function(err) {
            if (err) callback(err);
            else callback(null);
          }
        );
      },
      function(callback) {
        User.update(
          {_id: vote.voter},
          {
            $addToSet: {
              attended_events: vote.event
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

  app.put('/api/votes', isLoggedIn, function(req, res) {
    var up = req.body.is_upvote ? 1 : -1;
    var down = -1 * up;
    async.parallel([
      function(callback) {
        Vote.update(
          {event: req.body.event, voter: req.body.voter},
          {
            $set: {is_upvote: req.body.is_upvote}
          }, function(err) {
            if (err) callback(err);
            else callback(null);
          }
        );
      },
      function(callback) {
        Event.update(
          {_id: req.body.event},
          {
            $inc: {upvotes: up, downvotes: down}
          }, function(err) {
            if (err) callback(err);
            else callback(null);
          }
        );
      }
    ],
    function(err) {
      if (err) res.send({error: err});
      else res.send(req.body);
    });
  });
}
