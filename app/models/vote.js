var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Vote = new Schema({
  event: {type: mongoose.Schema.ObjectId, ref: 'Event'},
  voter: {type: mongoose.Schema.ObjectId, ref: 'User'},
  is_upvote: {type: Boolean}
});

var exports = module.exports = mongoose.model('Vote', Vote);
