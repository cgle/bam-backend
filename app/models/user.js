var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
  username: String,
  password: String,
  fullname: {type: String, default: ''},
  phone: {type: String, default: ''},
  email:  {type: String, default: '', lowercase:true},
  createdAt: {type: Date, default: Date.now},
  birthyear: {type: String, default: ''},
  profile_pic: {type: String, default: ''},
  zip: {type: String, default: ''},
  address: {type: String, default: ''},
  created_events: [{type: mongoose.Schema.ObjectId, ref: 'Event'}],
  attended_events: [{type: mongoose.Schema.ObjectId, ref: 'Event'}],
  cohosted_events: [{type: mongoose.Schema.ObjectId, ref: 'Event'}]
});

User.plugin(passportLocalMongoose);

var exports = module.exports = mongoose.model('User', User);
