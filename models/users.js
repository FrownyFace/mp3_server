var mongoose = require('mongoose');
var usersScheme   = new mongoose.Schema({
  name: String,
  email: String,
  pendingTasks - String,
  dateCreated - Date
});
module.exports = mongoose.model('Users', usersScheme);
