var express = require("express");
var session = require('express-session');
var cookieParser = require('cookie-parser');
var path = require("path");
var bodyParser = require("body-parser");
var user = require('./user')
var post = require('./post')
const http = require('http');
const socketio = require('socket.io');
// var popup=require('popups');
var refreshed = false;
var lastLoggedIn = null;
var app = express();
// var gameon = 1;

var verticalI = [3, [[0, 0], [-1, 0], [1, 0], [1, 1], [-1, 1], [1, -1], [-1, -1]]];
var horizontalI = [3, [[0, 0], [0, -1], [0, 1], [1, 1], [1, -1], [-1, 1], [-1, -1]]];
var verticalL = [4, [[0, 0], [0, 1], [-1, 0]]];
var horizontalL = [4, [[0, 0], [1, 0], [0, -1]]];
var verticalT = [5, [[0, 0], [1, 0], [0, -1], [0, 1]]];
var horizontalT = [5, [[0, 0], [0, 1], [-1, 0], [1, 0]]];
var vertical3 = [6, [[0, 0], [1, 0], [-1, 0]]];
var horizontal3 = [6, [[0, 0], [0, 1], [0, -1]]];
var vertical2 = [7, [[0, 0], [1, 0]]];
var horizontal2 = [7, [[0, 0], [0, 1]]];
var vertical1 = [8, [[0, 0]]];
var horizontal1 = [8, [[0, 0]]];

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
      if (result) {
        res.send('success');
        // res.redirect('/#/');
      }
      else {
        res.send("Fail");
      }
    })
  }
  else {
    res.send("Failure");
  }
})

