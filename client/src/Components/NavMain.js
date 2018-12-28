import React, { Component } from "react";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap';

var capital = {
  color: "red",
};

export default class NavMain extends Component {

  render() {
    return (
          <Navbar>
            <Navbar.Header>
              <Navbar.Brand>
                <Link to='/'> <span style={capital}>D</span>na<span style={capital}>R</span>na<span style={capital}>A</span>mino<span style={capital}>A</span>cid</Link>
              </Navbar.Brand>
            </Navbar.Header>
            <Nav>
              <LinkContainer exact to='/mutate'>
                <NavItem>Mutate</NavItem>
              </LinkContainer>
            </Nav>
          </Navbar>
    )
  }
}
