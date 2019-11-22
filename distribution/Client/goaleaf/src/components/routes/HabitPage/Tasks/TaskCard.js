import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import Popup from "reactjs-popup"
import './TaskCard.scss';
import {addPost} from './../../../../js/state';
import M from "materialize-css";
import {changeDateFormat1} from '../../../../js/helpers';
import { Dropdown } from 'react-materialize';
import MoreIcon from './../../../../assets/more.png';

class TaskCard extends Component {

    state = {
        taskComment: ''
    }

    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    completeTask = (e, id) => {
        e.preventDefault();
        axios.post('/api/tasks/complete', {
            "comment": this.state.taskComment,
            "habitID": this.props.habitID,
            "taskID": id,
            "token": localStorage.getItem("token")
        })
        .then(res => {
            //this.props.addPost(res.data);
            window.location.reload();
        }
        ).catch(err => console.log("Complete Task request failed"))
    }

    render() {

        console.log("Task: " + this.props.id)

        let frequency;
        let date;

        if(this.props.frequency === 'Once') {
            frequency = <span title="This task can be done once" className="task-card-frequency">🔁 once</span>
        } else {
        frequency = <span title="Task recurrence" className="task-card-frequency">🔁 every {this.props.days} {this.props.days === 1 ? 'day' : 'days'}</span>
        }

        if(this.props.frequency === 'Daily' && !this.props.active) {
            date = <span title="On this day task will be active again" className="task-card-date">📆 {changeDateFormat1(this.props.refreshDate)}</span>
        }

        let message = this.props.isFinished ? 'Challenge finished, you can\'t complete more tasks!' : ''

        if (localStorage.getItem('token')) {
            return (
                <div>
                <Popup trigger={

                <div className={this.props.active ? 'task-card' : 'task-card task-card-inactive'}>
                        <div className="task-text-con">
                            <div>
                                <span className="task-title">{this.props.description}</span>
                                <div>
                                    {frequency}
                                    {date}
                                </div>
                                
                            </div>
                        </div>  
                        <div className="task-points">+{this.props.points}</div>                
                </div>

            } modal closeOnDocumentClick
                    disabled={this.props.isFinished}
                    contentStyle={{
                        maxWidth: '80%',
                        width: '500px',
                        backgroundColor: '#f2f2f2',
                        borderRadius: '30px',
                        border: "none",
                        padding: '10px'
                    }}
                    overlayStyle={{
                        background: "rgb(0,0,0, 0.4)"
                    }}
                >
                    {close => (
                    <div className="task-popup">
                        <form className="task-popup-form" onSubmit={e => {this.completeTask(e, this.props.id); close()}}>
                            <span className="task-popup-title">{this.props.description}</span>
                            <span className="task-popup-points">🔥 {this.props.points} pts</span>
                            <button disabled={this.props.active ? '' : 'disabled'} className="btn task-popup-btn" type="submit" value="Complete task">⚡ Task completed</button>
                        </form>
                    </div>
                    )}
                </Popup>
                <div>                     
                </div>   
                </div>   
            )
        } else {
            return null
        }
    }
}

const mapDispatchToProps = dispatch => ({
    addPost: post => dispatch(addPost(post))
})

const mapStateToProps = state => {
    return {
        habits: state.habits,
        users: state.users,
        members: state.members,
        userLogged: state.userLogged
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TaskCard));