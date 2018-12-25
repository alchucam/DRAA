import React, { Component } from "react";
import {Button} from "react-bootstrap"

export default class Buttonn extends Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      pressed : false,
      name: '',
    };
  }
  handleChange(event){
    this.props.onButtonChange(event.target.value, event.target.name);
  }
  render(){
    const name = this.props.name;
    var pressed = this.props.pressed;

    return(
        <Button
          value={pressed}
          name={name}
          onClick={this.handleChange}
          >
          {name}
        </Button>

    )
  }
}
