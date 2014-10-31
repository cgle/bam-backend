var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');

var Event = new Schema({
  name: String,
  address: String,
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  description: String,
  pos: {
    lng: Number,
    lat: Number
  },
  zip: String,
  public: {type: Boolean, default: true},
  upvotes: {type: Number, default: 0},
  downvotes: {type: Number, default: 0},
  categories: [String],
  user_id: {type: mongoose.Schema.ObjectId, ref: 'User'},
  cohosts: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
  attendants: [{type: mongoose.Schema.ObjectId, ref: 'User'}]
});

var exports = module.exports = mongoose.model('Event', Event);
