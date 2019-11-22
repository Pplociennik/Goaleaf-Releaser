import React, { Component } from 'react'
import './NewHabit.scss'
import { connect } from 'react-redux';
import axios from 'axios';

class NewHabit extends Component {

  state = {
    title: '',
    startsOn: new Date(),
    category: 'NONE',
    invite: [],
    private: false,
    recurrence: 'daily',
    errorMsg: ''
  }

  handleSubmit = e => {
    e.preventDefault();
    console.log(this.state);
    console.log(localStorage.getItem('token'))
    axios.post('/api/habits/new-habit', {

          "category": this.state.category,
          "frequency": "Daily",
          "isPrivate": this.state.private,
          "members": [
            {
              "userID": this.props.userLogged
            }
          ],
          "title": this.state.title,
          "token": localStorage.getItem('token')
        }
    )
    .then(res => {
                  console.log(res);
                  this.props.history.push('/');
                  window.location.reload();
                 }
    ).catch(err => {
                    this.setState({errorMsg: err.response.data.message});
                    console.log(err.response.data.message)
     } )

  }
  handleChange = e => {
    this.setState({[e.target.id]: e.target.value})
  }
  handleChangeCategory = e => {
    this.setState({category: e.currentTarget.value})


  }
  handleChangePrivacy = e => {
    e.currentTarget.value === 'private' ? this.setState({private: true}) : this.setState({private: false});
  }

  render() {
    let errorMsg = <div className="error-msg">{ this.state.errorMsg }</div>
    
    return (
      <div className="new-habit">
        <form className="new-habit-form" onSubmit={ this.handleSubmit } autoComplete="off" >
          <h1 className="new-habit-title">New challenge</h1>
          <input className="new-habit-title-input" type="text" id="title" placeholder="title" onChange={ this.handleChange } maxLength="49" autoFocus />
          <div className="new-habit-categories">
            <button className={this.state.category === 'NONE' ? 'new-habit-category none-chosen none' : ' new-habit-category none'} value="NONE" type="button" onClick={ this.handleChangeCategory }><i className="fas fa-minus fa-lg"></i></button>
            <button className={this.state.category === 'DIET' ? 'new-habit-category diet-chosen diet' : 'new-habit-category diet'} value="DIET" type="button" onClick={ this.handleChangeCategory }><i className="fas fa-carrot fa-lg"></i></button>
            <button className={this.state.category === 'SPORT' ? 'new-habit-category sport-chosen sport' : 'new-habit-category sport'} value="SPORT" type="button" onClick={ this.handleChangeCategory }><i className="fas fa-running fa-lg"></i></button>  
            <button className={this.state.category === 'HEALTH' ? 'new-habit-category health-chosen health' : 'new-habit-category health'} value="HEALTH" type="button" onClick={ this.handleChangeCategory }><i className="fas fa-heartbeat fa-lg"></i></button>
            <button className={this.state.category === 'STUDY' ? 'new-habit-category study-chosen study' : 'new-habit-category study'} value="STUDY" type="button" onClick={ this.handleChangeCategory }><i className="fas fa-book fa-lg"></i></button>
            <button className={this.state.category === 'WORK' ? 'new-habit-category work-chosen work' : 'new-habit-category work'} value="WORK" type="button" onClick={ this.handleChangeCategory }><i className="fas fa-briefcase fa-lg"></i></button>
            <button className={this.state.category === 'MONEY' ? 'new-habit-category money-chosen money' : 'new-habit-category money'} value="MONEY" type="button" onClick={ this.handleChangeCategory }><i className="fas fa-money-bill-alt fa-lg"></i></button>
            <button className={this.state.category === 'SOCIAL' ? 'new-habit-category social-chosen social' : 'new-habit-category social'} value="SOCIAL" type="button" onClick={ this.handleChangeCategory }><i className="fas fa-heart fa-lg"></i></button>
            <button className={this.state.category === 'FAMILY' ? 'new-habit-category family-chosen family' : 'new-habit-category family'} value="FAMILY" type="button" onClick={ this.handleChangeCategory }><i className="fas fa-home fa-lg"></i></button>
          </div>
          <div className="privacy-con">
            <button className={this.state.private === false ? 'privacy-btn privacy-chosen' : 'privacy-btn'} type="button" value="public" onClick={ this.handleChangePrivacy }><i className="fas fa-lock-open fa-sm"></i> Public</button>
            <button className={this.state.private === true ? 'privacy-btn privacy-chosen' : 'privacy-btn'} type="button" value="private" onClick={ this.handleChangePrivacy }><i className="fas fa-lock fa-sm"></i> Private</button>
          </div>
          <input className="new-habit-submit-btn" type="submit" value="Create challenge" />
          { errorMsg }
        </form>
      </div>
    )
  } 
}

const mapStateToProps = state => {
  return {
    userLogged: state.userLogged
  }
}

export default connect(mapStateToProps)(NewHabit);