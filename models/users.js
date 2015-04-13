var mongoose = require('mongoose');
var usersScheme   = new mongoose.Schema({
  _id: {type: mongoose.Schema.ObjectId, auto: true, select: true},
  __v: {type: Number, select: false},
  name: {type:String},
  email: {type:String,index:{unique:true}},
  pendingTasks: [String],
  dateCreated: {type:Date,default:Date.now}
});
module.exports = mongoose.model('Users', usersScheme);
module.exports.on('index',function(err){
  if(err) console.log(err);
});
