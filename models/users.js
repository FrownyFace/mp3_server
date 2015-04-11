var mongoose = require('mongoose');
var usersScheme   = new mongoose.Schema({
  _id: {type: mongoose.Schema.ObjectId, auto: true, select: true},
  __v: {type: Number, select: false},
  name: String,
  email: String,
  pendingTasks: [String],
  dateCreated: {type:Date,default:Date.now}
});
module.exports = mongoose.model('Users', usersScheme);
