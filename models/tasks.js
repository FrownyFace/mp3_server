var mongoose = require('mongoose');
var tasksScheme   = new mongoose.Schema({
  _id: {type: mongoose.Schema.ObjectId, auto: true, select: true},
  __v: {type: Number, select: false},
  name: {type:String},
  description: String,
  pendingTasks : String,
  deadline : {type:Date},
  completed : {type:Boolean,default:false},
  assignedUser : String,
  assignedUserName : String,
  dateCreated : {type:Date,default:Date.now}
});
module.exports = mongoose.model('Tasks', tasksScheme);
