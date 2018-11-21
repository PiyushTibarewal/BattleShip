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
// import $ from 'jquery';
class ShowProfile extends React.Component {
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.state = {
      name: '',
      email: '',
      password: '',
      id: ''
    };

  }
  componentDidMount() {
    document.getElementById('addHyperLink').className = "";
    document.getElementById('homeHyperlink').className = "";
    document.getElementById('profileHyperlink').className = "active";
    this.getProfile();
  }
  updateProfile() {

    var self = this;
    axios.post('/updateProfile', {
      name: this.state.name,
      password: this.state.password
    })
      .then(function (response) {
        if (response) {
          hashHistory.push('/')
        }
      })
      .catch(function (error) {
        console.log('error is ', error);
      });
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value })
  }
  handlePasswordChange(e) {
    this.setState({ password: e.target.value })
  }

  getProfile() {
    var self = this;
    axios.post('/getProfile', {
    })
      .then(function (response) {
        if (response) {
          self.setState({ name: response.data.name });
          self.setState({ email: response.data.email });
          self.setState({ password: response.data.password });
        }
      })
      .catch(function (error) {
        console.log('error is ', error);
      });
  }

  render() {
    return (
      <div className="col-md-5">
        <div className="form-area">
          <form role="form">
            <br styles="clear:both" />
            <div className="form-group">
              <input value={this.state.name} type="text" onChange={this.handleNameChange} className="form-control" placeholder="Name" required />
            </div>
            <div className="form-group">
              <input value={this.state.password} type="password" onChange={this.handlePasswordChange} className="form-control" placeholder="Password" required />
            </div>
            <button type="button" onClick={this.updateProfile} id="submit" name="submit" className="btn btn-primary pull-right">Update</button>
          </form>
        </div>
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
            <th>Games Won</th>
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
                {/* <td>
                  <span onClick={this.updatePost.bind(this, post.username)} className="glyphicon glyphicon-pencil"></span>
                </td> */}
                {/* <td>
                  <span onClick={this.deletePost.bind(this, post.id)} className="glyphicon glyphicon-remove"></span>
                </td> */}
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
    this.state = {
      posts: [],
    };
    show = this;
  }

  updatePost(username) {
    console.log("request sent to", username)
    socket.emit("send-request", username);
  }

  changePost(msg) {
    this.setState({ posts: msg });
  }

  componentDidMount() {

    socket.emit("started-home", localStorage.getItem('myusername'));
    document.getElementById('homeHyperlink').className = "active";
    document.getElementById('addHyperLink').className = "";
    document.getElementById('profileHyperlink').className = "";
  }

  render() {

    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            {/* <th></th>
            <th></th> */}
          </tr>
        </thead>
        <tbody>
          {
            this.state.posts.map(function (post, index) {
              if(post.username != user_name){
              return <tr key={index} >
                <td>{index + 1}</td>
                <td>{post.username}</td>
                <td>
                  <span onClick={this.updatePost.bind(this, post.username)} className="glyphicon glyphicon-pencil"></span>
                </td>
                {/* <td>
                  <span onClick={this.deletePost.bind(this, post.id)} className="glyphicon glyphicon-remove"></span>
                </td> */}
              </tr>
              }
            }.bind(this))
          }
        </tbody>
      </table>
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
     $("#start_game").click(function() {
       socket.emit('can game be started',{user: user_name, opponent: opponent_name});
     });
     socket.on("game_play",function(msg){
      $("#start_game").hide();
      $('#shape').hide();
      $('#h_or_v').hide();
     });

     socket.on('message to display',function(msg){
       document.getElementById('turn').innerHTML=msg;
     })

     

      socket.on("colour_change", function (msg) {
        console.log(msg);console.log("GERG");
        var tb = msg['table'];
        var r = msg['i'];
        var c = msg['j'];
        var r2 = Number(r)-1;
        var c2 = Number(c)-1;
        var v1 = Number((8 * r2)) + Number(c2);console.log(v1);
        if (tb == 'user') {
          var cell1 = $('#user').find("td").eq(v1);console.log(cell1);
          cell1.css("background-color", msg['color']);
          document.getElementById('turn').innerHTML="Opponent's turn";
        }
        if (tb == 'opponent') {
          var cell1 = $('#opponnet').find("td").eq(v1);
          cell1.css("background-color", msg['color']);
          document.getElementById('turn').innerHTML="Your turn";
        }
      });
    }
  
  render() {
    return (
      <div className="App">
        <div class="card">
          <div class="container">
            <p id="turn"></p>
          </div>
        </div>
        <table summary="" width="40%" height="40%" class="sidexside" id="user">
          <tr><td></td><td></td><td></td><td ></td><td></td><td></td><td></td><td></td></tr>
          <tr><td ></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
        </table>
        <table summary="" width="40%" height="40%" class="sidexside" id="opponent">
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
      </div>
    );
  }
}
class HomePage extends React.Component {
  render() {return(
    <div class="container" id="root">
      <div class="header clearfix">
        <nav>
          <ul class="nav nav-pills pull-right">
            <li role="presentation" id="homeHyperlink" class="active"><a href="#">Home</a></li>
            <li role="presentation" id="addHyperLink"><a href="/home#/addPost">LeaderBoard</a></li>
            <li role="presentation" id="profileHyperlink"><a href="/home#/showProfile">Profile</a></li>
            <li role="presentation" id='logout'><a href="/logout">Logout</a></li>
          </ul>
        </nav>
        <h3 class="text-muted">Battleship</h3>
      </div>
      <div id="app" >
        <Router history={hashHistory}>
          <Route component={ActivePlayers} path="/"></Route>
          <Route component={LeaderBoard} path="/addPost(/:id)"></Route>
          <Route component={ShowProfile} path="/showProfile"></Route>
        </Router>
      </div>
    </div>
  );}
}
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

socket.on('request declined sendby', function (msg) {
  alert("Sorry! " + msg + " declined your challenge request");
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
  ReactDOM.render(<HomePage />,
    document.getElementById('main'));
});