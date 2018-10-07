import React from 'react'
// import React from 'react';
//  import ReactDOM from 'react-dom';
import socketIOClient from 'socket.io-client'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      endpoint: 'http://192.168.0.104:4001', uname: '', password: '' }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChange (event) {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }
  handleSubmit (event) {
    // alert('A username and password  was submitted: ' + this.state.uname + ' ' + this.state.password)
    event.preventDefault()
    // fetch('https://localhost:8080/login', {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     uname: this.state.uname,
    //     password: this.state.password
    //   })
    // })
    const socket = socketIOClient(this.state.endpoint)
    socket.emit('submit', { uname: this.state.uname, password: this.state.password })
  }
  // SetuPas (msg) {
  // }
  render () {
    const socket = socketIOClient(this.state.endpoint)
    // var name = this.state.uname
    // var pswd = this.state.password
    // var msg= JSON.stringify()
    socket.on('submit', function (msg) {
      var text = msg.uname
      var text1 = msg.password
      text = text + ' ' + text1 + ' '
      document.getElementById('root').innerHTML = text
    })
    return (
      <div>
        <div className='container'>
          <div className='card'/>
          <div className='card'>
            <h1 className='title'>Login</h1>
            <form onSubmit={this.handleSubmit}>
              <div className='input-container'>
                <input name='uname' type='text' value={this.state.uname} id='#uname' required='required'
                  onChange={this.handleChange}/>
                <label form='#unamelabel'>Username</label>
                <div className='bar' />
              </div>
              <div className='input-container'>
                <input name='password' type='password' value={this.state.password} id='#pass' required='required'
                  onChange={this.handleChange} />
                <label form='#passlabel'>Password</label>
                <div className='bar' />
              </div>
              <div className='button-container'>
                <button type='submit' value='Submit'><span>Go</span></button>
              </div>
              <div className='footer'><a href='#'>Forgot your password?</a></div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
// class App extends React.Component {
//    constructor(props) {
//      super(props)

//      this.state={
//        endpoint: 'http://192.168.0.104:4001',
//        name: ' ',pswd: ' '

//    }
//    this.handleNameChange = this.handlNameChange.bind(this);
//      this.handlePswdChange = this.handlePswdChange.bind(this);
//      this.handleSubmit = this.handleSubmit.bind(this);
//   }

//    handleNameChange(event) {
//     this.setState({name: event.target.name});
//     }
//     handlePswdChange(event) {
//       this.setState({pswd: event.target.name})
//     }

//     handleSubmit(event) {
//       alert('A username and password  was submitted: ' + this.state.name + this.state.pswd);
//       event.preventDefault();

//       // fetch('https://localhost:3000', {
//       //     method: 'POST',
//       //     headers: {
//       //         'Accept': 'application/json',
//       //         'Content-Type': 'application/json',
//       //     },
//       //     body: JSON.stringify({
//       //         name: this.state.name,
//       //         pswd: this.state.pswd,
//       //     })
//       // });
//   }
//    send = () => {
//      const socket = socketIOClient(this.state.endpoint)
//      socket.emit('submit', this.state.name, this.state.pswd)
//    }


//   render () {
//     const socket = socketIOClient(this.state.endpoint)
//     socket.on('submit', (name, pswd) => {
//       // setting the color of our button
//       var text=this.state.name
//        var text1=this.state.pswd
//        text=name+ ' ' +text1
//       document.getElementById('root').innerHTML=text

// })
//     return (
//       <form onSubmit={this.handleSubmit}>
//       <label>
//         Username:
//         <input type='text' value={this.state.name} onChange={this.handleNameChange}/>
//         </label>
//         <label>
//           Password:
//           <input type='text' value={this.state.pswd} onChange={this.handlePswdChange}/>
//         </label>
//         <button type='submit' value='Submit'><span>Go</span></button>
//         </form>
//     //     <div>
//     //     <Header titleName={'Login'}>
//     //         <div className='container'>
//     //             <div className='card'/>
//     //             <div className='card'>
//     //                 <h1 className='title'>Login</h1>
//     //                 <form onSubmit={this.handleSubmit}>
//     //                     <div className='input-container'>
//     //                         <input name='uname' type='text' value={this.state.uname} id='#uname' required='required'
//     //                                 onChange={this.handleChange}/>
//     //                         <label form='#unamelabel'>Username</label>
//     //                         <div className='bar'/>
//     //                     </div>
//     //                     <div className='input-container'>
//     //                         <input name='password' type='password' value={this.state.password} id='#pass' required='required'
//     //                                onChange={this.handleChange}/>
//     //                         <label form='#passlabel'>Password</label>
//     //                         <div className='bar'/>
//     //                     </div>
//     //                     <div className='button-container'>
//     //                         <button type='submit' value='Submit'><span>Go</span></button>
//     //                     </div>
//     //                     <div className='footer'><a href='#'>Forgot your password?</a></div>
//     //                 </form>
//     //             </div>
//     //         </div>
//     //     </Header>
//     //     <Footer/>
//     // </div>
//     )
//   }
// }

export default App

