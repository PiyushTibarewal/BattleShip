var Router = window.ReactRouter.Router;
var Route = window.ReactRouter.Route;
var hashHistory = window.ReactRouter.hashHistory;
var browserHistory = window.ReactRouter.browserHistory;
var Link = window.ReactRouter.Link;
var socket = io('/home');
var user_name = null;
var show = null;
var leader = null;
var opponent_name = null;
var is_playing = 0;
var time = 5;
var board = null;
var mychance = 0;
var p = true;


var click_url = "http://" + window.location.hostname + ":7777/Sounds/mouse_click.mp3";
var click = new Audio(click_url);
var ding_url = "http://" + window.location.hostname + ":7777/Sounds/ding.mp3";
var ding = new Audio(ding_url);
var exp_url = "http://" + window.location.hostname + ":7777/Sounds/explosion.mp3";
var exp = new Audio(exp_url);
var mfail_url = "http://" + window.location.hostname + ":7777/Sounds/mission_failed.mp3";
var mfail = new Audio(mfail_url);
var slip_url = "http://" + window.location.hostname + ":7777/Sounds/slip.mp3";
var slip = new Audio(slip_url);
var victory_url = "http://" + window.location.hostname + ":7777/Sounds/victory.mp3";
var victory = new Audio(victory_url);
var swoosh_url = "http://" + window.location.hostname + ":7777/Sounds/swoosh.mp3";
var swoosh = new Audio(swoosh_url);
var chat = null; 


// var homecur = 'style="cursor: url(http://' + window.location.hostname + ':7777/cursors/home.cur),default;"';
class RuleBook extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    click.play();
    document.getElementById('addHyperLink').className = "";
    document.getElementById('homeHyperlink').className = "";
    document.getElementById('profileHyperlink').className = "active";
  }
 
  render() {
    return (
      <div>
        <h3>Rules</h3>
        <p>Battleship</p>
        <p><b>No. of Players</b>-<b>2</b></p>
        <p><b>Main Objective</b>-<b>Sink all opponent's ships before opponent sinks your</b></p>
        <p>Battleship is a war-themed board game for two players in which the opponents try to guess the location of the other's various ships. The object of the game is to guess the location of the ships each player hides on a plastic grid containing vertical and horizontal space coordinates. Players take turns calling out row and column coordinates on the other player's grid in an attempt to identify a square that contains a ship. 
</p>
        <h4><b>Setting Up the Board Game</b></h4>
        <ul>
          <li>Each player receives a game board with two grids - Ocean Grid and Target Grid.</li>
          <li>Each player secretly places six ships (I shaped Carrier, L shaped Carrier,T shaped Carrier, 3 Decker Cruiser, 2 Decker Destroyer, 1 Decker Submarine) in his ocean grid. and Press start to declare he is done placing.</li>
          <li>Each ship must be placed horizontally or vertically—not diagonally—across grid spaces, and the ships can't hang off the grid. Ships can touch each other, but they can't occupy the same grid space. You cannot change the position of the ships after the game begins.
</li>
        </ul>
        <h4><b>Basic GamePlay</b></h4>
        <ul>
          <li>The player who placed ships first gets the first turn.</li>
          <li>On your turn, you will be given 5 Seconds, you have click on the target grid block where you want to fire, It will turn red if it was a miss or green if you hit any ship.</li>
          <li>If you hit a ship you will get one more turn.</li>
          <li>On opponent's turn, He will do the same, If he hit your ship that block will turn red in your ocean grid else red.</li>
          <li>First player to sunk all ship wins.</li>
        </ul>
        <h4><b>Points System</b></h4>
        <ul>
          <li>The winning player get 5 points and loser loses 2 points.</li>
          <li>Winner gets a bonus of 5 points if his total gameplay was less than 30 second.</li>
        </ul>
      </div>
    )
  }
}
class LeaderBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
    };
    leader = this;
  }

  changeLeader(msg) {
    this.setState({ posts: msg });
  }

  componentDidMount() {
    click.play();
    socket.emit("started-leaderboard", "challenge accepted");
    document.getElementById('homeHyperlink').className = "";
    document.getElementById('addHyperLink').className = "active";
    document.getElementById('profileHyperlink').className = "";
  }

  render() {
    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Games Played</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {
            this.state.posts.map(function (post, index) {

              return <tr key={index} >
                <td>{index + 1}</td>
                <td>{post.username}</td>
                <td>{post.games_played}</td>
                <td>{post.points}</td>
              </tr>
            }.bind(this))
          }
        </tbody>
      </table>
    )
  }
};

