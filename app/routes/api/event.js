var async = require('async');
var Event = require('../../models/event');
var User = require('../../models/user');
var _ = require('underscore');

module.exports = function(app) {
  app.get('/api/events', function(req, res) {
    Event.find(function(err, events) {
      if (!err) return res.send({data: events});
      else res.send({error: err});
    });
  });

  app.get('/api/events/:event_id', function(req, res) {
    Event.find({_id: req.params.event_id}, function(err, event) {
      if (!err) return res.send({data: event});
      else res.send({error: err});
    });
  });

  app.get('/api/events/:event_id/users', function(req, res) {
    Event
      .findOne({_id: req.params.event_id})
      .populate('creator cohosts attendants')
      .exec(function(err, event) {
        if (err) return res.send({error: err});
        else res.send({
          event: req.params.event_id,
          attendants: event.attendants,
          creator: event.creator,
          cohosts: event.cohosts
        });
      });
  });

  app.post('/api/events', function(req, res) {
    var event = new Event(req.body);
    var creator = req.body.creator;
    event.attendants.push(creator);

    async.parallel([
      function(callback) {
        event.save(function(err) {
          if (err) callback(err);
          else callback(null);
        });
      },
      function(callback) {
        User.update(
          {_id: creator},
          {
            $addToSet: {created_events: event._id}
          },
          function(err) {
            if (err) callback(err);
            else callback(null);
          }
        );
      }
    ], function(err) {
      if (err) res.send({error: err});
      else res.send({data: event});
    });

  });

  app.put('/api/events', function(req, res) {
    var id = req.body._id;
    var cohosts = req.body.cohosts ? req.body.cohosts : [];
    var attendants = req.body.attendants ? req.body.attendants : [];
    var update = _.omit(req.body, ['cohosts','attendants','creator','_id']);
    Event.update(
      {_id: id},
      {
        $set: update,
        $addToSet: {cohosts: cohosts, attendants: attendants},
      }, {multi: true}, function(err) {
        if (err) res.send({error: err});
        else res.send({data: update});
      }
    );
  });

  app.delete('/api/events', function(req, res) {
    Event.remove({_id: req.body._id}, function(err) {
      if (err) res.send({error: err});
      else res.send({'message': 'event deleted'});
    });
  });
}
