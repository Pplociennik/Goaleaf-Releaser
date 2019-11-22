import React, { Component } from 'react'
import '../MyHabits.scss'
import axios from 'axios'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import HabitCard from '../../../routes/HabitCard/HabitCard'

class Habits extends Component {

  state = {
    habitsToShow: 20,
    habitsSortBy: 'NEWEST'
  }

  handleHabitCardClicked = id => {
    this.props.history.push(`/habit/${id}`);
  }

  handleFilter = e => {
    if (this.state.category !== e.currentTarget.value) {
      this.setState({ category: e.currentTarget.value, habitsToShow: 20 })
    }
  }

  render() {

    let habitCards = this.props.habitCards;

    habitCards.sort(function (a, b) {
      let keyA = new Date(a.startDate),
        keyB = new Date(b.startDate);
      if (keyA > keyB) return -1;
      if (keyA < keyB) return 1;
      return 0;
    });

    let foundHabits = false;
    let habits = []
    habitCards.forEach(habit => {
      foundHabits = true;
      habits.push(<HabitCard key={habit.id} id={habit.id} title={habit.title} category={habit.category} frequency={habit.frequency} startedOn={habit.startDate} private={habit.isPrivate} login={habit.creatorLogin} membersNumber={habit.membersCount} habitCardClicked={this.handleHabitCardClicked} status={this.props.status} />)

    })

    let habitsToDisplay = habits.slice(0, this.state.habitsToShow);

    if (!foundHabits) {
      habitsToDisplay = <div className="no-habits"> No challenges found</div>
    }

    if (localStorage.getItem('token')) {
      return (
        <div>
          <div className="habit-cards">
            {habitsToDisplay}
          </div>
          <button className={habitsToDisplay.length < habits.length ? 'my-habits-show-more-habits-btn' : 'my-habits-hide-show-more-habits-btn'} onClick={() => this.setState({ habitsToShow: this.state.habitsToShow + 20 })}>SHOW MORE</button>
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

export default withRouter(connect(mapStateToProps)(Habits));