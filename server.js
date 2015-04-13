// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var Llama = require('./models/llama');
var User = require('./models/users');
var Task = require('./models/tasks');
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
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
  next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

// All our routes will start with /api
app.use('/api', router);
app.use(bodyParser.json());

//Default route here
var homeRoute = router.route('/');

homeRoute.get(function(req, res) {
  res.json({ message: 'Hello World!' });
});
//-----------------------------------------------------------------------------------
router.get('/llamas',function(req, res,next) {
  var q = JSON.stringify(req.query);
  console.log("q"+q);
  var ret = 'Llama'
  if (typeof req.query.where === 'undefined') ret = ret+'.find({})';
  else ret = ret+'.find('+req.query.where+')';
  if (typeof req.query.sort != 'undefined') ret = ret+'.sort('+req.query.sort+')';
  if (typeof req.query.select != 'undefined') ret = ret+'.select('+req.query.select+')';
  if (typeof req.query.skip != 'undefined') ret = ret+'.skip('+req.query.skip+')';
  if (typeof req.query.limit != 'undefined') ret = ret+'.limit('+req.query.limit+')';
  if (typeof req.query.count != 'undefined') ret = ret+'.count('+req.query.count+')';
  ret = ret + ".exec(function(err,get){if(err) return next(err); res.json(get);});"
  console.log(ret);
  console.log("----");
  eval(ret);
});

router.post('/llamas',function(req,res,next){
  Llama.create(req.body,function(err,post){
    if(err) return next(err);
    res.json(post);
  });
});

router.options('/llamas',function(req,res,next){
  res.writeHead(200);
  res.end();
});

router.get('/llamas/:id',function(req,res,next){
  Llama.findOne({_id:req.params.id},function(err,get){
    if(err) return next(err);
    res.json(get);
  });
});

router.put('/llamas/:id',function(req,res,next){
  Llama.findOneAndUpdate({_id:req.params.id},req.body,function(err,put){
    if(err) return next(err);
    res.json(put);
  });
});

router.delete('/llamas/:id',function(req,res,next){
  Llama.findByIdAndRemove({_id:req.params.id},req.body,function(err,del){
    if(err) return next(err);
    res.json(del);
  });
});
//-----------------------------------------------------------------------------------
router.get('/users',function(req, res,next) {
  var q = JSON.stringify(req.query);
  //console.log("q"+q);
  var ret = 'User'
  if (typeof req.query.where === 'undefined') ret = ret+'.find({})';
  else ret = ret+'.find('+req.query.where+')';
  if (typeof req.query.sort != 'undefined') ret = ret+'.sort('+req.query.sort+')';
  if (typeof req.query.select != 'undefined') ret = ret+'.select('+req.query.select+')';
  if (typeof req.query.skip != 'undefined') ret = ret+'.skip('+req.query.skip+')';
  if (typeof req.query.limit != 'undefined') ret = ret+'.limit('+req.query.limit+')';
  if (typeof req.query.count != 'undefined') ret = ret+'.count('+req.query.count+')';
  ret = ret + ".exec(function(err,get){if(err) {var id = '{\"message\": \"Server Error\",\"data\":'+JSON.stringify(get)+'}'; id = JSON.parse(id); res.statusCode = 500; res.json(id); return next(err);} var id = '{\"message\": \"OK\",\"data\":'+JSON.stringify(get)+'}';id = JSON.parse(id);res.statusCode = 200;res.json(id);});"
  //ret = ret + ".exec(function(err,get){if(err) return next(err); var id = '{\"message\": '+res.statusCode+',\"data\":'+JSON.stringify(get)+'}';id = JSON.parse(id);res.json(id);});"
  //ret = ret + ".exec(function(err,get){if(err) return next(err);res.json(get);});"
  //console.log(ret);
  eval(ret);
  //console.log('---------------------------------------------------------------');
});

router.post('/users',function(req,res,next){
  User.create(req.body,function(err,post){
    //console.log(post.name + ' ' + post.email);
    if(err) {
        if(err.code == 11000) {
            res.status(500).json({message: 'Email already exists.', "data":[]});
            return;
        }
        var id = '{"message": "server error","data":'+JSON.stringify(post)+'}';
        id = JSON.parse(id);
        res.statusCode = 500;
        res.json(id);
        return next(err);
    }
    if(!post.name){
      res.status(500).json({message: 'No Name Field',"data":[]});
      return
    }
    if(!post.email){
      res.status(500).json({message: 'No Email Field',"data":[]});
      return
    }
    var id = '{"message": "User Added","data":'+JSON.stringify(post)+'}';
    res.statusCode = 200;
    id = JSON.parse(id);
    res.json(id);
  });
});

