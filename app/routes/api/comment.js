var Comment = require('../../models/comment');

module.exports = function(app, localauth, auth, isOwner) {
  app.get('/api/events/:event_id/comments', function(req, res) {
    var query = req.query ? req.query : {};
    query['event_id'] = req.params.event_id;
    Comment
      .find(query)
      .sort({createdAt: 1}).exec(function(err, comments) {
        if (err) res.send({error: err});
        else res.send({data: comments});
    });
  });

  app.get('/api/users/:user_id/comments', function(req, res) {
    Comment
      .find({user_id: req.params.user_id})
      .sort({createdAt: 1}).exec(function(err, comments) {
        if (err) res.send({error: err});
        else res.send({data: comments});
    });
  });

  app.post('/api/events/:event_id/comments', auth, function(req, res) {
    var comment = new Comment({
      event_id: req.params.event_id,
      user_id: req.user._id,
      comment: req.body.comment
    });
    comment.save(function(err) {
      if (err) res.send({error: err});
      else res.send({data: comment});
    });
  });

  app.put('/api/events/:event_id/comments/:comment_id', auth, isOwner, function(req, res) {
    Comment.update(
      {_id: req.params.comment_id},
      {
        $set: {comment: req.body.comment, updatedAt: Date.now()}
      },
      function(err, data) {
        if (err) res.send({error: err});
        else res.send({data: data})
      }
    );
  });

  app.delete('/api/events/:event_id/comments/:comment_id', auth, isOwner, function(req, res) {
    Comment.remove(
      {_id: req.params.comment_id},
      function(err) {
        if (err) res.send({error: err});
        else res.send({data: {}});
      }
    );
  })
}
