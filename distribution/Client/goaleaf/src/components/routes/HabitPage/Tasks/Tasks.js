import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import Popup from "reactjs-popup"
import TaskCard from './TaskCard'
import './TaskCard.scss';

class Tasks extends Component {

    state = {
        tasks: []
    }

    componentDidMount() {
        axios.get(`/api/tasks/list/available?habitID=${this.props.habitID}&userID=${this.props.userLogged}`)
            .then(res => {
                this.setState({
                    tasks: res.data
                })
            }).catch(err => console.log(err.response.data.message))
    }

    render() {

        let tasks = this.state.tasks;
        tasks.reverse();
        tasks.sort((b, a) => (a.active > b.active) ? 1 : ((b.active > a.active) ? -1 : 0));
        console.log(tasks);


        let foundTasks = false;
        let taskCards = [];

        tasks.forEach(task => {

            foundTasks = true;
            if(!(!task.active && task.frequency === 'Once')){
                taskCards.push(<TaskCard key={task.id} id={task.id} description={task.description} points={task.points} creator={task.creator} habitID={this.props.habitID} isFinished={this.props.isFinished} active={task.active} frequency={task.frequency} days={task.daysInterval} refreshDate={task.refreshDate} isAdmin={this.props.isAdmin}/>)
            }
        })
        let tasksToDisplay = taskCards;

        if (!foundTasks) {
            tasksToDisplay = <li style={{display: 'flex', justifyContent: 'center', marginTop: '60px'}}>There are no tasks yet 🤷‍♂️</li>
        } 

        if (localStorage.getItem('token')) {
            return (
                    <div className="row">
                        <ul className="tasks">
                            {tasksToDisplay}
                        </ul>
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

export default withRouter(connect(mapStateToProps)(Tasks));