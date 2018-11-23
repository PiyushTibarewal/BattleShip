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
        if(response.data=="Failure"){
          alert("Provided login credentials are wrong.Please login again.");
        }
        else if (response.data) {
          sessionStorage.setItem('myusername', response.data);
          var ip = 'http://'+window.location.hostname+':7777/home';
          window.location.assign(ip);
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
      <div >
      <div className='split left row'>
          <div id="div1" className="col-sm-3"><center><b>THE</b></center></div>
          <div id="div2" className="col-sm-3"><center><b>FAST</b></center></div>
          <div id="div3" className="col-sm-3"><center><b>AND</b></center></div>
          <div id="div4" className="col-sm-3"><center><b>CURIOUS</b></center></div>
        
      </div>
      <div className="split right" id="signin_right">
        <div className="centered" id="signin_back">
          <div className="row">
            <div className="col-sm-1"></div>
              <div className="col-sm-5" id="in_signin"><Link to="/"> {'Signin'}</Link></div>
              <div className="col-sm-5" id="in_signup"><Link to="/signup">{'SignUp'}</Link></div>
              </div>  
        <form className="form-signin" onsubmit={this.signIn}>
          
          <br></br><label for="inputUsername" className="sr-only">Username</label>
          <input type="name" onChange={this.handleNameChange} id="inputUsername" className="form-control" placeholder="Name" required autofocus />
          <br></br>
          <label for="inputPassword" className="sr-only">Password</label>
          <input type="password" onChange={this.handlePasswordChange} id="inputPassword" className="form-control" placeholder="Password" required />
          <br></br>
          <button className="btn btn-lg btn-primary btn-block rounded" onClick={this.signIn} type="button">Sign in</button>
        </form>
      </div>
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
        if(response.data=="Failure"){
          alert("Please provide the full credentials");  
        }
        else if(response.data=="Fail"){
          alert("This username is already taken");
        }
        else{
          alert("successfully signed up");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  render() {
    return (
      <div>
      <div className='split left row'>
          <div id="div1" className="col-sm-3">The</div>
          <div id="div2" className="col-sm-3">Fast</div>
          <div id="div3" className="col-sm-3">And</div>
          <div id="div4" className="col-sm-3">Curious</div>
        
      </div>
      <div className="split right" id="signup_right">
        <div className="centered" id="signup_back" >
          <div className="row">
            <div className="col-sm-1"></div>
              <div className="col-sm-5" id="up_signin"><Link to="/"> {'Signin'}</Link></div>
              <div className="col-sm-5" id="up_signup"><Link to="/signup">{'SignUp'}</Link></div>
              </div>
        <form className="form-signin" onsubmit={this.signUp}>
          
        <br></br><label for="inputName" className="sr-only">Username</label>
          <input type="name" onChange={this.handleNameChange} id="inputfirstName" className="form-control" placeholder="Name" required autofocus />
          <br></br>
          <label for="inputPassword" className="sr-only">Password</label>          
          <input type="password" onChange={this.handlePasswordChange} id="inputPassword" className="form-control" placeholder="Password" required />
            <br></br>
          <button className="btn btn-lg btn-primary btn-block rounded" onClick={this.signUp} type="button">Sign up</button>
        </form>
      </div>
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