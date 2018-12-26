import React, { Component } from "react";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { Link } from 'react-router-dom'

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
              <NavItem eventKey={1}>
                <Link to='/mutate'>Mutate</Link>
              </NavItem>
              <NavItem eventKey={2} href="#">
                Temp
              </NavItem>
            </Nav>
          </Navbar>
    )
  }
}
