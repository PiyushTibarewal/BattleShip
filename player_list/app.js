var express = require("express");
var session = require('express-session');
var cookieParser = require('cookie-parser');
var path = require("path");
var bodyParser = require("body-parser");
var user = require('./user')
var post = require('./post')
const http = require('http');
const socketio = require('socket.io');
var refreshed = false;
var lastLoggedIn = null;
var app = express();

var verticalI = [3,[[0,0],[-1,0],[1,0],[1,1],[-1,1],[1,-1],[-1,-1]]];
var horizontalI = [3,[[0,0],[0,-1],[0,1],[1,1],[1,-1],[-1,1],[-1,-1]]];
var verticalL = [4,[[0,0],[0,1],[-1,0]]];
var horizontalL = [4,[[0,0],[1,0],[0,-1]]];
var verticalT = [5,[[0,0],[1,0],[0,-1],[0,1]]];
var horizontalT = [5,[[0,0],[0,1],[-1,0],[1,0]]];
var vertical3 = [6,[[0,0],[1,0],[-1,0]]];
var horizontal3 = [6,[[0,0],[0,1],[0,-1]]];
var vertical2 = [7,[[0,0],[1,0]]];
var horizontal2 = [7,[[0,0],[0,1]]];
var vertical1 = [8,[[0,0]]];
var horizontal1 = [8,[[0,0]]];

app.use(cookieParser());
app.use(session({
  secret: 'my-secret', resave: true,
  saveUninitialized: true
}));
var sessions;
app.use(express.static(path.join(__dirname, "/html")));

app.use(bodyParser.json());
var server = http.createServer(app);
var io = socketio(server);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/html/index.html');
});

app.post('/signup', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;

  if (username && password) {
    user.signup(username, password, function (result) {
      if (result)
        res.redirect('/#/');
    })
  }
  else {
    res.send('Failure');
  }
})

app.post('/signin', function (req, res) {
  sessions = req.session;
  var username = req.body.username;
  var password = req.body.password;
  user.validateSignIn(username, password, function (result) {
    if (result) {
      sessions.username = username;
      res.send(username);
    }
  });
})


app.get('/home', function (req, res) {
  if (sessions && sessions.username) {
    res.sendFile(__dirname + '/html/home.html');
  }
  else {
    res.send('unauthorized');
  }
})


var nsp = io.of('/home');

nsp.on('connection', function (socket) {

  console.log("made connection with socket id ", socket.id)
  socket.on('home-initialized', function(){
    nsp.to(socket.id).emit('render-home');
  });
  socket.on('send-request', function (msg) {
    post.getUsername(socket.id, function (result) {
      console.log("from " + result + " to " + msg);
      post.getId(msg, function (result1) {
        nsp.to(result1).emit("request send", result)
      });
    });
  });

  socket.on('refresh-user', function (msg) {
    refreshed = true;
  });

  socket.on('started-home', function (msg) {
    console.log("started home with this message- ", msg, " -recieved");
    if (refreshed) {
      refreshed = false;
      sessions.username = lastLoggedIn;
    }
    nsp.to(socket.id).emit('set-username', sessions.username);

    post.setId(socket.id, sessions.username);
    post.getPost(function (result) {
      console.log("started-home ", result);
      nsp.emit('online-users', result);
    });
  });

  socket.on('started-leaderboard', function (msg) {
    console.log("created leaderboard");
    post.getLeaderBoard(function (result) {
      nsp.emit('leaderboard', result);
    });
  });

  socket.on('challenge-accepted', function (msg) {
    nsp.to(socket.id).emit('start-game', msg);
    console.log('Challenge accepted to',msg);
    post.getId(msg, function (result) {
      post.getUsername(socket.id, function (result2) { 
        console.log('Challenge accepted by',result2);

        nsp.to(result).emit('start-game', result2); });
    });
  });

  socket.on('challenge-declined', function (msg) {
    post.getId(msg, function (result) {
      post.isPlaying(msg, function (result1) {
        if (!result1)
          post.getUsername(socket.id, function (result2) { nsp.to(result).emit("request declined sendby", result2); });
      });
    });
    nsp.to(socket.id).emit("render-home");
  });

  app.get('/logout', (req, res) => {

    res.redirect('/#/');
  }
  );
  
  socket.on('chance_played',function(msg){
    console.log(msg);
    post.getId(msg['table'], function (result) {
      console.log({ table: 'user', i: msg['i'], j: msg['j']});
      nsp.to(result).emit('colour_change',{ table: 'user', i: msg['i'], j: msg['j']});
    });
  });

  socket.on('disconnect', function () {

    post.getUsername(socket.id, function (result) {
      lastLoggedIn = result;
    });
    post.deletePostSocket(socket.id, function (result) {
      console.log("result of delete post", result);
    });
    post.getPost(function (result) {
      console.log("disconnect", result);
      nsp.emit('online-users', result);
    });
  });

  socket.on('shape_select', function (msg) {
    var blocks = eval(msg['h_or_v']+msg['shape'])[1];
    var pos = eval(msg['h_or_v']+msg['shape'])[0];
    post.getadd_info(msg['user'], pos, function (result) {
      if (result == 1) {
        //message sorry already placed it
        post.getId(msg['table'], function (res){
          blocks.forEach ( function (entry) {
            nsp.to(res).emit('message to display', "Sorry this ship is already been placed");
          });
        });
      }
      else if (result == 0) {
        post.checkBlocks(msg['user'], msg['i'], msg['j'], blocks, function (result1) {
          if (result1==true) {
            //emit and set all blocks
            post.getId(msg['table'], function (res){
              blocks.forEach ( function (entry) {
                nsp.to(res).emit('colour_change', { user : msg['user'], i: msg['i']+entry[0], j: msg['j']+entry[1], color: 'brown'});
              });
            });
            post.setadd_info(msg['user'], pos, 1);
          }
          else {
            // message sorry incorrect position
            post.getId(msg['table'], function (res){
              blocks.forEach ( function (entry) {
                nsp.to(res).emit('message to display', "That's an incorrect position");
              });
            });
          }
        });
      }
    });
  });

});

server.listen(7777, function () {
  console.log("Started listening on port", 7777);
})
