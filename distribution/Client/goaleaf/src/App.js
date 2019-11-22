import React, { Component } from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import './App.scss';
import Navbar from './components/containers/Navbar/Navbar';
import Main from './components/containers/Main/Main';
import Loader from './components/routes/Loader/Loader'
import { BrowserRouter } from 'react-router-dom';
import {fetchHabits} from './js/state';
import {fetchUsers} from './js/state';
import {fetchMembers} from './js/state';
import {isLoaded} from './js/state';
import { connect } from 'react-redux'
import axios from 'axios';

class App extends Component {

  componentDidMount() {

    axios.post('/validatetoken', {
      "Token": localStorage.getItem('token')
    }).then(res => { this.props.validateUser() }
     ).catch(err => { this.props.invalidateUser()})

     // TEMPORARY CALLS
    Promise.all([
    this.props.fetchHabits(),
    this.props.fetchMembers(),
    this.props.fetchUsers(),
    ]).then(() => this.props.isLoaded() )
  }
  render() {
    if(this.props.isLoading){
      return(
        <BrowserRouter>
        <div className="App">
          <Navbar />
          <Loader />
        </div>
      </BrowserRouter>
      )
    }

    // TEMPORARY ACTION, WILL CHANGE THAT AFTER SERVER CHANGES
    this.props.habits.forEach(habit => {
      habit.members = [];
      habit.owner = this.props.users.find(user => habit.creatorID === user.id)
      if(habit.owner === undefined){
        habit.owner = {login: 'user deleted'}
      }
      this.props.members.forEach(member => {
        if(habit.id === member.habitID){
          habit.members.push(member.userID)
        }
      })
    })
    this.props.habits.forEach(habit => {
      habit.membersObj = [];
      habit.members.forEach(memberId => habit.membersObj.push(this.props.users.find(user => memberId === user.id)
    ))});

    
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Main />
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => {
  return {
    habits: state.habits,
    users: state.users,
    members: state.members,
    isLoading: state.isLoading
  }
}

const mapDispatchToProps = dispatch => ({
  validateUser: () => dispatch({ type: 'VALIDATE_USER', token: localStorage.getItem('token')}),
  invalidateUser: () => dispatch({ type: 'INVALIDATE_USER' }),
  fetchHabits: () => dispatch(fetchHabits()),
  fetchMembers: () => dispatch(fetchMembers()),
  fetchUsers: () => dispatch(fetchUsers()),
  isLoaded: () => dispatch(isLoaded())

})

export default connect(mapStateToProps, mapDispatchToProps)(App);
