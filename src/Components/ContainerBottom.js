//oninput instead of onchange

import React, { Component } from "react";
import './ContainerBottom.css';
import {ButtonToolbar, Button, ToggleButtonGroup, ToggleButton} from "react-bootstrap"
//import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from "react-bootstrap";

export default class ContainerBottom extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      isMutating: false
    };
  }

  handleChange(event) {
      this.props.onButtonChange(event.target.value);
      // console.log(event.target.value);
  }

  render() {
      const legendName = this.props.legendName;
      const sequence = this.props.sequence;
      const isMutating = this.props.isMutating;
      const counter = this.props.counter;
      const name = this.props.name;

      return (
        <fieldset id="wrapperfsB">
          <legend> {legendName} </legend>
          <div id="textareaB"
                    spellCheck="false"
                    readOnly = {true}
                    >
                    <ButtonToolbar>
                      <Button
                              value={isMutating}
                              onClick={this.handleChange}
                              >
                              {name}
                      </Button>
                    </ButtonToolbar>
                    Sequence: {sequence} <br/>
                    Generation: {counter}
            </div>
        </fieldset>
      );
  }
}
