import home from './home';
var ActivePlayers=home.ActivePlayers;
var LeaderBoard=home.LeaderBoard;
var ShowProfile=home.ShowProfile;
var challengeRequest=home.challengeRequest;



socket.on('online-users', function (msg) {
    var result = JSON.stringify(msg);
    var red = JSON.parse(result);
    console.log("HI");
    show.changePost(red);
    console.log(red);
    console.log("HI");
  });
  
  socket.on('leaderboard', function (msg) {
    var result = JSON.stringify(msg);
    var red = JSON.parse(result);
    console.log("HI");
    leader.changeLeader(red);
    console.log(red);
    console.log("HI");
  });
  
  const element = <h1>Hello, world</h1>;
  
  socket.on('request send', function (msg) {
    console.log(msg);
    ReactDOM.render(
      <Router history={hashHistory}>
        <Route component={challengeRequest} username={msg} path="/"></Route>
        <Route component={LeaderBoard} path="/addPost(/:id)"></Route>
        <Route component={ShowProfile} path="/showProfile"></Route>
      </Router>,
      document.getElementById('app'));
  });
  
  socket.on('start-game', function (msg) {
    ReactDOM.render(element, document.getElementById('app'));
  }
  );
  
  socket.on('request declined sendto'), function () {
    ReactDOM.render(
      <Router history={hashHistory}>
        <Route component={ActivePlayers} path="/"></Route>
        <Route component={LeaderBoard} path="/addPost(/:id)"></Route>
        <Route component={ShowProfile} path="/showProfile"></Route>
      </Router>,
      document.getElementById('app'));
  };
  
  socket.on('request declined sendby', function (msg) {
    alert("Sorry! " + msg + " declined your challenge request");
  });
  
  socket.on('set-username', function (msg) {
    user = msg; console.log('wefwwfcw', msg);
  });
  
  if (window.performance) {
    if (performance.navigation.type == 1) {
      socket.emit('refresh-user', user);
    }
  }
  
  
  ReactDOM.render(
    <Router history={hashHistory}>
      <Route component={ActivePlayers} path="/"></Route>
      <Route component={LeaderBoard} path="/addPost(/:id)"></Route>
      <Route component={ShowProfile} path="/showProfile"></Route>
    </Router>,
    document.getElementById('app'));
  