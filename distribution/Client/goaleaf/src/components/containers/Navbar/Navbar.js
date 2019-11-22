import React, { Component } from 'react'
import './Navbar.scss'
import { Link } from 'react-router-dom'
import NavNotLogged from './NavNotLogged';
import NavLogged from './NavLogged';
import Logo from './../../../assets/mobile-logo.png';
import Hamburger from './../../../assets/hamburger.png';
import Close from './../../../assets/close.png';
import { connect } from 'react-redux';

class Navbar extends Component {

  state = {
    showNav: false
  }
  handleHamburger = () => {
    this.state.showNav ? this.setState({showNav: false}) : this.setState({showNav: true});
  }
  handleNavElementClicked = () => {
    this.setState({
      showNav: false
    })
  }

  render() {
    let hamburger = <img className="hamburger" src={ Hamburger } alt="hamburger" onClick={ this.handleHamburger }></img>
    if(this.state.showNav) {
      hamburger = <img className="hamburger" src={ Close } alt="hamburger" onClick={ this.handleHamburger }></img>
    }

    let navigation = <NavNotLogged show={ this.state.showNav } handleNavElementClicked = { this.handleNavElementClicked } />
    if(this.props.authenticated){
        navigation = <NavLogged show={ this.state.showNav } handleNavElementClicked = { this.handleNavElementClicked } />
    }
    return (
      <nav className="navbar">
        <Link to="/" className="logo-desktop" onClick={ this.handleNavElementClicked }>goaleaf</Link>
        <Link to="/" className="logo-mobile" onClick={ this.handleNavElementClicked }><img src={Logo} alt="logo"></img></Link>
        { hamburger }
        { navigation }
      </nav>
    )
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.authenticated
  }
}

export default connect(mapStateToProps)(Navbar);
