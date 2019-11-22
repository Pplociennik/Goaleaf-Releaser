import React, { Component } from 'react'
import './MyHabits.scss'
import axios from 'axios'
import Habits from './Habits/Habits'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import HabitCard from './../../routes/HabitCard/HabitCard'

class MyHabits extends Component {

  state = {
    habitCardsFinished: [],
    habitCardsUnfinished: [],
    habitCardsWon: []
  }

  componentDidMount() {
    axios.get(`/api/users/myFinishedHabits?userID=${this.props.userLogged}`)
    .then(res => {
        this.setState({
          habitCardsFinished: res.data
        })
    }).catch(err => console.log(err.response.data.message))

    axios.get(`/api/users/myUnfinishedHabits?userID=${this.props.userLogged}`)
    .then(res => {
        this.setState({
          habitCardsUnfinished: res.data
        })
    }).catch(err => console.log(err.response.data.message))

    axios.get(`/api/users/myWonHabits?userID=${this.props.userLogged}`)
    .then(res => {
        this.setState({
          habitCardsWon: res.data
        })
    }).catch(err => console.log(err.response.data.message))
  }

  render() {
    if (localStorage.getItem('token')) {
      return (
        <div>
        <section className="my-habits">
          <h1 className="my-habits-title" >My active challenges</h1>
          <Habits habitCards={this.state.habitCardsUnfinished} status="active" />
        </section>
        <section className="my-habits">
          <h1 className="my-habits-title" >My won challenges</h1>
          <Habits habitCards={this.state.habitCardsWon} status="won" />
        </section>
        <section className="my-habits">
          <h1 className="my-habits-title" >My ended challenges</h1>
          <Habits habitCards={this.state.habitCardsFinished} status="ended" />
        </section>
        </div>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = state => {
  return {
    habits: state.habits,
    users: state.users,
    members: state.members,
    userLogged: state.userLogged

  }
}

export default withRouter(connect(mapStateToProps)(MyHabits));