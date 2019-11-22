import React, { Component } from 'react'
import { Link, NavLink, withRouter } from 'react-router-dom'
import './Nav.scss'

class NavLogged extends Component {

    handleLogOut = () => {
        localStorage.removeItem('token');
        this.props.handleNavElementClicked();
        window.location.reload();
    }
  render() {
    let navState = this.props.show;

    let navStyle = {
      left: '-100vw'
    }
    if (navState === true) {
       navStyle = {
        left: '0vw'
      };
    }

    return (
        <ul className="nav-logged" style={ navStyle }>
            <li className="nav-item" onClick = { this.props.handleNavElementClicked }><NavLink to='/browse' activeStyle={{color: '#1D976C' }}>browse</NavLink></li>
            <li className="nav-item" onClick = { this.props.handleNavElementClicked }><NavLink to='/new-habit' activeStyle={{color: '#1D976C' }}>new challenge</NavLink></li>
            <li className="nav-item" onClick = { this.props.handleNavElementClicked }><NavLink to='/profile' activeStyle={{color: '#1D976C' }}>profile</NavLink></li>
            <li className="nav-item" onClick = { this.handleLogOut } ><Link to='/'>log out</Link></li>
        </ul>
    )
  }
}

export default withRouter(NavLogged);
