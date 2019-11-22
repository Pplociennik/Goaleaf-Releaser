import React, { Component } from 'react'
import './BrowseHabits.scss'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import HabitCard from './../../routes/HabitCard/HabitCard'

class BrowseHabits extends Component {

  state = {
      category: "ALL",
      habitCards: [],
      habitsToShow: 20,
      habitsSortBy: 'NEWEST'
  }

  handleHabitCardClicked = id => {
    this.props.history.push(`/habit/${id}`);
  }
  
  handleFilter = e => {
    if(this.state.category !== e.currentTarget.value){
      this.setState({category: e.currentTarget.value, habitsToShow: 20})
    }
  }

  render() {
    let habitCards = this.props.habits;

    habitCards.sort(function(a, b){
      let keyA = new Date(a.habitStartDate),
          keyB = new Date(b.habitStartDate);
      if(keyA > keyB) return -1;
      if(keyA < keyB) return 1;
      return 0;
  });

  if(this.state.habitsSortBy === 'POPULAR'){
      habitCards.sort(function(a, b){
        let keyA = a.members.length,
            keyB = b.members.length;  
        if(keyA > keyB) return -1;
        if(keyA < keyB) return 1;
        return 0;
    });
  }

      let foundHabits = false;
      let habits = []
      console.log(habitCards)
      habitCards.forEach(habit => {

          if(!habit.private && !habit.members.find(member => member === this.props.userLogged) && (this.state.category === 'ALL' || habit.category === this.state.category)){
          foundHabits = true;
          habits.push(<HabitCard key={ habit.id } id={ habit.id } title={ habit.title } category={ habit.category } frequency={ habit.frequency } startedOn={ habit.startDate } private={ habit.isPrivate } login={habit.owner.login} membersNumber={habit.members.length} habitCardClicked={ this.handleHabitCardClicked } />)
          }
      })

        let habitsToDisplay = habits.slice(0, this.state.habitsToShow);


      if(!foundHabits){
     habitsToDisplay = <div className="no-habits"> No challenges were found</div>
      }


    return (
      <section className="browse-habits">
      <h1 className="browse-habits-title" >Browse challenges</h1>
      <div className="browse-habits-navigation">
        <div className="browse-habits-navigation-filters">
            <button className={this.state.category === 'ALL' ? 'category all-chosen all' : ' category all'} value="ALL" onClick={ this.handleFilter }>all</button>
            <button className={this.state.category === 'NONE' ? 'category none-chosen none' : ' category none'} value="NONE" onClick={ this.handleFilter }><i className="fas fa-minus fa-lg"></i></button>
            <button className={this.state.category === 'DIET' ? 'category diet-chosen diet' : 'category diet'} value="DIET" onClick={ this.handleFilter }><i className="fas fa-carrot fa-lg"></i></button>
            <button className={this.state.category === 'SPORT' ? 'category sport-chosen sport' : 'category sport'} value="SPORT" onClick={ this.handleFilter }><i className="fas fa-running fa-lg"></i></button>  
            <button className={this.state.category === 'HEALTH' ? 'category health-chosen health' : 'category health'} value="HEALTH" onClick={ this.handleFilter }><i className="fas fa-heartbeat fa-lg"></i></button>
            <button className={this.state.category === 'STUDY' ? 'category study-chosen study' : 'category study'} value="STUDY" onClick={ this.handleFilter }><i className="fas fa-book fa-lg"></i></button>
            <button className={this.state.category === 'WORK' ? 'category work-chosen work' : 'category work'} value="WORK" onClick={ this.handleFilter }><i className="fas fa-briefcase fa-lg"></i></button>
            <button className={this.state.category === 'MONEY' ? 'category money-chosen money' : 'category money'} value="MONEY" onClick={ this.handleFilter }><i className="fas fa-money-bill-alt fa-lg"></i></button>
            <button className={this.state.category === 'SOCIAL' ? 'category social-chosen social' : 'category social'} value="SOCIAL" onClick={ this.handleFilter }><i className="fas fa-heart fa-lg"></i></button>
            <button className={this.state.category === 'FAMILY' ? 'category family-chosen family' : 'category family'} value="FAMILY" onClick={ this.handleFilter }><i className="fas fa-home fa-lg"></i></button>
        </div>
        <div className="browse-habits-navigation-sorting">
          <button className={this.state.habitsSortBy === 'NEWEST' ? "habit-cards-sort-btn active-habit-cards-sort-btn" : "habit-cards-sort-btn inactive-habit-cards-sort-btn"} onClick={() => this.setState({habitsSortBy: 'NEWEST', habitsToShow: 20})}><i className="far fa-calendar-alt"></i> NEWEST</button>
          <button className={this.state.habitsSortBy === 'POPULAR' ? "habit-cards-sort-btn active-habit-cards-sort-btn" : "habit-cards-sort-btn inactive-habit-cards-sort-btn"} onClick={() => this.setState({habitsSortBy: 'POPULAR', habitsToShow: 20})}><i className="fas fa-user-friends"></i> POPULAR</button>
        </div>      
      </div>
      <div className="habit-cards">
          { habitsToDisplay }
      </div>
      <button className={habitsToDisplay.length < habits.length ? 'show-more-habits-btn' : 'hide-show-more-habits-btn'} onClick={() => this.setState({habitsToShow: this.state.habitsToShow + 20})}>SHOW MORE</button>
      </section>
    )
  }   
}

const mapStateToProps = state => {
  return {
    habits: state.habits,
    userLogged: state.userLogged
  }
}

export default withRouter(connect(mapStateToProps)(BrowseHabits));