import React, { Component } from 'react'
import { changeDateFormat1 } from '../../../../js/helpers'
import './PostCard.scss'
import TempPic from './../../../../assets/default-profile-pic.png'
import { Dropdown } from 'react-materialize'
import MoreIcon from './../../../../assets/more.png'
import ClapIcon from './../../../../assets/clap.png'
import WowIcon from './../../../../assets/wow.png'
import NtIcon from './../../../../assets/nt.png'
import TtdIcon from './../../../../assets/ttd.png'
import axios from 'axios';
import CommentCard from './Comments/CommentCard'

class PostCard extends Component {

    state = {
        userReaction: null,
        reactions: {
            counter_CLAPPING: 0,
            counter_WOW: 0,
            counter_NS: 0,
            counter_TTD: 0
        },
        comments: [],
        showComments: false,
        comment: ''
    }

    addReaction = reaction => {
        axios.post('/api/posts/post/addreaction', {
            "postID": this.props.id,
            "token": localStorage.getItem('token'),
            "type": reaction
        }).then(res => {
            this.state.userReaction === reaction ?
                this.setState({ userReaction: null }) :
                this.setState({ userReaction: reaction })

            this.setState({
                reactions: res.data
            })
            console.log(res.data)
        }).catch(err => console.log(err))
    }

    handleCommentCardDeleted = (id) => {
        axios.delete(`/api/comments/remove?id=${id}`)
            .then(res => {
                console.log(`Deleted comment ${id}`);
                    let comments = this.state.comments.filter( comment => {
                            return comment.id !== id;
                    })
                    this.setState({
                        comments: comments
                    })
            }).catch(err => { console.log(err) })

    }

    addComment = e => {
        e.preventDefault();
        this.clearMsg();
        axios.post('/api/comments/addcomment', {
            "creatorID": this.props.userLogged,
            "postID": this.props.id,
            "text": this.state.comment
        }).then(res => {
            this.setState({ comments: [res.data, ...this.state.comments] })
            this.showComments();
        }
        )
            .catch(err => console.log(err))
    }

    showComments = () => {
        axios.get(`/api/comments/getcomments?postID=${this.props.id}`)
            .then(res => {
                this.setState({
                    comments: res.data
                })
                console.log(this.state.comments)
            }).catch(err => console.log(err))

        this.setState({
            showComments: true
        })
    }

    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    clearMsg = () => {
        this.setState({
            comment: ''
        })
    }


    componentDidMount() {
        axios.get(`/api/posts/presentreaction?postID=${this.props.id}&userLogin=${this.props.currentUserLogin}`)
            .then(res => {
                res ? this.setState({ userReaction: res.data.type.toUpperCase() })
                    : this.setState({ userReaction: null })
            })
            .catch(err => console.log(err))

        this.setState({
            reactions: {
                counter_CLAPPING: this.props.counter_CLAPPING,
                counter_WOW: this.props.counter_WOW,
                counter_NS: this.props.counter_NS,
                counter_TTD: this.props.counter_TTD
            }
        })
    }

