var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');

var Event = new Schema({
  name: String,
  address: String,
  timestamp: String,
  description: String,
  lng: Number,
  lat: Number,
  upvotes: {type:Number, default: 0},
  downvotes: {type:Number, default: 0},
  creator: {type: mongoose.Schema.ObjectId, ref: 'User'},
  cohosts: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
  attendants: [{type: mongoose.Schema.ObjectId, ref: 'User'}]
});

var exports = module.exports = mongoose.model('Event', Event);
