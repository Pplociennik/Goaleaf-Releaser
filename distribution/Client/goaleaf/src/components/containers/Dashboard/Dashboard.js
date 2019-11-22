import React, { Component } from 'react'
import './Dashboard.scss'
import {Redirect} from 'react-router-dom'
import { connect } from 'react-redux'
import BrowseHabits from './../BrowseHabits/BrowseHabits'
import MyHabits from './../MyHabits/MyHabits'
import Notifications from './../../routes/Notifications/Notifications'

class Dashboard extends Component {
  render() {
    if (this.props.authenticated) {
    return (
      <div className="dashboard">
        <Notifications />
        <MyHabits />
      </div>
    ) } else return (
      <Redirect to='/browse' />
    )
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.authenticated,
    userLogged: state.userLogged
  }
}

export default connect(mapStateToProps)(Dashboard);