class ActivePlayers extends React.Component {
  constructor(props) {

    super(props);
    this.updatePost = this.updatePost.bind(this);
    this.player_profile=this.player_profile.bind(this);
    this.state = {
      posts: [],
    };
    show = this;
  }

  updatePost(username) {
    console.log("request sent to", username)
    socket.emit("send-request", username);
    $("#" + username).find(".mybt").hide();
    $('#' + username).find(".rqst").html("request send");
    click.play();
  }
  player_profile(username) {
    console.log("give player info", username);
    socket.emit("give player info", username);
    click.play();
  }

  changePost(msg) {
    this.setState({ posts: msg });
  }
  
  
  componentDidMount() {
    click.play();
    socket.emit("started-home", sessionStorage.getItem('myusername'));
    document.getElementById('homeHyperlink').className = "active";
    document.getElementById('addHyperLink').className = "";
    document.getElementById('profileHyperlink').className = "";
    socket.on("display player info",function(msg){
      console.log(msg);
      console.log("YO");
      $("#"+msg['username']).find(".g_p").html(msg['games_played']);
      $("#"+msg['username']).find(".po").html(msg['points']);
      if(p){ p=false;//Socket called twice here.
      $("#"+msg['username']).toggleClass('hidden');
    }
    setTimeout(function(){p=true},500);
  });
    socket.on('request declined sendby', function (msg) {
      console.log("declined request",msg);
    

      $('#'+msg).find(".rqst").html("Sorry! "+msg+" declined your request.");
    });
  }

  render() {

    return (
    <div><center><p><b>Active Players</b></p></center>
        <div  id="accordion">
          {
            this.state.posts.map(function (post, index) {
              if (post.username != sessionStorage.getItem('myusername')) {
              {/* return <tr key={index} > */}
                {/* <td>{index + 1}</td> className="table table-striped"*/}
                return <div>     
      <div  id="heading">
        <h5 >
          <button className="btn btn-primary btn-lg btn-block" onClick={this.player_profile.bind(this,post.username)}>{post.username}
        </button>
        </h5>
      </div>
      <div id={post.username} className="hidden" >
        <div className="card-body">
           <span >games_played : </span><span className="g_p" ></span><span>  points : </span><span className="po" ></span>
           <button  onClick={this.updatePost.bind(this, post.username)} className="mybt glyphicon glyphicon-send">Challenge</button><b><span className="rqst"></span></b>
        </div>
      </div>
      </div>
              }
            }.bind(this))
          }
          </div>
          </div>    
    )
  }
};