app.post('/signin', function (req, res) {
  sessions = req.session;
  var username = req.body.username;
  var password = req.body.password;
  user.validateSignIn(username, password, function (result) {
    if (result == 1) {
      sessions.username = username;
      res.send(username);
      post.setIs_playing("N", username, function () { });
    }
    else if (result == 2) {
      res.send("online");
    }
    else {
      res.send("Failure");
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

post.initializeServer();

var nsp = io.of('/home');

nsp.on('connection', function (socket) {

  console.log("made connection with socket id ", socket.id)
  socket.on('home-initialized', function () {
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

  socket.on("give player info", function (msg) {
    console.log(msg);
    post.get_player_profile(msg, function (result) {
      console.log(result);
      socket.emit("display player info", { username: msg, games_played: result['games_played'], points: result['points'] });
    });
  });

  socket.on('started-home', function (msg) {
    console.log("made connection with username ", msg);

    // if (refreshed) {
    //   refreshed = false;
    //   sessions.username = lastLoggedIn;
    // }
    sessions.username = msg;
    nsp.to(socket.id).emit('set-username', msg);

    post.setId(socket.id, msg, function () {
      post.isPlaying(msg, function (isplaying) {
        if (isplaying) {
          post.getOpponent(msg, function (oppo) {
            nsp.to(socket.id).emit("render game as refresh", oppo);
            console.log('new connection is game refreshed with player', msg, ' with opponent', oppo);
          });
        }
        else if (!isplaying) {
          post.getPost(function (result) {
            console.log("started-home ", result);
            nsp.emit('online-users', result);
          });
        }
        else console.log("Major ERROR app.js in socket.on started-home");
      });
    });
  });

  socket.on('started-leaderboard', function (msg) {
    console.log("created leaderboard");
    post.getLeaderBoard(function (result) {
      nsp.emit('leaderboard', result);
    });
  });
  socket.on('SEND_MESSAGE', function (data) {
    post.getId(data['to_send'], function (result) {
      nsp.to(result).emit('RECEIVE_MESSAGE', data);
      nsp.to(socket.id).emit('RECEIVE_MESSAGE', data);
    })

  })

  socket.on('challenge-accepted', function (msg) {
    // gameon=0;
    nsp.to(socket.id).emit('start-game', msg);
    console.log('Challenge accepted to', msg);
    var opponent = msg;
    var user = msg;
    post.getId(msg, function (result) {
      post.getUsername(socket.id, function (result2) {
        console.log('Challenge accepted by', result2);
        nsp.to(result).emit('start-game', result2);
        opponent = result2;
        post.dropTable(msg, function (res1) {
          post.dropTable(opponent, function (res2) {
            post.initializetGame(user, opponent, function (resu) {});
          });
        });
      });
    });

    // is_playing opponent name
    post.setIs_playing("Y", user, function () {
      post.setIs_playing("Y", opponent, function () {
        post.setOpponent(opponent, user, function () {
          post.setOpponent(user, opponent, function () {
            post.getPost(function (result) {
              console.log("game-started", result);
              nsp.emit('online-users', result);
            });
          });
        });
      });
    });
  });

  socket.on('challenge-declined', function (msg) {
    post.getId(msg, function (result) {
      post.isPlaying(msg, function (result1) {
        if (!result1)
          post.getUsername(socket.id, function (result2) { nsp.to(result).emit("request declined sendby", result2); });
      });
    });
    nsp.to(socket.id).emit("render-home");//Rendered twice to solve the toggle problem. ReactDom stores home twice,so not rendering. Populating ReactDOM with home thrice.
  });

  app.get('/logout', (req, res) => {

    res.redirect('/#/');
  }
  );

  socket.on('time_out', function (msg) {
    post.getId(msg['opponent'], function (result) {
      nsp.to(socket.id).emit('message to display', "Timed out. You lost.");
      nsp.to(result).emit('message to display', "Opponenet Timed Out. COngratulation, you won.");
      post.changePoints(msg['user'], 10);
      post.changePoints(msg['opponent'], -5);
      nsp.to(socket.id).emit("render-lost");
      nsp.to(result).emit("render-won");
      setTimeout(function () {
        nsp.to(socket.id).emit("render-home");
        nsp.to(result).emit("render-home");
      }, 4000);
      console.log("Match Over ", msg['user'], " won ", msg['opponent'], "lost");
    });
  });

  socket.on('left game', function (msg) {
    post.getId(msg['opponent'], function (result) {
      nsp.to(socket.id).emit('message to display', "Play next match.");
      nsp.to(result).emit('message to display', "Opponenet Left. Congratulation, you won.");
      post.changePoints(msg['user'], 5);
      post.changePoints(msg['opponent'], -5);
      nsp.to(result).emit("render-won");
      nsp.to(socket.id).emit("render-home");
      setTimeout(function () {
        nsp.to(result).emit("render-home");
      }, 4000);
      console.log("Match Over ", msg['user'], " won ", msg['opponent'], "lost");
    });
  });

  socket.on('chance_played', function (msg) {
    // if (gameon==1) {

      console.log("Received Chance Played req", msg);
      post.getadd_info(msg['user'], 2, "checking turn", 1, function (reso) {
        if (reso == 1) {
          post.getId(msg['opponent'], function (result) {
            post.getBlock(msg['opponent'], msg['i'], msg['j'], function (result1) {
              console.log("chance played ", result1);
              if (result1 == 0) {
                nsp.to(result).emit('colour_change', { table: 'user', i: msg['i'], j: msg['j'], color: 'green' });
                nsp.to(socket.id).emit('colour_change', { table: 'opponent', i: msg['i'], j: msg['j'], color: 'red' });//Call coloue change socket before mesage to display
                post.setadd_info(msg['opponent'], 2, 1, 1);
                post.setadd_info(msg['user'], 2, 0, 1);
                post.setBlockColour(msg['opponent'], msg['i'], msg['j'], 3, function () { });
                nsp.to(result).emit('message to display', "Your turn.");
                nsp.to(socket.id).emit('message to display', "Opponent's turn");
              }
              else if (result1 == 1) {
                nsp.to(result).emit('colour_change', { table: 'user', i: msg['i'], j: msg['j'], color: 'red' });
                nsp.to(socket.id).emit('colour_change', { table: 'opponent', i: msg['i'], j: msg['j'], color: 'green' });// colour pain
                post.setBlockColour(msg['opponent'], msg['i'], msg['j'], 2, function (afterChange) {
                  if (afterChange) {
                    post.gameOver(msg['opponent'], function (ifOver) {
                      if (ifOver) {
                        nsp.to(socket.id).emit('message to display', "You Won.");
                        nsp.to(result).emit('message to display', "You lost. Better luck next time.");
                        post.getadd_info(msg['user'], 1, "Update time", 2, function (result) {
                          if (result <= 30) {
                            post.changePoints(msg['user'], 10);
                          }
                          else {
                            post.changePoints(msg['user'], 5);
                          }
                        });
                        post.changePoints(msg['opponent'], -5);
                        post.dropTable(msg['user'], function () { });
                        post.dropTable(msg['opponent'], function () { });
                        nsp.to(socket.id).emit("render-won");
                        nsp.to(result).emit("render-lost");
                        setTimeout(function(){
                        nsp.to(socket.id).emit("render-home");
                        nsp.to(result).emit("render-home");},4000);
                        console.log("Match Over ", msg['user'], " won ", msg['opponent'], "lost");
                      }
                      else {
                        nsp.to(socket.id).emit('message to display', "Nice move. Your turn again.");
                        nsp.to(result).emit('message to display', "Opponent attacked correctly. Opponent's turn");
                      }
                    });
                  }
                });
                nsp.to(socket.id).emit('message to display', "Your turn.");
                nsp.to(result).emit('message to display', "Opponent's turn");
              }
              else {
                nsp.to(socket.id).emit('message to display', "Sorry, can't play here again.");
              }
            });
          });
        }
      });
  });

  socket.on('disconnect', function () {

    // post.getUsername(socket.id, function (result) {
    //   lastLoggedIn = result;
    // });

    post.deletePostSocket(socket.id, function (result) {
      console.log("result of delete post", result);
      post.getPost(function (result) {
        console.log("disconnect", result);
        nsp.emit('online-users', result);
      });
    });
    setTimeout(function () {
      post.getUsername(socket.id, function (result) {
        post.isOnline(result, function (result1) {
          if (!result1) {
            post.onlyIsPlaying(result, function (check) {
              if (check) {
                post.getOpponent(result, function (opponent) {
                  post.getId(opponent, function (result2) {
                    nsp.to(result2).emit('message to display', "Opponenet Left. Congratulation, you won.");
                    post.changePoints(result, -5);
                    post.changePoints(opponent, 5);
                    nsp.to(result2).emit("render-won");
                    setTimeout(function () {
                      nsp.to(result2).emit("render-home");
                    }, 4000);
                    console.log("Match Over ", result, " won ", opponent, "lost");
                  });
                });
              }
              post.setIs_playing("N", result, function () { });
            });
          }
        });
      });
    }, 2500);
  });

  socket.emit('update-total-time', function (msg) {
    post.getadd_info(msg['user'], 1, "Update time", 2, function (result) {
      post.setadd_info(msg['user'], 1, result + 5 - msg['total_time'], 2);
    });
  });
  socket.on('shape_select', function (msg) {
    // if (gameon==1) {
      if (msg['shape']!=null){
        var var_name = msg['h_or_v'] + msg['shape'];
        var blocks = eval(var_name)[1];
        var pos = eval(var_name)[0];
        console.log("request of user", msg['user'], " to place shape ", var_name, "at i,j:", msg['i'], msg['j']);
        post.getadd_info(msg['user'], pos, var_name, 1, function (result) {
          if (result == 1) {
            nsp.to(socket.id).emit('message to display', "Sorry this ship is already been placed");
            console.log("REJECTED request of user", msg['user'], " to place shape ", var_name, "at i,j:", msg['i'], msg['j'], " because shape already placed");
          }
          else if (result == 0) {
            post.checkBlocks_rec(msg['user'], var_name, msg['i'], msg['j'], blocks, function (result1) {
              if (result1 == true) {
                console.log("Ship ", var_name, "can be placed on ", msg['user'], " at i,j:", msg['i'], msg['j']);
                blocks.forEach(function (entry) {
                  console.log("Placing Block of ", var_name, " on ", msg['user'], "at ", msg['i'] + entry[0], ",", msg['j'] + entry[1]);
                  nsp.to(socket.id).emit('colour_change', { table: 'user', i: msg['i'] + entry[0], j: msg['j'] + entry[1], color: 'brown' });
                  post.setBlockColour(msg['user'], msg['i'] + entry[0], msg['j'] + entry[1], 1, function () { });
                });
                nsp.to(socket.id).emit("shape_placed",msg["shape"]);
                post.setadd_info(msg['user'], pos, 1, 1);
              }
              else {
                nsp.to(socket.id).emit('message to display', "That's an incorrect position");
                console.log("REJECTED request of user", msg['user'], " to place shape ", var_name, "at i,j:", msg['i'], msg['j'], " because incorrect position");
              }
            });
          }
        });
      }
    // }
  });

  socket.on('hover_in', function (msg) {
    if (msg['shape']!=null){
      var var_name = msg['h_or_v'] + msg['shape'];
      var blocks = eval(var_name)[1];
      console.log("request of user", msg['user'], " to place shape ", var_name, "at i,j:", msg['i'], msg['j']);
      blocks.forEach(function (entry) {
        x = msg['i'] + entry[0];
        y = msg['j'] + entry[1];
        if (x >= 1 && x <= 8 && y >= 1 && y <= 8) {
          post.getBlock(msg['user'], msg['i'] + entry[0], msg['j'] + entry[1], function (val) {
            console.log("Placing Block of ", var_name, " on ", msg['user'], "at ", msg['i'] + entry[0], ",", msg['j'] + entry[1]);
            if (val == 0) {
              nsp.to(socket.id).emit('colour_change', { table: 'user', i: msg['i'] + entry[0], j: msg['j'] + entry[1], color: 'grey' });
            }
            else if (val == 1) {
              nsp.to(socket.id).emit('colour_change', { table: 'user', i: msg['i'] + entry[0], j: msg['j'] + entry[1], color: 'black' });
            }
          });
        }
      });
    }
  });
  socket.on('hover_out', function (msg) {
    if (msg['shape']!=null){
      var var_name = msg['h_or_v'] + msg['shape'];
      var blocks = eval(var_name)[1];
      console.log("request of user", msg['user'], " to place shape ", var_name, "at i,j:", msg['i'], msg['j']);
      blocks.forEach(function (entry) {
        x = msg['i'] + entry[0];
        y = msg['j'] + entry[1];
        if (x >= 1 && x <= 8 && y >= 1 && y <= 8) {
          post.getBlock(msg['user'], msg['i'] + entry[0], msg['j'] + entry[1], function (val) {
            console.log("Placing Block of ", var_name, " on ", msg['user'], "at ", msg['i'] + entry[0], ",", msg['j'] + entry[1]);
            if (val == 0) {
              nsp.to(socket.id).emit('colour_change', { table: 'user', i: msg['i'] + entry[0], j: msg['j'] + entry[1], color: 'rgba(0,0,0,0)' });
            }
            else if (val == 1) {
              nsp.to(socket.id).emit('colour_change', { table: 'user', i: msg['i'] + entry[0], j: msg['j'] + entry[1], color: 'brown' });
            }
          });
        }
      });
    }
  });
  socket.on('can game be started', function (msg) {
    post.checkGameStart(msg['user'], function (result) {
      if (result == true) {
        nsp.to(socket.id).emit("game_play");
        post.getadd_info(msg['opponent'], 2, "turn Block", 1, function (result) {
          if (result == 1) {
            post.setadd_info(msg['user'], 1, 1, 1);
            post.setadd_info(msg['opponent'], 1, 1, 1);
            nsp.to(socket.id).emit("game_started");
            post.getId(msg['opponent'], function (res) {
              nsp.to(res).emit("game_started");
              nsp.to(res).emit("message to display", "Game Started. Your Turn");
            });
            nsp.to(socket.id).emit("message to display", "Game Started. Opponent's Turn");
          }
          else if (result == 0) {
            post.setadd_info(msg['user'], 2, 1, 1);
            nsp.to(socket.id).emit("message to display", "Opponent hasn't Placed his Blocks. Waiting for him");
          }
        });
      }
      else if (result == false) {
        nsp.to(socket.id).emit("message to display", "Place all the Blocks for match to be started");
      }
      else {
        console.log("PRINTED ERROR: check can game be started in app.js");
      }
    });
  });
  var ms = null;
  var t = null;
  var chance = 0;
  socket.on('receive-chat', function (msg) {
    post.getUsername(socket.id, function (player) {         
      post.getOpponent(player, function (oppon) {
        post.getId(oppon, function (res) {
          nsp.to(res).emit('set-msg',msg);
        });
      });
    });
  });
  socket.on('receive-time', function (msg) {
    post.getUsername(socket.id, function (player) {         
      post.getOpponent(player, function (oppon) {
        post.getId(oppon, function (res) {
          nsp.to(res).emit('set-time',msg);
        });
      });
    });
  })
  socket.on('receive-chance', function (msg) {
    post.getUsername(socket.id, function (player) {         
      post.getOpponent(player, function (oppon) {
        post.getId(oppon, function (res) {
          nsp.to(res).emit('set-chance',msg);
        });
      });
    });  })
  socket.on('refreshed game', function (msg) {
    var player = msg['user'];
    var oppo = null;
    post.getOpponent(player, function (oppon) {
      oppo = oppon;
      post.getId(oppo, function (res) {
        console.log('Opponenent on refresh', oppo)
        nsp.to(res).emit('get-chat');
        nsp.to(res).emit('get-chance');
        nsp.to(res).emit('get-time');
      });
    });
    console.log("request to retrive board ", msg);
    post.getadd_info(player, 1, "game started", 1, function (turn) {
      if (turn == 1) {
        nsp.to(socket.id).emit("game_play");
        post.getPlayerBoard(player, 1, 1, function (playerBoard) {
          console.log("player board ", playerBoard.length);
          playerBoard.forEach(function (entry) {
            if (entry[2] == 1) {
              nsp.to(socket.id).emit('colour_change', { table: 'user', i: entry[0], j: entry[1], color: 'brown' });
              console.log("1");
            }
            else if (entry[2] == 2) {
              nsp.to(socket.id).emit('colour_change', { table: 'user', i: entry[0], j: entry[1], color: 'red' });
              console.log("2");
            }
            else if (entry[2] == 3) {
              nsp.to(socket.id).emit('colour_change', { table: 'user', i: entry[0], j: entry[1], color: 'green' });
              console.log("3");
            }
          });
        });
        post.getPlayerBoard(oppo, 1, 1, function (playerBoard) {
          playerBoard.forEach(function (entry) {
            console.log("player board ", playerBoard.length);
            if (entry[2] == 2) {
              nsp.to(socket.id).emit('colour_change', { table: 'opponent', i: entry[0], j: entry[1], color: 'green' });
              console.log("2");
            }
            else if (entry[2] == 3) {
              nsp.to(socket.id).emit('colour_change', { table: 'opponent', i: entry[0], j: entry[1], color: 'red' });
              console.log("3");
            }
          });
        });
      }
      else if (turn == 0) {
        post.getPlayerBoard(player, 1, 1, function (playerBoard) {
          playerBoard.forEach(function (entry) {
            if (entry[2] == 1) {
              nsp.to(socket.id).emit('colour_change', { table: 'user', i: entry[0], j: entry[1], color: 'brown' });
              console.log("1");
            }
            else if (entry[2] == 2) {
              nsp.to(socket.id).emit('colour_change', { table: 'user', i: entry[0], j: entry[1], color: 'red' });
              console.log("2");
            }
            else if (entry[2] == 3) {
              nsp.to(socket.id).emit('colour_change', { table: 'user', i: entry[0], j: entry[1], color: 'green' });
              console.log("3");
            }
          });
        });
      }
      else console.log("Major ERROR app.js socket.on refreshed home");
    });

  });

});

server.listen(7777, function () {
  console.log("Started listening on port", 7777);
})

