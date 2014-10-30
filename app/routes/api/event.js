var async = require('async');
var Event = require('../../models/event');
var User = require('../../models/user');
var _ = require('underscore');

module.exports = function(app, isLoggedIn) {
  //need to convert to km or m or miles
  app.get('/api/events', function(req, res) {
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

  app.post('/api/events', isLoggedIn, function(req, res) {
    var event = new Event(req.body);
    var creator = req.body.creator;
    event.attendants.push(creator);

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

  app.put('/api/events', isLoggedIn, function(req, res) {
    var id = req.body._id;
    var cohosts = req.body.cohosts ? req.body.cohosts : [];
    var attendants = req.body.attendants ? req.body.attendants : [];
    var categories = req.body.categories ? req.body.categories : [];
    var update = _.omit(req.body, ['cohosts','attendants','creator','_id', 'categories']);
    update['updatedAt'] = Date.now();
    Event.update(
      {_id: id},
      {
        $set: update,
        $addToSet: {cohosts: cohosts, attendants: attendants, categories: categories},
      }, {multi: true}, function(err) {
        if (err) res.send({error: err});
        else res.send({data: update});
      }
    );
  });

}
