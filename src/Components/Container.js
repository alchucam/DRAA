//oninput instead of onchange

import React, { Component } from "react";
import './Container.css';

/*
var inputStyle = {
  height:"200px",
  color:"red",
  wordWrap: "break-word",
}
*/


export default class Container extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);


  }




  handleChange(event) {

    //to preserve the caret position
    const caret = event.target.selectionStart
    const element = event.target
    window.requestAnimationFrame(() => {
      element.selectionStart = caret
      element.selectionEnd = caret
    })

    this.props.onSequenceChange(event.target.value);

  }






  render() {
      const legendName = this.props.legendName;
      const sequence = this.props.sequence;
      const sidenote = this.props.sidenote;
      return (
        <fieldset>
          <legend> {legendName} : {sidenote}</legend>

          <textarea value={sequence}
                    onChange={this.handleChange}
                    type="text"
                    />

        </fieldset>
      );
  }
}

/*
input {
  color:red;
  height:200px;
  font-size:14pt;
}
*/