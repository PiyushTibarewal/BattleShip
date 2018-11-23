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
class RuleBook extends React.Component {
 
  componentDidMount() {
    document.getElementById('addHyperLink').className = "";
    document.getElementById('homeHyperlink').className = "";
    document.getElementById('profileHyperlink').className = "active";
  }
 
  render() {
    return (
     <div>
       <h3>Rules</h3>
       <p>Battleship</p>
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
    $("#"+username).find(".mybt").hide();
    $('#'+username).find(".rqst").html("request send");
  }
  player_profile(username){
    console.log("give player info",username);
    socket.emit("give player info",username);
  }

  changePost(msg) {
    this.setState({ posts: msg });
  }
  
  
  componentDidMount() {

    socket.emit("started-home", sessionStorage.getItem('myusername'));
    document.getElementById('homeHyperlink').className = "active";
    document.getElementById('addHyperLink').className = "";
    document.getElementById('profileHyperlink').className = "";
    socket.on("display player info",function(msg){
      console.log(msg);
      console.log("YO");
      $("#"+msg['username']).find(".g_p").html(msg['games_played']);
      $("#"+msg['username']).find(".po").html(msg['points']);
      $("#"+msg['username']).toggleClass('hidden');
    });
    socket.on('request declined sendby', function (msg) {
      console.log("declined request",msg);
    

      $('#'+msg).find(".rqst").html("Sorry! "+msg+" declined your request.");
    });
  }

  render() {

    return (
    <div><p align="center"><b>Username</b></p>
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
    socket.emit('challenge-accepted', this.props.username);
  }
  no() {
    socket.emit('challenge-declined', this.props.username);
  }

  render() {

    return (
      <div>
        <h2>{this.props.username} thinks he can defeat you. Do you accept his challenge.</h2>
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
      socket.emit('can game be started', { user: user_name, opponent: opponent_name });
    });
    $("#leave_game").click(function () {
      socket.emit('left game', { user: user_name, opponent: opponent_name });
    });

    socket.on("game_play", function (msg) {
      $("#start_game").hide();
      $('#shape').hide();
      $('#h_or_v').hide();
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
      if (msg['color'] != 'brown' && msg['color'] != 'grey' && msg['color'] != 'white' && msg['color'] != 'black') {
        if(mychance==1)
          socket.emit('update-total-time',{ total_time : Number(time), user: user_name, opponent: opponent_name });
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
  }

  render() {
    return (
      <div className="App">
        <div class="card">
          <div class="container">
            <p id="turn"></p>
            <p id="time"></p>
          </div>
        </div>
        <table summary="" width="300px" height="300px" className="sidexside" id="user">
          <tr><td></td><td></td><td></td><td ></td><td></td><td></td><td></td><td></td></tr>
          <tr><td ></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
        </table>
        <table summary="" width="300px" height="300px" className="sidexside" id="opponent">
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

    this.state = {
      username: user_name,
      message: '',
      messages: []
    };

    this.socket = socket;

    this.socket.on('RECEIVE_MESSAGE', function (data) {
      addMessage(data);
    });

    const addMessage = data => {
      console.log(data);
      this.setState({ messages: [...this.state.messages, data] });
      console.log(this.state.messages);
    };

    this.sendMessage = ev => {
      ev.preventDefault();
      this.socket.emit('SEND_MESSAGE', {
        author: user_name,
        to_send: opponent_name,
        message: this.state.message
      })
      this.setState({ message: '' });

    }
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-4">
            <div className="card">
              <div className="card-body">
                <div className="card-title">Chat</div>
                <hr />
                <div className="messages">
                  {this.state.messages.map(message => {
                    return (
                      <div>{message.author}: {message.message}</div>
                    )
                  })}
                </div>

              </div>
              <div className="card-footer">
                <input type="text" placeholder="Message" className="form-control" value={this.state.message} onChange={ev => this.setState({ message: ev.target.value })} />
                <br />
                <button onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

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