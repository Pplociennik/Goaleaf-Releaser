import React, { Component } from 'react'
import './Auth.scss'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'

class SignIn extends Component {

  state = {
    login: '',
    email: '',
    password: '',
    repeat_password: '',
    errorMsg: ''
  }
  handleChange = e => {
    this.setState({[e.target.id]: e.target.value})
  }
  handleSubmit = e => {
    e.preventDefault();

    if (this.state.login.trim() === '' || this.state.email.trim() === '' || this.state.password === '' || this.state.repeat_password === ''){
      this.setState({errorMsg: 'Please complete the form'});
      return;
    }

    this.setState({errorMsg: 'waiting'})

    axios.post(`/register`, {
        "emailAddress": this.state.email,
        "login": this.state.login,
        "matchingPassword": this.state.repeat_password,
        "password": this.state.password,
        "userName": ""
      })
      .then(res => {
        axios.post('/login', {
          "Token": "",
          "login": this.state.login,
          "password": this.state.password
        })
        .then(res => {
                      localStorage.setItem('token', res.data);
                      this.props.history.push('/');
                      window.location.reload();
                     }
        ).catch(err => this.setState({errorMsg: err.response.data.message}))
    }
     ).catch(err => this.setState({errorMsg: err.response.data.message}));
  }

  render() {
      let errorMsg = <div className="error-msg">{ this.state.errorMsg }</div>
      if (this.state.errorMsg === 'waiting') {
        errorMsg = <div className="waiting-msg"></div>
      }

    if (!localStorage.getItem('token')){
    return (
      <div className="auth-container">
      <form className="auth-form" onSubmit={ this.handleSubmit } autoComplete="off">
        <h1 className="auth-title"> Sign In </h1>
          <input className="auth-input" type="text" id="login" placeholder="login" onChange={ this.handleChange } /> 
          <input className="auth-input" type="email" id="email" placeholder="email" onChange={ this.handleChange } />
          <input className="auth-input" type="password" id="password" placeholder="password" onChange={ this.handleChange } />
          <input className="auth-input" type="password" id="repeat_password" placeholder="repeat password" onChange={ this.handleChange } />
        { errorMsg }
          <div className="auth-buttons">
            <input className="auth-btn" type="submit" value="Sign in" />
            <Link to='/login'><input className="auth-btn" type="button" value="Log in" /></Link>
          </div>
      </form>
      </div>
    )} else {
      return <Redirect  to='/'/>
    }
  }
}

export default SignIn;
