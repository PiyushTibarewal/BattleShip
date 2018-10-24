var Router = window.ReactRouter.Router;
var Route = window.ReactRouter.Route;
var hashHistory = window.ReactRouter.hashHistory;
var Link = window.ReactRouter.Link;

class Signin extends React.Component {
    constructor(props) {
      super(props);
      this.signIn = this.signIn.bind(this);
      this.handleEmailChange = this.handleEmailChange.bind(this);
      this.handlePasswordChange = this.handlePasswordChange.bind(this);
      this.state = {
        email:'',
        password:''
      };
    }
    signIn(){
      axios.post('/signin', {
        email: this.state.email,
        password: this.state.password
      })
      .then(function (response) {
        if(response.data == 'success'){
          window.location.assign('http://localhost:5000/api')
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }
    handleEmailChange(e){
      this.setState({email:e.target.value})
    }
    handlePasswordChange(e){
      this.setState({password:e.target.value})
    }
    render() {
      return (
        <div>
          <form className="form-signin">
            <h2 className="form-signin-heading">Please sign in</h2>
            <label for="inputEmail" className="sr-only">Email address</label>
            <input type="email" onChange={this.handleEmailChange} id="inputEmail" className="form-control" placeholder="Email address" required autofocus />
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

class Signup extends React.Component{
  constructor(props) {
    super(props);
    this.signUp = this.signUp.bind(this);
    this.handlefirstNameChange = this.handlefirstNameChange.bind(this);
    this.handlelastNameChange = this.handlelastNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.state = {
      first_name:'',
      last_name:'',
      email:'',
      password:''
    };
  }
  handlefirstNameChange(e){
    this.setState({first_name:e.target.value})
  }
  handlelastNameChange(e){
    this.setState({last_name:e.target.value})
  }
  handleEmailChange(e){
    this.setState({email:e.target.value})
  }
  handlePasswordChange(e){
    this.setState({password:e.target.value})
  }
  signUp(){
    axios.post('/register', {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
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
            <label for="inputName" className="sr-only">first Name</label>
            <input type="name" onChange={this.handlefirstNameChange} id="inputfirstName" className="form-control" placeholder="Name" required autofocus />
            <label for="inputName" className="sr-only">last Name</label>
            <input type="name" onChange={this.handlelastNameChange} id="inputlastName" className="form-control" placeholder="Name" required autofocus />
            <label for="inputEmail" className="sr-only">Email address</label>
            <input type="email" onChange={this.handleEmailChange} id="inputEmail" className="form-control" placeholder="Email address" required autofocus />
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
        <Route component={Signin} path="/login"></Route>
        <Route component={Signup} path="/register"></Route>
    </Router>,
document.getElementById('app'));