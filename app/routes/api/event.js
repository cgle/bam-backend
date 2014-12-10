var async = require('async');
var Event = require('../../models/event');
var User = require('../../models/user');
var _ = require('underscore');
var passport = require('passport');

module.exports = function(app, localauth, auth, isOwner) {
  //need to convert to km or m or miles
  app.get('/api/events', function(req, res) {
    var query = req.query ? req.query : {};
    if (req.query.lat && req.query.lng) {
      var maxDistance = req.query.distance ? req.query.distance*1 : 10;
      var lat = req.query.lat*1;
      var lng = req.query.lng*1;
      Event.geoNear([lng, lat], {maxDistance: maxDistance, spherical: true, public: true}, function(err, events, stats) {
        if (err) res.send({error: err});
        else res.send({data: events});
      });
    } else {
      Event.find(query, function(err, events) {
        if (!err) return res.send({data: events});
        else res.send({error: err});
      });
    }
  });

  //need: check for logged in, public/private events
  app.get('/api/events/:event_id', function(req, res) {
    Event.find({_id: req.params.event_id}, function(err, event) {
      if (!err) return res.send({data: event});
      else res.send({error: err});
    });
  });

  app.post('/api/events', localauth, function(req, res) {
    var event = new Event(req.body);
    event['user_id'] = req.user._id;
    event.attendants.push(event.user_id);

    async.parallel([
      function(callback) {
        event.save(function(err) {
          if (err) callback(err);
          else {
            Event.collection.ensureIndex(
              {pos: '2d'},
              function(err) {
                if (err) callback(err);
                else callback(null);
              }
            );
          }
        });
      },
      function(callback) {
        User.update(
          {_id: req.user._id},
          {
            $addToSet: {created_events: event._id, attended_events: event._id}
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

  app.put('/api/events/:event_id', localauth, isOwner, function(req, res) {
    var id = req.params.event_id;
    var add = req.query.add ? req.query.add : false;
    var cohosts = req.body.cohosts ? req.body.cohosts : [];
    var attendants = req.body.attendants ? req.body.attendants : [];
    attendants = _.union(attendants,cohosts);
    //var categories = req.body.categories ? req.body.categories : [];
    var update = _.omit(req.body, ['cohosts','attendants','user_id','_id']);
    update['updatedAt'] = Date.now();
    Event.update(
      {_id: id},
      {
        $set: update,
        $push: {cohosts: {$each :cohosts}, attendants: {$each :attendants}}
      }, {multi: true}, function(err, data) {
        if (err) res.send({error: err});
        else res.send({data: data});
      }
    );
  });

}
