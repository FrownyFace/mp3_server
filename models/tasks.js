var mongoose = require('mongoose');
var tasksScheme   = new mongoose.Schema({
  _id: {type: mongoose.Schema.ObjectId, auto: true, select: true},
  __v: {type: Number, select: false},
  name: String,
  description: String,
  pendingTasks: String,
  deadline: Date,
  completed: Boolean,
  assignedUser: String,
  assignedUserName: String,
  dateCreated: Date
});
module.exports = mongoose.model('Tasks', tasksScheme);
