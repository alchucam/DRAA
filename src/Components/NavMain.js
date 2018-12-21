import React, { Component } from "react";
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from "react-bootstrap";

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

                <Link to ='/'> <span style={capital}>D</span>na<span style={capital}>R</span>na<span style={capital}>A</span>mino<span style={capital}>A</span>cid  </Link>
              </Navbar.Brand>
            </Navbar.Header>
            <Nav>
              <NavItem eventKey={1} href="#">
                <Link to ='/mutate'> Mutate </Link>
              </NavItem>
              <NavItem eventKey={2} href="#">
                Link
              </NavItem>
              <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
                <MenuItem eventKey={3.1}>Action</MenuItem>
                <MenuItem eventKey={3.2}>Another action</MenuItem>
                <MenuItem eventKey={3.3}>Something else here</MenuItem>
                <MenuItem divider />
                <MenuItem eventKey={3.4}>Separated link</MenuItem>
              </NavDropdown>
            </Nav>
          </Navbar>

    )
  }
}
