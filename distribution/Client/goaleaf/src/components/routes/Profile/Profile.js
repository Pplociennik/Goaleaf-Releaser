import React, { Component } from 'react'
import './Profile.scss'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import TempPic from './../../../assets/default-profile-pic.png'

class Profile extends Component {

    state = {
        login: '',
        username: '',
        oldPassword: '',
        newPassword: '',
        matchingNewPassword: '',
        id: '',
        emailAddress: '',
        errorMsg: '',
        picture: null,
        picPreview: null,
        confirmDelete: false,
        notifications: true
    };

    handleChangeAvatar = e => {

        if (e.target.files[0].name.match(/.(jpg|jpeg|png|gif)$/i)) {

            const blob = new Blob([e.target.files[0]], { type: "image/png" });
            const formData = new FormData();
            formData.append('file', blob);

            axios.post(`/uploadImage?token=${localStorage.getItem("token")}?type=PROFILE`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(res => {
                    axios.get(`/downloadFile/${this.props.userLogged}`, { responseType: 'arraybuffer' })
                        .then(res => {
                            const base64 = btoa(
                                new Uint8Array(res.data).reduce(
                                    (data, byte) => data + String.fromCharCode(byte),
                                    '',
                                ),
                            );
                            this.setState({ picture: res.data, picPreview: "data:;base64," + base64 });
                        })

                        .catch(err => { })
                }
                ).catch(err => { })
        }
    }

    handlePasswordChange = e => {
        console.log(this.state)
        e.preventDefault();
        axios.put('/api/users/edit', {
            "token": localStorage.getItem("token"),
            "emailAddress": '',
            "id": this.state.id,
            "matchingNewPassword": this.state.matchingNewPassword,
            "newPassword": this.state.newPassword,
            "oldPassword": this.state.oldPassword,
            "userName": ''
        })
            .then(res => {
                window.location.reload()
            }
            ).catch(err => this.setState({ errorMsg: err.response.data.message }))
    }

    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleDelete = event => {
        axios.delete(`/api/users/user/${this.props.userLogged}`)
            .then(res => window.location.reload()
            ).catch(err => { })
    }

    setNotifications = () => {
        let notificationsStatus;
        this.state.notifications ? notificationsStatus = false : notificationsStatus = true
        axios.post('/api/users/setntf', {
            "newNotificationsStatus": notificationsStatus,
            "token": localStorage.getItem("token"),
            "userID": this.props.userLogged
        })
            .then(res => { console.log(res);
                           this.setState({notifications: res.data.notifications})
            }
            ).catch(err => console.log(err.response.data.message))
    }

    componentDidMount() {
        axios.get(`/api/users/user/${this.props.userLogged}`)
            .then(res => {
                console.log(res.data)
                this.setState({
                    username: res.data.username,
                    emailAddress: res.data.emailAddress,
                    login: res.data.login,
                    id: res.data.id,
                    notifications: res.data.notifications
                })
            }
            ).catch(err => this.setState({ errorMsg: err.response.data.message }))

    }


    render() {
        let deleteAccount = ''
        if (this.state.confirmDelete === true) {
            deleteAccount = <div className="confirm-delete-profile">
                <span>Are you sure you want to delete your account?</span>
                <button className="confirm-delete-profile-btn" onClick={this.handleDelete}>Delete my account <i className="far fa-frown"></i></button>
            </div>
        }
        let errorMsg = <div className="error-msg">{this.state.errorMsg}</div>
        return (
            <div className="profile">
                <section className="profile-photo">
                    <img className="profile-img" src={ TempPic } alt="user avatar" title="Change avatar" onClick={() => this.refs.uploadPhoto.click()} />
                    <input className="profile-img-input" type="file" accept="image/x-png,image/gif,image/jpeg" onChange={this.handleChangeAvatar} ref="uploadPhoto" style={{ display: "none" }} />
                </section>
                <section className="profile-info">
                    <h1 className="profile-info-login">{this.state.login} </h1>
                    <div className="profile-info-email">
                        <span>{this.state.emailAddress}</span>
                        <button className={this.state.notifications ? 'notifications-btn notifications-btn-true' : 'notifications-btn notifications-btn-false'} onClick={ this.setNotifications } title={this.state.notifications ? "Disable notifications" : "Allow notifications"}><i className={this.state.notifications ? 'fas fa-bell' : 'fas fa-bell-slash'}></i></button>
                    </div>

                </section>
                <section className="change-password">
                    <form className="change-password-form" onSubmit={this.handlePasswordChange} autoComplete="off">
                        <h5 className="change-password-title">Change password</h5>
                        <input className="password-input" id="oldPassword" type="password" placeholder="old password" onChange={this.handleChange} />
                        <input className="password-input" id="newPassword" type="password" placeholder="new password" onChange={this.handleChange} />
                        <input className="password-input" id="matchingNewPassword" type="password" placeholder="repeat new password" onChange={this.handleChange} />
                        <input className="change-password-btn" type="submit" value="Submit" />
                        {errorMsg}
                    </form>
                </section>
                <section className="delete-profile">
                    <input className="delete-profile-btn" type="button" value="Delete profile" onClick={e => this.setState({ confirmDelete: true })} />
                    {deleteAccount}
                </section>
            </div>


        )
    }

}
const mapStateToProps = state => ({
    userLogged: state.userLogged
})

export default connect(mapStateToProps)(Profile);