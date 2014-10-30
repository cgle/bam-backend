var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comment = new Schema({
  event_id: {type: mongoose.Schema.ObjectId, ref: 'Event'},
  commenter: {type: mongoose.Schema.ObjectId, ref: 'User'},
  comment: {type: String, trim: true},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now}
});

var exports = module.exports = mongoose.model('Comment', Comment);
