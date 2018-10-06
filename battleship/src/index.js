import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class NameForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {name: '',pswd: ''};
  
      this.handleNameChange = this.handleNameChange.bind(this);
      this.handlePswdChange = this.handlePswdChange.bind(this);

      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleNameChange(event) {
      this.setState({name: event.target.value});
    }
    handlePswdChange(event) {
        this.setState({pswd: event.target.value});
      }
  
    handleSubmit(event) {
      alert('A name was submitted: ' + this.state.value);
      event.preventDefault();
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            UserName:
            <input type="text" value={this.state.name} onChange={this.handleNameChange} />
          </label>
          <label>
            Password:
            <input type="text" value={this.state.pswd} onChange={this.handlePswdChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      );
    }
  }
 
  ReactDOM.render(
    <NameForm />,
    document.getElementById('root')
  );