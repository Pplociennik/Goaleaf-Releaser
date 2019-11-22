import React, { Component } from 'react'
import TempPic from './../../../../../assets/default-profile-pic.png'
import { changeDateFormat1 } from '../../../../../js/helpers'
import { Dropdown } from 'react-materialize'
import MoreIcon from './../../../../../assets/more.png'

class CommentCard extends Component {

    state = {
        userLogin: ''
    }

    render() {
        return (
            <li className="comment-card collection-item col s10 offset-s2">
                <div className="comment-profile">
                    <img className="comment-profile-pic" src={TempPic} alt="User avatar" title="User avatar" />
                    <p className="comment-profile-login">{this.props.userLogin}</p>
                    <p className="comment-profile-date">{changeDateFormat1(this.props.date)}</p>
                </div>
                <div className="comment-content">
                    <span>{this.props.commentText}</span>
                </div>
                {this.props.currentUserLogin === this.props.userLogin ?
                            <Dropdown trigger={<a href="#!" className='comment-nav dropdown-trigger' data-target={this.props.id}><img src={MoreIcon}></img></a>}>
                             <a href="#!" className="dropdown-item dropdown-delete" onClick={() => this.props.handleCommentCardDeleted(this.props.id)}>Delete</a>
                            </Dropdown>
                            : null}
            </li>
        )
    }

}

export default CommentCard;