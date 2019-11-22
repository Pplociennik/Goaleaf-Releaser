import React, { Component } from 'react'
import './AddPost.scss'
import axios from 'axios';
import { connect } from 'react-redux';
import PhotoIcon from './../../../../assets/photo-icon.png';
import {addPost} from '../../../../js/state';
import Tasks from '../Tasks/Tasks';
import Posts from '../Posts/Posts';
class AddPost extends Component {

  state = {
      postText: '',
      showTasks: true,
      userPoints: 0

  }

  showTasks = e => {
      this.setState({showTasks: true});
  }
  showPosts = e => {
      this.setState({showTasks: false});
  }

  handleAddPost = e => {
      e.preventDefault();    
      axios.post('/api/posts/addpost', {
            "habitID": this.props.habitID,
            "postText": this.state.postText.replace(/\n\s*\n/g, '\n'),
            "token": localStorage.getItem('token'),
            "type": "JustText"
      }).then(res => {
          this.setState({postText: ''})
          console.log(res)
          this.props.addPost(res.data);

        }
       ).catch(err => console.log(err))
  }

  handleChange = e => {
    this.setState({[e.target.id]: e.target.value})
  }

  componentDidMount() {
    axios.get(`/api/members/member/points?habitsID=${this.props.habitID}&userID=${this.props.user}`)
    .then(res => {
        this.setState({userPoints: res.data});
    }
    ).catch(err => console.log(err.response.data.message))
  }

  render() {


    let tasksToShow;
    if(!this.props.isAdmin && this.props.pointsToWin === 1001){
        tasksToShow = <div className="noTasksInfo">No tasks to complete 🤷‍♂️</div>  
    } else if (this.props.isFinished) {
    tasksToShow = <div className="noTasksInfo">🏆 Challenge has ended, {this.props.winner} has won! 🏆</div>
    } else if (this.props.pointsToWin === 1001) {
        tasksToShow = <div className="noTasksInfo">Please set the prize before adding tasks 💪</div>
    }
    else {  

        tasksToShow = <div>
    <div className="pointsToWinInfo" style={{fontSize: "2em"}}>{this.state.userPoints} / {this.props.pointsToWin} pts 🏁</div>
                        <h2 className="tasks-title">Complete task</h2>
                        <Tasks habitID={this.props.habitID} isFinished={this.props.isFinished} isAdmin={this.props.isAdmin}/>
                      </div>
    }


    
    return (
        <div className="add-post-con row">
            <div className="col s10 m8 offset-s1 offset-m2">
                <ul className="tabs">
                    <li className="achievement-tab tab col s6 l4 offset-l1"><a className="active" href="#achievement" onClick={ this.showTasks }>tasks</a></li>
                    <li className="post-tab tab col s6 l4 offset-s1 offset-l2"><a  href="#post" onClick={ this.showPosts }>discussion</a></li>
                </ul>
            </div>
            <div id="post" className="col s10 offset-s1 m8 offset-m2">
                <form className="" onSubmit={ this.handleAddPost }>
                    <div className="">
                        <div className="input-field">
                            <textarea id="postText" className="materialize-textarea" placeholder="what's on your mind?" value={ this.state.postText } onChange={ this.handleChange }></textarea>
                        </div>
                    </div>
                    <div className="add-post-buttons-con">
                        <div className="add-post-left-buttons">
                            <img src={ PhotoIcon } alt="add image"></img>
                        </div>
                        <div>
                            <button className="add-post-btn btn" type="submit">Post</button>
                        </div>
                    </div>
                </form>
            </div>
            <div id="achievement" className="col s10 offset-s1 m8 offset-m2">
                {tasksToShow}
            </div>
            <Posts habitID={this.props.habitID} showTasks={this.state.showTasks}/>
        </div>
    )
  } 
}

const mapDispatchToProps = dispatch => ({
    addPost: post => dispatch(addPost(post))
})

export default connect(null, mapDispatchToProps)(AddPost);