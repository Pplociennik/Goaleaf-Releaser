import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import Popup from "reactjs-popup"
import Task from './Task'
import './Task.scss'

class TasksAll extends Component {

    state = {
        tasks: []
    }

    componentDidMount() {
        console.log(this.props.habitID);
        axios.get(`/api/tasks/habit?habitID=${this.props.habitID}`)
            .then(res => {
                this.setState({
                    tasks: res.data
                })
            }).catch(err => console.log(err.response.data.message))

    }

    render() {

        let tasks = this.state.tasks;
        let taskCards = [];

        tasks.forEach(task => {
            taskCards.push(<Task isAdmin={this.props.isAdmin} id={task.id} key={task.id} creator={task.creator} description={task.description} points={task.points} frequency={task.frequency} days={task.daysInterval} date={task.refreshDate} active={task.active}/>) 
        })

        let tasksToDisplay = taskCards;

        console.log(taskCards.length)
        if (!taskCards.length) {
            tasksToDisplay = <div style={{textAlign: 'center'}}>There are no tasks yet 🤷‍♂️</div>
        } 

        if (localStorage.getItem('token')) {
            return (
                <Popup trigger={<button className="btn waves-effect waves-light invite-user-btn habit-page-navigation-btn" ><span>✅ tasks</span></button>} modal closeOnDocumentClick
                    contentStyle={{
                        maxWidth: '80%',
                        width: '700px',
                        backgroundColor: '#f2f2f2',
                        borderRadius: '30px',
                        border: "none"
                    }}
                    overlayStyle={{
                        background: "rgb(0,0,0, 0.4)"
                    }}
                >
                    <div className="members-section row">
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <h4>Tasks</h4>
                        </div>
                        <ul className="collection" style={{overflow: 'visible'}}>
                            {tasksToDisplay}
                        </ul>
                    </div>
                </Popup>
            )
        } else {
            return null
        }
    }
}

const mapStateToProps = state => {
    return {
        userLogged: state.userLogged
    }
}

export default withRouter(connect(mapStateToProps)(TasksAll));