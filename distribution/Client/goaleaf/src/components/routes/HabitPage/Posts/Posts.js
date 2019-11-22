import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import PostCard from './PostCard'
import './Posts.scss'
import {fetchPosts} from '../../../../js/state'
import {deletePost} from '../../../../js/state'

class Posts extends Component {

    state = {
        posts: [],
        postsToShow: 20,
        postsLoading: true
    }

    handlePostCardDeleted = id => {
        console.log(this.props.habitID)
        console.log(`delete post ${id}`)
        axios.delete(`/api/posts/delete/{id}`, {
            data: {
                "habitID": this.props.habitID,
                "postID": id,
                "token": localStorage.getItem("token")
            }
        })
            .then(res => {
                console.log(`Deleted post ${id}`);
                this.props.deletePost(id);
                window.location.reload();

            })
            .catch(err => console.log(err))
    }

    componentDidMount() {
        
        this.props.fetchPosts(this.props.habitID).then(res => this.setState({postsLoading: false}))
    }

    render() {

        let posts = this.props.posts;
        let foundPosts = false;
        let postCards = []
        posts.forEach(post => {

            if(this.props.showTasks && (post.postType === "Task" || post.postType === "HabitFinished")) {
                foundPosts = true;
                postCards.push(<PostCard key={post.id} id={post.id} userLogged={this.props.userLogged} currentUserLogin={this.props.userLoggedLogin} creatorLogin={post.creatorLogin} createdDate={post.dateOfAddition} postType={post.postType} taskPoints={post.taskPoints} postText={post.postText} userComment={post.userComment} imgName={post.imgName} counter_CLAPPING={post.counter_CLAPPING} counter_WOW={post.counter_WOW} counter_NS={post.counter_NS} counter_TTD={post.counter_TTD} handlePostCardDeleted={() => this.handlePostCardDeleted(post.id)} />)
            }
            if(!this.props.showTasks && post.postType === "JustText") {
                foundPosts = true;
                postCards.push(<PostCard key={post.id} id={post.id} userLogged={this.props.userLogged} currentUserLogin={this.props.userLoggedLogin} creatorLogin={post.creatorLogin} createdDate={post.dateOfAddition} postType={post.postType} taskPoints={post.taskPoints} postText={post.postText} userComment={post.userComment} imgName={post.imgName} counter_CLAPPING={post.counter_CLAPPING} counter_WOW={post.counter_WOW} counter_NS={post.counter_NS} counter_TTD={post.counter_TTD} handlePostCardDeleted={() => this.handlePostCardDeleted(post.id)} />)
            }
        })
        
        let postsToDisplay = postCards.slice(0, this.state.postsToShow);


        if (this.state.postsLoading) {
            postsToDisplay =   
            <div className="preloader-wrapper small active">
                <div className="spinner-layer spinner-green-only">
                <div className="circle-clipper left">
                    <div className="circle"></div>
                </div><div className="gap-patch">
                    <div className="circle"></div>
                </div><div className="circle-clipper right">
                    <div className="circle"></div>
                </div>
                </div>
            </div>
        }

        return (
                <section className="posts row">
                    <div className="col s12 m8  offset-m2 center">
                        {postsToDisplay}
                    <div>
                        {postCards.length > this.state.postsToShow ? <div className="show-more-posts-btn-con"><button className="show-more-posts-btn btn center" onClick={() => this.setState({ postsToShow: this.state.postsToShow + 20 })}>Show more</button></div> : null}
                    </div>
                    </div>
                </section>
            ) 
    }
}

const mapStateToProps = state => {
    return {
        posts: state.posts,
        userLogged: state.userLogged,
        userLoggedLogin: state.userLoggedLogin
    }
}
const mapDispatchToProps = dispatch => ({
    fetchPosts: habitID =>  dispatch(fetchPosts(habitID)),
    deletePost: habitID =>  dispatch(deletePost(habitID))
})
export default connect(mapStateToProps, mapDispatchToProps)(Posts);