class ChallengeRequest extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      username: '',
    };
    this.yes = this.yes.bind(this);
    this.no = this.no.bind(this);
  }

  yes() {
    click.play();
    socket.emit('challenge-accepted', this.props.username);
  }
  no() {
    click.play();
    socket.emit('challenge-declined', this.props.username);
  }

  render() {

    return (
      <div>
        <h2>{this.props.username} thinks he can defeat you. Wanna show him he can't?.</h2>
        <button type="button" onClick={this.yes} id="submit" name="submit" className="btn btn-primary pull-right">Yes</button>
        <button type="button" onClick={this.no} id="submit" name="submit" className="btn btn-primary pull-right">No</button>
      </div>
    )
  }
};
class Board extends React.Component {
  constructor() {

    super();
    this.changetime = this.changetime.bind(this);
    board = this;
  }
  changetime() {
    time = time - 1;
    console.log(time);
    document.getElementById('time').innerHTML = time;
    if (time == 0 && mychance == 1)
      socket.emit("time_out", { user: user_name, opponent: opponent_name });
    var t = setTimeout(this.changetime, 1000);
  }
  componentDidMount() {
    click.play();
    document.getElementById('time').innerHTML = time;
    document.getElementById('turn').innerHTML = "May the odds be in your favour.";

    $('td').click(function () {
      var name = $(this).closest('table').attr('id');

      var c = $(this).parent().children().index($(this));
      var r = $(this).parent().parent().children().index($(this).parent());
      if (is_playing == 0) {
        var a = $('#shape').val();
        console.log(a);
        var b = $('#h_or_v').val();
        console.log(b);
        if (name == 'user') {
          socket.emit("shape_select", { user: user_name, opponent: opponent_name, i: Number(r) + 1, j: Number(c) + 1, shape: a, h_or_v: b });
        }
      }
      //emit when clicking at i,j 
      if (is_playing == 1) {
        console.log("Chance played emit");
        if (name == 'user') {
        }
        else {
          click.play();
          socket.emit("chance_played", { user: user_name, opponent: opponent_name, i: Number(r) + 1, j: Number(c) + 1 });
        };
      }
      //for changing the colour when chance is played;

    });

    $('td').hover(function () {
      var name = $(this).closest('table').attr('id');

      var c = $(this).parent().children().index($(this));
      var r = $(this).parent().parent().children().index($(this).parent());
      if (is_playing == 0) {
        var a = $('#shape').val();
        console.log(a);
        var b = $('#h_or_v').val();
        console.log(b);
        if (name == 'user') {
          socket.emit("hover_in", { user: user_name, opponent: opponent_name, i: Number(r) + 1, j: Number(c) + 1, shape: a, h_or_v: b });
        }
      }
      //emit when hovering over i,j 
   },function () {
    var name = $(this).closest('table').attr('id');

    var c = $(this).parent().children().index($(this));
    var r = $(this).parent().parent().children().index($(this).parent());
    if (is_playing == 0) {
      var a = $('#shape').val();
      console.log(a);
      var b = $('#h_or_v').val();
      console.log(b);
      if (name == 'user') {
        socket.emit("hover_out", { user: user_name, opponent: opponent_name, i: Number(r) + 1, j: Number(c) + 1, shape: a, h_or_v: b });
      }
    }
    //emit when hovering out of i,j 
 });

    $("#start_game").click(function () {
      click.play();
      socket.emit('can game be started', { user: user_name, opponent: opponent_name });
    });
    $("#leave_game").click(function () {
      click.play();
      socket.emit('left game', { user: user_name, opponent: opponent_name });
    });
    socket.on('get-chance', function () {
      console.log('Send to opponent chance');
      if (mychance==0) {
        socket.emit('receive-chance',1);
      }
    });
    socket.on('get-time', function () {
      console.log('Send to opponent chance');
        socket.emit('receive-time',time); 
      
    });

    socket.on('set-time', function (msg) {
      time=msg;
      time=time+2;
      if(is_playing==1)
     board.changetime();
    });
    socket.on('set-chance', function (msg) {
      if (msg) {
        mychance = 1;
      }
      else {
        mychance = 0;
      }
    });
    socket.on("game_play", function (msg) {
      $("#start_game").hide();
      $('#shape').hide();
      $('#h_or_v').hide();
      // $('#leave_game').hide();
      is_playing=1;
    });
    socket.on('message to display', function (msg) {
      document.getElementById('turn').innerHTML = msg;
      if (msg == "Game Started. Your Turn")
        mychance = 1;
      if (msg == "Your turn")
        mychance = 1;
      if (msg == "Opponent's turn")
        mychance = 0;
    });

    socket.on("colour_change", function (msg) {
      console.log(msg); console.log("GERG");
      var tb = msg['table'];
      var r = msg['i'];
      var c = msg['j'];
      var r2 = Number(r) - 1;
      var c2 = Number(c) - 1;
      if (msg['color']=='brown') {swoosh.play();}
      if (msg['color'] != 'brown' && msg['color'] != 'grey' && msg['color'] != 'white' && msg['color'] != 'rgba(0,0,0,0)' && msg['color'] != 'black') {
        if (msg['color']=='red' && tb == 'user'){
          exp.play();
        }
        if (msg['color']=='green' && tb == 'user'){
          slip.play();
        }
        if (msg['color']=='red' && tb == 'opponent'){
          slip.play();
        }
        if (msg['color']=='green' && tb == 'opponent'){
          exp.play();
        }
        if (mychance == 1)
          socket.emit('update-total-time', { total_time: Number(time), user: user_name, opponent: opponent_name });
        time = 5;
        document.getElementById('time').innerHTML = time;
      }
      var v1 = Number((8 * r2)) + Number(c2); console.log(v1);
      if (tb == 'user') {
        var cell1 = $('#user').find("td").eq(v1); console.log(cell1);
        cell1.css("background-color", msg['color']);
      }
      if (tb == 'opponent') {
        var cell1 = $('#opponent').find("td").eq(v1); console.log(cell1, "opponent cell1");
        cell1.css("background-color", msg['color']);
      }
    });

    socket.on("game_started", function () {
      is_playing = 1;
      document.getElementById('time').innerHTML = time;
      console.log(time);
      board.changetime();
      console.log("time");
      console.log(time);
    });
    socket.on("shape_placed",function(msg){
      // $("#shape option[value=" + msg + "]").remove();
    })
  }

