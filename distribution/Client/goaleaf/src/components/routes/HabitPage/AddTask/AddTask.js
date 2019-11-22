import React, { Component } from 'react'
import './AddTask.scss'
import axios from 'axios';
import Popup from "reactjs-popup";
import M from "materialize-css";

class AddTask extends Component {

  state = {
    msg: null,
    task: null,
    taskPoints: 5,
    frequency: "Once",
    days: 1
  }

    addTask = (e, id) => {
        e.preventDefault();
        console.log(this.state.task);
        if (this.state.task !== null){
            axios.post('/api/tasks/add', {
                "description": this.state.task,
                "frequency": this.state.frequency,
                "daysInterval": this.state.days,
                "habitID": id,
                "points": this.state.taskPoints,
                "token": localStorage.getItem("token")
            })
            .then(res => {
                window.location.reload();
            }
            ).catch(err => console.log(err.response.data.message))
        }   
    }

    addTaskPoint = e => {
        e.preventDefault();
        if(this.state.taskPoints < 10) {
            this.setState({taskPoints: this.state.taskPoints + 1})
        }
    }
    subtractTaskPoint = e => {
        e.preventDefault();
        if(this.state.taskPoints > 1) {
            this.setState({taskPoints: this.state.taskPoints - 1})
        }
    }

    addTaskDays = e => {
        e.preventDefault();
        if(this.state.days < 14) {
            this.setState({days: this.state.days + 1})
        }
    }
    subtractTaskDays = e => {
        e.preventDefault();
        if(this.state.days > 1) {
            this.setState({days: this.state.days - 1})
        }
    }

    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    
    clearMsg = () => {
        this.setState({
            msg: null
        })
    }

    componentDidMount() {
        M.AutoInit();
    }


    setOnceTrue = e => {
        this.setState({
            frequency: "Once"
        })
    }

    setOnceFalse = e => {
        this.setState({
            frequency: "Daily"
        })
    }

    render() {
    
    let customRecurrence;
    if(this.state.frequency === 'Daily') {
        customRecurrence = <div>
                               <div>
                                   <button className="task-points-btn task-points-btn-subtract" onClick={ this.subtractTaskDays }>-</button>
                                   <span className="task-points">every { this.state.days } {this.state.days === 1 ? 'day' : 'days'}</span>
                                   <button className="task-points-btn task-points-btn-add" onClick={ this.addTaskDays }>+</button>
                               </div>
                           </div>
    }


    let addTaskBtn;
    if(this.props.isAdmin){
        addTaskBtn = this.props.isFinished ? <button className="btn waves-effect waves-light add-task-btn habit-page-navigation-btn" disabled><span>🔥 New Task</span></button> : <button className="btn waves-effect waves-light add-task-btn habit-page-navigation-btn"><span>🔥 New Task</span></button>
    }
    return (
        <Popup trigger={addTaskBtn} modal closeOnDocumentClick
            onOpen={ this.clearMsg }
            contentStyle={{
                maxWidth: '80%',
                width: '500px',
                backgroundColor: '#f2f2f2',
                borderRadius: '30px',
                border: "none"
            }}
            overlayStyle={{
                background: "rgb(0,0,0, 0.4)"
            }}
        >
        <div className="add-task-box">
        <div className="row">
            <form className="col s10 offset-s1  l8 offset-l2 center-align" autoComplete="off">
                <h4 className="">New Task</h4>
                <div className="input-field inline">
                    <input id="task" type="text" placeholder="task description" onChange={ this.handleChange } />
                    <button className="task-points-btn task-points-btn-subtract" onClick={ this.subtractTaskPoint }>-</button>
                    <span className="task-points">{ this.state.taskPoints } {this.state.taskPoints === 1 ? 'point' : 'points'}</span>
                    <button className="task-points-btn task-points-btn-add" onClick={ this.addTaskPoint }>+</button>
                    <span className={this.state.msg === 'Task added' ? "helper-text green-text" : "helper-text red-text "}>{this.state.msg}</span>
                </div>
                <div className="input-field inline task-recurrence-con">
                    <span className="set-recurrence-title">Set recurrence</span>
                    <div>
                        <div>
                            <button type="button" className={this.state.frequency === 'Once' ? 'new-task-recurrence-active' : 'new-task-recurrence-inactive'} onClick={this.setOnceTrue}>can finish once</button>
                            <button type="button" className={this.state.frequency === 'Daily' ? 'new-task-recurrence-active' : 'new-task-recurrence-inactive'} onClick={this.setOnceFalse}>custom</button>
                        </div>
                        {customRecurrence}
                    </div>
                </div>
                <button className="btn" onClick={(e) => this.addTask(e, this.props.habitID)} type="submit" value="Add Task">
                    <span>Add Task</span>
                </button>
            </form>
            </div>
        </div>
    </Popup>
    )
  } 
}

export default AddTask;