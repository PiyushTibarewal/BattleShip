var express = require("express");
var session = require('express-session');
var cookieParser = require('cookie-parser');
var path = require("path");
var bodyParser = require("body-parser");
var user = require('./user')
var post = require('./post')
//var popup = require('popups');
const http = require('http');
const socketio = require('socket.io');


var app = express();
app.use(cookieParser());
app.use(session({secret: 'my-secret',resave: true,
saveUninitialized: true}));
var sessions;


app.use(express.static(path.join(__dirname,"/html")));

app.use(bodyParser.json());
var server = http.createServer(app);
var io = socketio(server);
console.log("jo");
app.get('/', function(req,res){
	//sessions.username = null;
  res.sendFile(__dirname + '/html/index.html');
})
console.log("ko");
app.post('/signup', function (req, res) {
  var name=req.body.name;
  var email=req.body.email;
  var password=req.body.password;

  if(name && email && password){
  	user.signup(name, email, password)
  }
  else{
  	res.send('Failure');
  }
})


// console.log(io);

//app.get('/logout', function(req, res) {
//	sessions= null;
//	sessions.username=null;
//	res.sendFile(__dirname + '/html/index.html');
//})
app.post('/signin', function (req, res) {
  sessions=req.session;
  var user_name=req.body.email;
  var password=req.body.password;
  user.validateSignIn(user_name,password,function(result){
    if(result){
      sessions.username = user_name;
      res.send('success');
      //res.redirect('/home#')
    }
	//else{
	//popup.alert({
  //  content: 'wrong credentials'
//})
//}
  });
})


app.get('/home', function (req, res) {
  if(sessions && sessions.username){
    res.sendFile(__dirname + '/html/home.html');
  }
  else{
    res.send('unauthorized');
  }
})




app.post('/addpost', function (req, res) {
  var title = req.body.title;
  var subject = req.body.subject;
  var id = req.body.id;
  console.log('id is ',id);
  if(id == '' || id == undefined){
    console.log('add');
    post.addPost(title, subject ,function(result){
      res.send(result);
    }); 
  }
  else{
    console.log('update',title,subject);
    post.updatePost(id, title, subject ,function(result){
      res.send(result);
    }); 
  }
  
})

app.post('/updateProfile', function(req, res){
  var name = req.body.name;
  var password = req.body.password;
  
  user.updateProfile(name, password, sessions.username, function(result){
      res.send(result);
  })
})



app.post('/deletePost', function(req,res){
  var id = req.session.username;
  post.deletePost(id, function(result){
    res.send(result)
  })
})

app.post('/getProfile', function(req,res){
  user.getUserInfo(sessions.username, function(result){
    res.send(result)
  })
})

app.post('/getPostWithId', function(req,res){
	if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    }
	else{
  var id = req.session.username;
  post.getPostWithId(id, function(result){
    res.send(result)
  })
}
})
app.post('/getpost', function (req, res) {
  post.getPost(function(result){
    res.send(result);
  });
})

io.on('connection', function(socket){
  
  console.log(socket.id);

socket.on('started-home',function(msg){
  console.log(msg);
  console.log("YO");
  post.getPost(function(result){console.log(result);
    socket.emit('online-users',result)  });
  });
   


socket.on('disconnect',function(){


app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
	var id = req.session.username;	
	post.deletePost(id, function (result) {
	req.session.user=null;
	//sessions.username=null;
	//sessions=null;        
	res.redirect('/#/signup');
	})
	
    }
});
});
});

server.listen(7777,function(){
    console.log("Started listening on port", 7777);
})
