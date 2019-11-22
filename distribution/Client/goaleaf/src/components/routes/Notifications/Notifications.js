import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import NotificationCard from './NotificationCard'
import './Notifications.scss';
import axios from 'axios'
import Popup from "reactjs-popup";

class Notifications extends Component {

    state = {
        notifications: [],
        notificationsToShow: 20,
        notificationsSortBy: 'NEWEST'
    }

    handleNtfCardClicked = (id, url) => {
        console.log(url)
        this.props.history.push(url) 
    }

    handleNtfCardDeleted = (id, url) => {
        axios.delete(`/api/notifications/ntf/{id}?ntfID=${id}`)
            .then(res => {
                console.log(`Deleted notification ${id}`);
                this.setState({notifications: this.state.notifications.filter(ntf => ntf.id !== id)})

        })
            .catch(err => console.log(err))
    }

    componentDidMount() {
        axios.get(`/api/notifications/usersntf?userID=${this.props.userLogged}`)
            .then(res => {
                res.data.forEach(ntf => {
                    let notifications = [...this.state.notifications, ntf]
                    this.setState({
                        notifications: notifications
                    })
                })
            })
            .catch(err => {console.log('Error when downloading notifications')})
    }

    render() {

        let notifications = this.state.notifications;

        notifications.sort(function (a, b) {
            let keyA = new Date(a.date),
                keyB = new Date(b.date);
            if (keyA > keyB) return -1;
            if (keyA < keyB) return 1;
            return 0;
        });

        let foundNtfs = false;
        let notificationCards = []
        notifications.forEach(ntf => {

            foundNtfs = true;
            notificationCards.push(<NotificationCard key={ntf.id} id={ntf.id} description={ntf.description} date={ntf.date} url={ntf.url} handleNtfCardClicked={() => this.handleNtfCardClicked(ntf.id, ntf.url)} handleNtfCardDeleted={() => this.handleNtfCardDeleted(ntf.id, ntf.url)}/>)

        })

        let ntfsToDisplay = notificationCards.slice(0, this.state.notificationsToShow);


        if (!foundNtfs) {
            ntfsToDisplay = <div>You have no notifications</div>
        }

        if (localStorage.getItem('token')) {
            return (
                <section className="dashboard-nav">
                <Popup trigger={<button className={foundNtfs ? "btn waves-effect waves-light notifications-modal-btn" : "btn disabled notifications-modal-btn"} >🔔 <span> Notifications</span></button>} modal closeOnDocumentClick
                onOpen={ this.clearMsg }
                contentStyle={{
                    maxWidth: '90%',
                    width: '700px',
                    backgroundColor: '#f2f2f2',
                    padding: "10px",
                    borderRadius: '30px',
                    border: "none"
                }}
                overlayStyle={{
                    background: "rgb(0,0,0, 0.4)"
                }}
            >
                    <div className="notifications-section row">
                        <h4>My notifications</h4>
                        <ul className="collection">
                            {ntfsToDisplay}
                        </ul>
                        <div className="show-more-btn-con">
                            { notificationCards.length > this.state.notificationsToShow ? <button className="btn waves-effect waves-light show-more-btn" onClick={() => this.setState({ notificationsToShow: this.state.notificationsToShow + 20 })}>Show more</button> : null }
                        </div>
                    </div>
                </Popup>
            </section>
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

export default withRouter(connect(mapStateToProps)(Notifications));