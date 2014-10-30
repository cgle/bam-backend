var Comment = require('../../models/comment');

module.exports = function(app, isLoggedIn) {
  app.get('/api/comments/e/:event_id', function(req, res) {
    Comment.find(
      {event_id: req.params.event_id},
      {$sort: {createdAt: 1}},
      function(err, comments) {
        if (err) res.send({error: err});
        else res.send({data: comments});
    });
  });

  app.get('/api/comments/u/:user_id', function(req, res) {
    Comment.find(
      {commenter: req.params.user_id},
      {$sort: {createdAt: 1}},
      function(err, comments) {
        if (err) res.send({error: err});
        else res.send({data: comments});
    });
  });

  app.post('/api/comments', function(req, res) {
    var comment = new Comment({
      event_id: req.body.event_id,
      commenter: req.body.commenter,
      comment: req.body.comment
    });
    comment.save(function(err) {
      if (err) res.send({error: err});
      else res.send({data: comment});
    });
  });

  app.put('/api/comments', isLoggedIn, function(req, res) {
    Comment.update(
      {_id: req.body._id},
      {
        $set: {comment: req.body.comment, updatedAt: Date.now()}
      },
      function(err) {
        if (err) res.send({error: err});
        else res.send({'message': 'comment updated'})
      }
    );
  });

  app.delete('/api/comments', isLoggedIn, function(req, res) {
    Comment.remove(
      {_id: req.body._id},
      function(err) {
        if (err) res.send({error: err});
        else res.send({'message': 'comment deleted'});
      }
    );
  })
}
