import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Home extends Component{
  render(){
    return(
      <h1>"HI"</h1>
    );
  }
}

ReactDOM.render(
//     <Router history={hashHistory}>
//         <Route component={ShowPost} path="/"></Route>
//         <Route component={AddPost} path="/addPost"></Route>
// </Router>,
<Home />,
document.getElementById('home'));