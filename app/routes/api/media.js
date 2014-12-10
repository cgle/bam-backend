var async = require('async');
var Event = require('../../models/event');
var User = require('../../models/user');
var _ = require('underscore');
var passport = require('passport');
var cloudinary = require('cloudinary');
var multipart = require('connect-multiparty');
var multipartMW = multipart();
var config = require('../../../config/app');
var fs = require('fs');
cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.cloud_key,
  api_secret: config.cloud_secret
});

module.exports = function(app, localauth, auth, isOwner) {
  app.post('/api/users/:user_id/media', localauth, multipartMW, function(req, res) {
    console.log(req.files);
    var user_id = req.params.user_id;
    cloudinary.uploader.upload(req.files.profile_pic.path, function(result) {
      console.log("uploaded: " + result);
      User.update(
        {_id: user_id},
        {
          $set: {profile_pic: result.url}
        }, function(err, s, data) {
          if (err) res.send({error: err}, 500);
          else res.send("done", 200);
        }
      );
    });
  });

  app.post('/api/events/:event_id/media', localauth, multipartMW, function(req, res) {
    var event_id = req.params.event_id;
    cloudinary.uploader.upload(req.files.profile_pic.path, function(result) {
      console.log("uploaded: "+result);
      Event.update(
        {_id: event_id},
        {
          $set: {profile_pic: result.url}
        }, function(err, s, data) {
          if (err) res.send({error: err}, 500);
          else res.send("done", 200);
        }
      );
    });
  });

}
