var Router = window.ReactRouter.Router;
var Route = window.ReactRouter.Route;
var hashHistory = window.ReactRouter.hashHistory;
var browserHistory = window.ReactRouter.browserHistory;
var Link = window.ReactRouter.Link;
var socket = io('/home');
var user = null;
var show = null;
var leader = null;
var challenge = null;
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
            }.bind(this))
          }
        </tbody>
      </table>
    )
  }
};

class challengeRequest extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      username: null,
    };
    challenge=this;
    console.log("vrefc");
    // var username = this.props.username;
  }

  updateUsername(msg) {
    this.setState({ username: msg });
  }

  yes() {
    socket.emit('challenge-accepted', this.props.username);
  }
  no() {
    socket.emit('challenge-declined', this.props.username);
  }


  componentDidMount() {

    document.getElementById('homeHyperlink').className = "active";
    document.getElementById('addHyperLink').className = "";
    document.getElementById('profileHyperlink').className = "";
  }

  render() {

    return (
      <div>
        <h2>{this.props.username} thinks he can defeat you. Do you accept his challenge.</h2>
        <button type="button" onClick={yes} id="submit" name="submit" className="btn btn-primary pull-right">Yes</button>
        <button type="button" onClick={no} id="submit" name="submit" className="btn btn-primary pull-right">No</button>
      </div>

    )
  }
};

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