  render() {
    return (
      <div className="App">
        <div class="card">
          <div class="container">
            <div id="turn"></div>
            <div id="time"></div>
          </div>
        </div>
        <table summary="" width="300px" height="300px" border="1" className="sidexside table_of_user" id="user">
          <tr><td></td><td></td><td></td><td ></td><td></td><td></td><td></td><td></td></tr>
          <tr><td ></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
        </table>
        <table summary="" width="300px" height="300px" border="1" className="sidexside table_of_opponent" id="opponent">
          <tr><td></td><td></td><td></td><td ></td><td></td><td></td><td></td><td></td></tr>
          <tr><td ></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
        </table>
        <p id="para"></p>
        <select id="shape">
          <option value="L">L</option>
          <option value="I">I</option>
          <option value="T">T</option>
          <option value="3">3</option>
          <option value="2">2</option>
          <option value="1">1</option>
        </select>
        <select id="h_or_v">
          <option value="horizontal">horizontal</option>
          <option value="vertical">vertical</option>
        </select>
        <button id="start_game">Start Game</button>
        <button id="leave_game">Leave Game</button>
        <Chat />
      </div>
    );
  }
}
class HomePage extends React.Component {
  render() {
    return (
      <div className="container" id="root">
        <div className="header clearfix">
          <nav>
            <ul className="nav nav-pills pull-right">
              <li role="presentation" id="homeHyperlink" class="active"><a href="#">Home</a></li>
              <li role="presentation" id="addHyperLink"><a href="/home#/leaderboard">LeaderBoard</a></li>
              <li role="presentation" id="profileHyperlink"><a href="/home#/rules">Rules Book</a></li>
              <li role="presentation" id='logout'><a href="/logout">Logout</a></li>
            </ul>
          </nav>
          <h3 className="text-muted">Battleship</h3>
        </div>
        <div id="app" >
          <Router history={hashHistory}>
            <Route component={ActivePlayers} path="/"></Route>
            <Route component={LeaderBoard} path="/leaderboard"></Route>
            <Route component={RuleBook} path="/rules"></Route>
          </Router>
        </div>
      </div>
    );
  }
}

