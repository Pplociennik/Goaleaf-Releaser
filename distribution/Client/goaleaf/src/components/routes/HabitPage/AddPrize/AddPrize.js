import React, { Component } from 'react'
import axios from 'axios';
import Popup from "reactjs-popup";
import M from "materialize-css";

class AddPrize extends Component {

  state = {
    msg: null,
    prizePoints: 100
  }

    addPrize = (e, id) => {
        e.preventDefault();
        axios.post(`/api/habits/habit/setPointsToWIn?habitID=${id}&pointsToWin=${this.state.prizePoints}`)
        .then(res => {
            window.location.reload();
        }
        ).catch(err => console.log(err.response.data.message))

    }

    addPrizePoint = e => {
        e.preventDefault();

        if(this.state.prizePoints < 1000) {
            this.setState({prizePoints: this.state.prizePoints + 1})
        }
    }
    subtractPrizePoint = e => {
        e.preventDefault();

        if(this.state.prizePoints > 1 && this.state.prizePoints ) {
            this.setState({prizePoints: this.state.prizePoints - 1})
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
    clearMsg = () => {
        this.setState({
            //prizePoints: this.props.pointsToWin
        })
    }

    componentDidMount() {
        M.AutoInit();
            console.log(this.state);
            if(this.props.pointsToWin !== 1001){
                this.setState({prizePoints: this.props.pointsToWin})
            }
    }

    render() {
        let addPrizeBtn;
    if(this.props.isAdmin){
    addPrizeBtn = this.props.isFinished ? <button className="btn waves-effect waves-light add-task-btn habit-page-navigation-btn" disabled><span>🏆 set goal</span></button> : <button className="btn waves-effect waves-light add-task-btn habit-page-navigation-btn" ><span>🏆 {this.props.pointsToWin === 1001 ? 'set' : 'update'} goal</span></button>
    }
    return (
        <Popup trigger={addPrizeBtn} modal closeOnDocumentClick
            onOpen={ this.clearMsg }
            onClose={ this.clearPoints }
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
                <h4 className="">{this.props.pointsToWin === 1001 ? 'Set' : 'Update'} goal</h4>
                <div className="input-field inline">
                    <button className="task-points-btn task-points-btn-subtract" onClick={ this.subtractPrizePoint }>-</button>
                    <span className="task-points">{ this.state.prizePoints  }</span>
                    <button className="task-points-btn task-points-btn-add" onClick={ this.addPrizePoint }>+</button>
                    <span className={this.state.msg === 'Goal set' ? "helper-text green-text" : "helper-text red-text "}>{this.state.msg}</span>
                </div>
                <button className="btn" onClick={(e) => this.addPrize(e, this.props.habitID)} type="submit" value="Set goal">
                    <span>submit</span>
                </button>
            </form>
            </div>
        </div>
    </Popup>
    )
  } 
}

export default AddPrize;