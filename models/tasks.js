var mongoose = require('mongoose');
var tasksScheme   = new mongoose.Schema({
  name: String,
  description: String,
  pendingTasks - String,
  deadline - Date,
  completed - Boolean,
  assignedUser - String,
  assignedUserName - String,
  dateCreated - Date
});
module.exports = mongoose.model('Users', tasksScheme);