router.options('/users',function(req,res,next){
  res.writeHead(200);
  res.end();
});

router.get('/users/:id',function(req,res,next){
  User.findOne({_id:req.params.id},function(err,get){
    if(err) {
        if (err.path == '_id') {
            var id = '{"message": "User Does Not Exist","data":[]}';
            id = JSON.parse(id);
            res.statusCode = 404;
            res.json(id);
            return next(err);
        }
        var id = '{"message": "server error","data":'+JSON.stringify(get)+'}';
        id = JSON.parse(id);
        res.statusCode = 500;
        res.json(id);
        return next(err);
    }
    if(JSON.stringify(get) == 'null') {
        var id = '{"message": "User Does Not Exist","data":[]}';
        id = JSON.parse(id);
        res.statusCode = 404;
        res.json(id);
        return;
    }
    var id = '{"message": "User Found","data":'+JSON.stringify(get)+'}';
    res.statusCode = 200;
    id = JSON.parse(id);
    res.json(id);
  });
});

router.put('/users/:id',function(req,res,next){
  User.findOneAndUpdate({_id:req.params.id},req.body,function(err,put){
    if(err) {
        if (err.path == '_id') {
            var id = '{"message": "User Does Not Exist","data":[]}';
            id = JSON.parse(id);
            res.statusCode = 404;
            res.json(id);
            return next(err);
        }
        var id = '{"message": "server error","data":'+JSON.stringify(put)+'}';
        id = JSON.parse(id);
        res.statusCode = 500;
        res.json(id);
        return next(err);
    }
    if(JSON.stringify(put) == 'null') {
        var id = '{"message": "User Does Not Exist","data":[]}';
        id = JSON.parse(id);
        res.statusCode = 404;
        res.json(id);
        return;
    }
    if(!put.name){
      res.status(500).json({message: 'No Name Field',"data":[]});
      return
    }
    if(!put.email){
      res.status(500).json({message: 'No Email Field',"data":[]});
      return
    }
    var id = '{"message": "User Updated","data":'+JSON.stringify(put)+'}';
    res.statusCode = 201;
    id = JSON.parse(id);
    res.json(id);
  });
});

router.delete('/users/:id',function(req,res,next){
  User.findOneAndRemove({_id:req.params.id},req.body,function(err,del){
    if(err) {
        if (err.path == '_id') {
            var id = '{"message": "User Does Not Existd","data":[]}';
            id = JSON.parse(id);
            res.statusCode = 404;
            res.json(id);
            return next(err);
        }
        var id = '{"message": "server error","data":'+JSON.stringify(del)+'}';
        id = JSON.parse(id);
        res.statusCode = 500;
        res.json(id);
        return next(err);
    }
    if(JSON.stringify(del) == 'null') {
        var id = '{"message": "User Does Not Exist","data":[]}';
        id = JSON.parse(id);
        res.statusCode = 404;
        res.json(id);
        return;
    }
    var id = '{"message": "User Deleted","data":'+JSON.stringify(del)+'}';
    res.statusCode = 200;
    id = JSON.parse(id);
    res.json(id);
  });
});
//-----------------------------------------------------------------------------------
router.get('/tasks',function(req, res,next) {
  var q = JSON.stringify(req.query);
  //console.log("q"+q);
  var ret = 'Task'
  if (typeof req.query.where === 'undefined') ret = ret+'.find({})';
  else ret = ret+'.find('+req.query.where+')';
  if (typeof req.query.sort != 'undefined') ret = ret+'.sort('+req.query.sort+')';
  if (typeof req.query.select != 'undefined') ret = ret+'.select('+req.query.select+')';
  if (typeof req.query.skip != 'undefined') ret = ret+'.skip('+req.query.skip+')';
  if (typeof req.query.limit != 'undefined') ret = ret+'.limit('+req.query.limit+')';
  if (typeof req.query.count != 'undefined') ret = ret+'.count('+req.query.count+')';
  ret = ret + ".exec(function(err,get){if(err) {var id = '{\"message\": \"Server Error\",\"data\":'+JSON.stringify(get)+'}'; id = JSON.parse(id); res.statusCode = 500; res.json(id); return next(err);} var id = '{\"message\": \"OK\",\"data\":'+JSON.stringify(get)+'}';id = JSON.parse(id);res.statusCode = 200;res.json(id);});"
  //ret = ret + ".exec(function(err,get){if(err) return next(err); var id = '{\"message\": '+res.statusCode+',\"data\":'+JSON.stringify(get)+'}';id = JSON.parse(id);res.json(id);});"
  eval(ret);
  //console.log('---------------------------------------------------------------');
});

