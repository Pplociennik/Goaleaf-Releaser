import React, { Component } from 'react'
import './Auth.scss'
import { Link, Redirect} from 'react-router-dom'
import axios from 'axios'

class ResetPassword extends Component {

  state = {
    email: '',
    errorMsg: ''
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }
  handleSubmit = e => {
    e.preventDefault();
    if (this.state.email.trim() === ''){
      this.setState({errorMsg: 'Please complete the form'});
      return;
    }

    this.setState({errorMsg: 'waiting'})

    axios.post('/api/users/resetpassword', {
      
        "emailAddress": this.state.email
    })
    .then(res => {
                  this.setState({errorMsg: 'Please check your email'})
                 }
    ).catch(err => this.setState({errorMsg: err.response.data.message}))
  }

  render() {
    let errorMsg = <div className="error-msg">{ this.state.errorMsg }</div>
      if (this.state.errorMsg === 'Please check your email') {
        errorMsg = <div className="success-msg">{ this.state.errorMsg}</div>
      }
      if (this.state.errorMsg === 'waiting') {
        errorMsg = <div className="waiting-msg"></div>
      }

      if (!localStorage.getItem('token')){    
      return (
      <div className="auth-container">
      <form className="auth-form" onSubmit={ this.handleSubmit } autoComplete="off">
        <h1 className="auth-title"> Reset password </h1>
          <input className="auth-input" type="email" id="email" placeholder="email" onChange={ this.handleChange } />
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
