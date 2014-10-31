var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Vote = new Schema({
  event_id: {type: mongoose.Schema.ObjectId, ref: 'Event'},
  user_id: {type: mongoose.Schema.ObjectId, ref: 'User'},
  is_upvote: {type: Boolean},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now}
});

var exports = module.exports = mongoose.model('Vote', Vote);