router.post('/tasks',function(req,res,next){
  Task.create(req.body,function(err,post){
    if(err) {
        var id = '{"message": "server error","data":'+JSON.stringify(post)+'}';
        id = JSON.parse(id);
        res.statusCode = 500;
        res.json(id);
        return next(err);
    }
    if(!post.name){
      res.status(500).json({message: 'No Name Field',"data":[]});
      console.log('no name');
      return
    }
    if(!post.deadline){
      res.status(500).json({message: 'No Deadline Field',"data":[]});
      return
    }
    var id = '{"message": "Task Added","data":'+JSON.stringify(post)+'}';
    res.statusCode = 201;
    id = JSON.parse(id);
    res.json(id);
    });
});

router.options('/tasks',function(req,res,next){
  res.writeHead(200);
  res.end();
});

router.get('/tasks/:id',function(req,res,next){
  Task.findOne({_id:req.params.id},function(err,get){
    if(err) {
        if (err.path == '_id') {
            var id = '{"message": "Task Does Not Exist","data":[]}';
            id = JSON.parse(id);
            res.statusCode = 404;
            res.json(id);
            return next(err);
        }
        var id = '{"message": "server error","data":'+JSON.stringify(get)+'}';
        id = JSON.parse(id);
        res.statusCode = 500;
        res.json(id);
        return next(err);
    }
    if(JSON.stringify(get) == 'null') {
        var id = '{"message": "Task Does Not Exist","data":[]}';
        id = JSON.parse(id);
        res.statusCode = 404;
        res.json(id);
        return;
    }
    var id = '{"message": "Task Found","data":'+JSON.stringify(get)+'}';
    res.statusCode = 200;
    id = JSON.parse(id);
    res.json(id);
  });
});

router.put('/tasks/:id',function(req,res,next){
  Task.findOneAndUpdate({_id:req.params.id},req.body,function(err,put){
    console.log(put);
    if(err) {
        if (err.path == '_id') {
            var id = '{"message": "Task Does Not Exist","data":[]}';
            id = JSON.parse(id);
            res.statusCode = 404;
            res.json(id);
            return next(err);
        }
        var id = '{"message": "server error","data":'+JSON.stringify(put)+'}';
        id = JSON.parse(id);
        res.statusCode = 500;
        res.json(id);
        return next(err);
    }
    if(JSON.stringify(put) == 'null') {
        var id = '{"message": "Task Does Not Exist","data":[]}';
        id = JSON.parse(id);
        res.statusCode = 404;
        res.json(id);
        return;
    }
    if(!put.name){
      res.status(500).json({message: 'No Name Field',"data":[]});
      return
    }
    if(!put.deadline){
      res.status(500).json({message: 'No Deadline Field',"data":[]});
      return
    }
    var id = '{"message": "Task Updated","data":'+JSON.stringify(put)+'}';
    res.statusCode = 200;
    id = JSON.parse(id);
    res.json(id);
  });
});

router.delete('/tasks/:id',function(req,res,next){
  Task.findOneAndRemove({_id:req.params.id},req.body,function(err,del){
    if(err) {
        if (err.path == '_id') {
            var id = '{"message": "Task Does Not Exist","data":[]}';
            id = JSON.parse(id);
            res.statusCode = 404;
            res.json(id);
            return next(err);
        }
        var id = '{"message": "server error","data":'+JSON.stringify(del)+'}';
        id = JSON.parse(id);
        res.statusCode = 500;
        res.json(id);
        return next(err);
    }
    if(JSON.stringify(del) == 'null') {
        var id = '{"message": "Task Does Not Exist","data":[]}';
        id = JSON.parse(id);
        res.statusCode = 404;
        res.json(id);
        return;
    }
    var id = '{"message": "Task Deleted","data":'+JSON.stringify(del)+'}';
    res.statusCode = 200;
    id = JSON.parse(id);
    res.json(id);
  });
});
// Start the server
app.listen(port);
console.log('Server running on port ' + port);
