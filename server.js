// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var Llama = require('./models/llama');
var bodyParser = require('body-parser');
var router = express.Router();

//replace this with your Mongolab URL
//mongoose.connect('mongodb://localhost/mp3');
mongoose.connect('mongodb://root:root@ds061621.mongolab.com:61621/mp3', function(err) {
    if(err) {
        console.log('connection error', err);
    } else {
        console.log('connection successful');
    }
});

// Create our Express application
var app = express();

// Use environment defined port or 4000
var port = process.env.PORT || 4000;

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
  next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

// All our routes will start with /api
app.use('/api', router);

//Default route here
var homeRoute = router.route('/');

homeRoute.get(function(req, res) {
  res.json({ message: 'Hello World!' });
});

//Llama route
var llamaRoute = router.route('/llamas');

llamaRoute.get(function(req, res,next) {
  var q = JSON.stringify(req.query);
  var i;
  i=0;
  while(i<q.length){
    q = q.replace('\\','');
    //q = q.replace('\"','');
    i++;
  }
  console.log(q);
  var id = 'Llama';
  var str = '';
  if(q.indexOf("where")>-1){
    i = q.indexOf("where");
    str = q.substring(i+8,q.indexOf('}',i)+1);
    id = id+'.find('+str+')';
    console.log(str)
  }else{
    id = id+'.find({})';
  }
  if(q.indexOf("sort")>-1){
    i = q.indexOf("sort");
    str = q.substring(i+7,q.indexOf('}',i)+1);
    id = id+'.sort('+str+')';
    console.log(str);
  }
  if(q.indexOf("select")>-1){
    i = q.indexOf("select");
    str = q.substring(i+9,q.indexOf('}',i)+1);
    id = id+'.select('+str+')';
    console.log(str);
  }
  if(q.indexOf("skip")>-1){
    i = q.indexOf("skip");
    str = q.substring(i+7,q.indexOf('\"',i+8));
    id = id+'.skip('+str+')';
    console.log(str);
  }
  if(q.indexOf("limit")>-1){
    i = q.indexOf("limit");
    str = q.substring(i+8,q.indexOf('\"',i+9));
    id = id+'.limit('+str+')';
    console.log(str);
  }
  if(q.indexOf("count")>-1){
    i = q.indexOf("count");
    str = q.substring(i+8,q.indexOf('\"',i+9));
    id = id+'.count('+str+')';
    console.log(str);
  }
  console.log(id);
  id = id + ".exec(function(err,get){if(err) return next(err); res.json(get);});"
  console.log(id);
  eval(id);
});

llamaRoute.post(function(req,res,next){
  Llama.create(req.body,function(err,post){
    if(err) return next(err);
    res.json(post);
  });
});

/*llamaRoute.get('?where=:id',function(req,res){
  Llama.findOne({_id:req.params.id},function(err,get){
    if(err) return next(err);
    res.json(get);
  });
});*/
//Add more routes here

// Start the server
app.listen(port);
console.log('Server running on port ' + port);
