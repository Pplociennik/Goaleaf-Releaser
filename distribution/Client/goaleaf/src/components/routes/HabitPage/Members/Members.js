import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import './Members.scss'
import Popup from "reactjs-popup"
import MemberCard from './MemberCard'

class Members extends Component {

    state = {
        members: [],
        search: ''
    }

    componentDidMount() {
        axios.get(`/api/habits/habit/members?habitID=${this.props.habitID}`)
            .then(res => {
                this.setState({
                    members: res.data
                })
            }).catch(err => console.log(err.response.data.message))

    }

    clearSearch = () => {
        this.setState({
            search: ''
        })
    }

    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    render() {

        let members = this.state.members;

        if (this.state.search !== '') {
            members = members.filter(member => {
                if (member.userLogin != null) {
                    return member.userLogin.startsWith(this.state.search);
                }
                else {
                    return false;
                }
            })
        }

        let foundMembers = false;
        let memberCards = [];

        members.forEach(member => {

            foundMembers = true;
            memberCards.push(<MemberCard key={member.id} userID={member.userID} userLogin={member.userLogin} profilePic={member.imgName} />)

        })

        let membersToDisplay = memberCards;

        if (!foundMembers && this.state.search === '') {
            membersToDisplay = <div>There are no members yet</div>
        } 
        else if (!foundMembers && this.state.search !== '') {
            membersToDisplay = <div>There are no members matching that name</div>
        }

        if (localStorage.getItem('token')) {
            return (
                <Popup trigger={<button className="btn waves-effect waves-light invite-user-btn habit-page-navigation-btn" ><span>👬 Members</span></button>} modal closeOnDocumentClick
                    onOpen={this.clearSearch}
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
                    <div className="members-section row">
                        <h4>Members</h4>
                        <input id="search" type="text" placeholder="Search user" autoComplete="off" onChange={this.handleChange} />
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

export default withRouter(connect(mapStateToProps)(Members));