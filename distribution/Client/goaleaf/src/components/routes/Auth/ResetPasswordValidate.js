import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
class ResetPasswordValidate extends Component {

  render() {
    return <Redirect to={{
        pathname: '/new-password',
        token: this.props.match.params.token
    }}
/>
  }
}

export default ResetPasswordValidate;