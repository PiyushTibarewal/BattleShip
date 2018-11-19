var Router = window.ReactRouter.Router;
var Route = window.ReactRouter.Route;
var hashHistory = window.ReactRouter.hashHistory;
var Link = window.ReactRouter.Link;
class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.signIn = this.signIn.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.state = {
      username: '',
      password: ''
    };
  }
  signIn() {
    axios.post('/signin', {
      username: this.state.username,
      password: this.state.password
    })
      .then(function (response) {
        if (response.data) {
          localStorage.setItem('myusername', response.data);
          window.location.assign('http://10.196.6.163:7777/home');
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  handleNameChange(e) {
    this.setState({ username: e.target.value })
  }
  handlePasswordChange(e) {
    this.setState({ password: e.target.value })
  }
  render() {
    return (
      <div>
        <form className="form-signin">
          <h2 className="form-signin-heading">Please sign in</h2>
          <label for="inputUsername" className="sr-only">Username</label>
          <input type="name" onChange={this.handleNameChange} id="inputUsername" className="form-control" placeholder="Name" required autofocus />
          <label for="inputPassword" className="sr-only">Password</label>
          <input type="password" onChange={this.handlePasswordChange} id="inputPassword" className="form-control" placeholder="Password" required />

          <button className="btn btn-lg btn-primary btn-block" onClick={this.signIn} type="button">Sign in</button>
        </form>
        <div>
          <Link to="/signup">{'Signup'}</Link>
        </div>
      </div>

    )
  }
}

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.signUp = this.signUp.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.state = {
      username: '',
      password: ''
    };
  }
  handleNameChange(e) {
    this.setState({ username: e.target.value })
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value })
  }
  signUp() {
    axios.post('/signup', {
      username: this.state.username,
      password: this.state.password
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  render() {
    return (
      <div>
        <form className="form-signin">
          <h2 className="form-signin-heading">Please sign up</h2>
          <label for="inputName" className="sr-only">Username</label>
          <input type="name" onChange={this.handleNameChange} id="inputfirstName" className="form-control" placeholder="Name" required autofocus />
          <label for="inputPassword" className="sr-only">Password</label>
          <input type="password" onChange={this.handlePasswordChange} id="inputPassword" className="form-control" placeholder="Password" required />

          <button className="btn btn-lg btn-primary btn-block" onClick={this.signUp} type="button">Sign up</button>
        </form>
        <div>
          <Link to="/">{'Signin'}</Link>
        </div>
      </div>

    )
  }
}

ReactDOM.render(
  <Router history={hashHistory}>
    <Route component={Signin} exact path="/"></Route>
    <Route component={Signup} path="/signup"></Route>
  </Router>,
  document.getElementById('app'));