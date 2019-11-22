import React, { Component } from 'react'
import './Auth.scss'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'

class ResetPassword extends Component {

  state = {
    password: '',
    repeat_password: '',
    token: this.props.location.token,
    errorMsg: ''
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }
  handleSubmit = e => {
    e.preventDefault();
    if (this.state.password === '' || this.state.repeat_password === ''){
      this.setState({errorMsg: 'Please complete the form'});
      return;
    }

    axios.post('/api/users/setnewpassword', {
      
      "matchingPassword": this.state.password,
      "password": this.state.repeat_password, 
      "token": this.state.token
  })
  .then(res => {
                this.setState({errorMsg: 'Password changed'})
               }
  ).catch(err => this.setState({errorMsg: err.response.data.message}))
  }

  render() {

    let errorMsg = <div className="error-msg">{ this.state.errorMsg }</div>
    if (this.state.errorMsg === 'Password changed') {
      errorMsg = <div className="success-msg">{ this.state.errorMsg}</div>
    }

    if (!localStorage.getItem('token')){    
    return (
      <div className="auth-container">
      <form className="auth-form" onSubmit={ this.handleSubmit } autoComplete="off">
        <h1 className="auth-title" > New password </h1>
          <input className="auth-input" type="password" id="password" placeholder="password" onChange={ this.handleChange } />
          <input className="auth-input" type="password" id="repeat_password" placeholder="repeat password" onChange={ this.handleChange } />
        { errorMsg }
          <div className="auth-buttons">
            <input className="auth-btn" type="submit" value="Submit" />
            <Link to='/login'><input className="auth-btn" type="button" value="Log in" /></Link>
          </div>
      </form>
      </div>
    )} else {
      return <Redirect  to='/'/>
    }
  }
}

export default ResetPassword;
  