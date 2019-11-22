import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import Popup from "reactjs-popup"
import LeaderboardCard from './LeaderboardCard'

class Leaderboard extends Component {

    state = {
        members: []
    }

    componentDidMount() {
        axios.get(`/api/habits/rank?habitID=${this.props.habitID}`)
            .then(res => {
                this.setState({
                    members: res.data
                })
            }).catch(err => console.log(err.response.data.message))

    }

    render() {

        let members = this.state.members;

        let foundMembers = false;
        let memberCards = [];

        Object.keys(this.state.members).map(pos => {

            foundMembers = true;
            let member = this.state.members[pos];

            let scorePercentage = Math.round(member.points / this.props.pointsToWin * 100);
            console.log(scorePercentage);
            

            memberCards.push(<LeaderboardCard key={member.id} scorePercentage={scorePercentage} position={pos} userID={member.userID} userLogin={member.userLogin} profilePic={member.imgName} points={member.points}/>)
        
        })

        let membersToDisplay = memberCards;

        if (!foundMembers) {
            membersToDisplay = <div>There are no members yet</div>
        } 

        if (localStorage.getItem('token')) {
            return (
                <Popup trigger={<button className="btn waves-effect waves-light invite-user-btn habit-page-navigation-btn" ><span>⚡ Leaderboard</span></button>} modal closeOnDocumentClick
                    contentStyle={{
                        maxWidth: '80%',
                        width: '600px',
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
                            <h4>Leaderboard</h4>
                            <span style={{fontSize: '1.6em'}}>{this.props.pointsToWin}pts 🏁</span>
                        </div>
                        <ul className="collection">
                            {membersToDisplay}
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
        habits: state.habits,
        users: state.users,
        members: state.members,
        userLogged: state.userLogged
    }
}

export default withRouter(connect(mapStateToProps)(Leaderboard));