class Chat extends React.Component {
  constructor(props) {
    super(props);
    chat =this;
    this.state = {
      username: user_name,
      message: '',
      messages: []
    };
  
    this.socket = socket;

    this.socket.on('RECEIVE_MESSAGE', function (data) {
      addMessage(data);
      ding.play();
    });
    this.socket.on('get-chat', function () {
      console.log('send to opponent',chat.state.messages)
      socket.emit('receive-chat', chat.state.messages)
    });
    this.socket.on('set-msg', function (msg) {
      console.log('Received message',msg)
      chat.setState({ messages:msg });
      
    });

    const addMessage = data => {
      console.log(data);
      this.setState({ messages: [...this.state.messages, data] });
      console.log(this.state.messages);
    };

    this.sendMessage = ev => {
      ev.preventDefault();
      click.play();
      this.socket.emit('SEND_MESSAGE', {
        author: user_name,
        to_send: opponent_name,
        message: this.state.message
      })
      this.setState({ message: '' });

    }
    $('#messages').animate({scrollTop: $('#messages').prop("scrollHeight")}, 500);
  }
    componentDidMount() {
    //   var height = 0;
    //   $('#messages p').each(function(i, value){
    //   height += parseInt($(this).height());
    //     });

    //   height += '';

    // $('#messages').animate({scrollTop: height});
    // d=$('#messages');
    // d.scrollTop(d.prop("scrollHeight"));
    // $('#messages').scrollTop($('#messages').height());
    var input = document.getElementById("myInput");
    input.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("myBtn").click();
    }
});
// $('#messages').animate({
//   scrollTop: $('#messages')[0].scrollHeight}, 2000);
  $('#messages').animate({scrollTop: $('#messages').prop("scrollHeight")}, 500);    
  }
    

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-4">
            <div className="card">
              <div className="card-body">
                <div className="card-title" id="chat-name">Chat</div>
                <hr />
                <div className="messages" id="messages">
                  {this.state.messages.map(message => {
                    return (
                      <p>{message.author}: {message.message}</p>
                    )
                  })}
                </div>

              </div>
              <div className="card-footer">
                <input type="text" id="myInput" placeholder="Message" className="form-control" value={this.state.message} onChange={ev => this.setState({ message: ev.target.value })} />
                <br />
                <button id="myBtn"onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Congrats extends React.Component{
  constructor(){
    super();

  }
  render() {
    victory.play();
    return (
      <div id="congrats">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <h2>Congratulations You Won!</h2>


        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>

      </div>
    );
  }
}

class Fail extends React.Component {
  constructor() {
    super();

  }
  render() {
    mfail.play();
    return (
      <div id="congrats">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <h2>Sorry mission failed! We will get them next time. </h2>


        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>

      </div>
    );
  }
}

socket.on('render-won', function () {
  time = 5;
  ReactDOM.render(<Congrats />,
    document.getElementById('main'));
});
socket.on('render-lost', function () {
  time = 5;
  ReactDOM.render(<Fail />,
    document.getElementById('main'));
});
socket.on("render game as refresh", function (msg) {
  console.log("refreshed game page oppo",msg);
  opponent_name = msg;
  user_name=sessionStorage.getItem("myusername");
  ReactDOM.render(<Board />,document.getElementById('main'));
  socket.emit("refreshed game",{ user: sessionStorage.getItem("myusername"), opponent: opponent_name });
});

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
  ReactDOM.render(<ChallengeRequest username={msg} />,
    document.getElementById('main'));
});


socket.on('start-game', function (msg) {
  opponent_name = msg;
  ReactDOM.render(<Board />, document.getElementById('main'));
});


socket.on('set-username', function (msg) {
  user_name = msg; console.log('wefwwfcw', msg);
});

if (window.performance) {
  if (performance.navigation.type == 1) {
    socket.emit('refresh-user', user_name);
  }
};
socket.emit('home-initialized');
socket.on('render-home', function () {
  time = 5;
  ReactDOM.render(<HomePage />,
    document.getElementById('main'));
});