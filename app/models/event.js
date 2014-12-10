var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');

var Event = new Schema({
  name: String,
  address: {type: String, trim: true},
  date: {type: Date, default: Date.now},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  description: String,
  pos: {
    lng: {type: Number, default: 0.0},
    lat: {type: Number, default: 0.0}
  },
  zip: String,
  public: {type: Boolean, default: true},
  upvotes: {type: Number, default: 0},
  downvotes: {type: Number, default: 0},
  category: String,
  pictures: [String],
  profile_pic: String,
  user_id: {type: mongoose.Schema.ObjectId, ref: 'User'},
  cohosts: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
  attendants: [{type: mongoose.Schema.ObjectId, ref: 'User'}]
});

var exports = module.exports = mongoose.model('Event', Event);
