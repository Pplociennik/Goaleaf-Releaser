import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import './Nav.scss'

class NavNotLogged extends Component {

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
        <ul className="nav-not-logged" style={ navStyle }>
            <li className="nav-item" onClick = { this.props.handleNavElementClicked } ><NavLink to='/login' activeStyle={{color: '#1D976C' }}>log in</NavLink></li>
            <li className="nav-item" onClick = { this.props.handleNavElementClicked } ><NavLink to='/signin' activeStyle={{color: '#1D976C' }}>sign in</NavLink></li>
        </ul>
    )
  }
}

export default NavNotLogged;