    render() {

        let finalCommentsToDisplay = [];

        if (this.state.showComments) {
            let comments = this.state.comments;

            let foundComments = false;
            let commentCards = [];

            console.log(comments)
            comments.forEach(comment => {
                foundComments = true;
                commentCards.push(<CommentCard key={comment.id} id={comment.id} currentUserLogin={this.props.currentUserLogin} userLogin={comment.userLogin} date={comment.creationDate} commentText={comment.commentText} handleCommentCardDeleted={() => this.handleCommentCardDeleted(comment.id)} />)
            })

            console.log(commentCards);
            let commentsToDisplay = commentCards.reverse();

            if (!foundComments) {
                commentsToDisplay = <div>There are no comments yet</div>
            }

            finalCommentsToDisplay = commentsToDisplay;
        }

        let postContent = '';
        let postCommentBtn = '';
        if(this.props.postType !== 'Task'){
            if (!this.state.showComments){
                postCommentBtn = <button className="show-comments-btn" onClick={() => this.showComments()}>Show comments</button>
            } else {
               postCommentBtn = <button className="show-comments-btn" onClick={() => this.setState({ showComments: false })}>Hide comments</button>
            }
            postContent = <div className="post-content">
                             <p className="post-card-text">{this.props.postText}</p>
                          </div>
        } else {
            postContent = <div className="post-task-content">
                             <p className="post-task-text">{this.props.postText}</p>
                             <p className="post-task-points">+{this.props.taskPoints} pts</p>
                          </div>
        }

        let taskType;
        if(this.props.postType === 'Task'){
            taskType = 'post-task-card'
        } else if (this.props.postType === 'HabitFinished') {
            taskType = 'post-won-task-card'
        } else {
            taskType = 'post-card'
        }

        return (
            <div className={ taskType }>
                <div className="post-owner">
                    <img src={TempPic} alt="profile"></img>
                    <div className="post-card-owner-info">
                        <span className="post-card-owner">{this.props.creatorLogin}</span>
                        <span className="post-card-date">{changeDateFormat1(this.props.createdDate)}</span>
                    </div>
                </div>
                {postContent}
                <div className="post-bottom-navigation">
                    <div className="post-reactions">
                        <div className="reaction">
                            <img className={!this.state.userReaction || this.state.userReaction === 'CLAPPING' ? "reaction-active" : "reaction-inactive"} src={ClapIcon} alt="clapping reaction" onClick={() => this.addReaction('CLAPPING')}></img>
                            <span className="reaction-counter">{this.state.reactions.counter_CLAPPING}</span>
                        </div>
                        <div className="reaction">
                            <img className={!this.state.userReaction || this.state.userReaction === 'WOW' ? "reaction-active" : "reaction-inactive"} src={WowIcon} alt="wow reaction" onClick={() => this.addReaction('WOW')}></img>
                            <span className="reaction-counter">{this.state.reactions.counter_WOW}</span>
                        </div>
                        <div className="reaction">
                            <img className={!this.state.userReaction || this.state.userReaction === 'NOTHING_SPECIAL' ? "reaction-active" : "reaction-inactive"} src={NtIcon} alt="bored reaction" onClick={() => this.addReaction('NOTHING_SPECIAL')}></img>
                            <span className="reaction-counter">{this.state.reactions.counter_NS}</span>
                        </div>
                        <div className="reaction">
                            <img className={!this.state.userReaction || this.state.userReaction === 'THERES_THE_DOOR' ? "reaction-active" : "reaction-inactive"} src={TtdIcon} alt="there are the doors reaction" onClick={() => this.addReaction('THERES_THE_DOOR')}></img>
                            <span className="reaction-counter">{this.state.reactions.counter_TTD}</span>
                        </div>
                    </div>
                    {postCommentBtn}
                        
                </div>
                {this.state.showComments ?
                    <div className="comments-con">
                        <ul className="comments row">
                            {finalCommentsToDisplay}
                        </ul>
                        <div className="add-comment-con row">
                            <form className="col s8 offset-s2" onSubmit={this.addComment}>
                                <input className="add-comment-input" id="comment" type="text" placeholder="add comment" autoComplete="off" value={this.state.comment} onChange={this.handleChange} />
                                <input className="add-comment-btn btn center" type="submit" value="COMMENT" />
                            </form>
                        </div>
                    </div>
                    : null}


                {this.props.currentUserLogin === this.props.creatorLogin ?
                    <Dropdown trigger={<a href="#!" className='post-card-more-btn dropdown-trigger' data-target={this.props.id}><img src={MoreIcon}></img></a>}>
                        <a className="dropdown-item dropdown-delete" href="#!" onClick={() => this.props.handlePostCardDeleted(this.props.id)}>Delete</a>
                    </Dropdown>
                    : null}
            </div>
        )
    }
}

export default PostCard;