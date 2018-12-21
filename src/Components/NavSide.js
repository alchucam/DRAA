import React, { Component } from "react";
import './NavSide.css';




const theme = {
  hoverBgColor: "#f5f5f5",
  selectionBgColor: "#f5f5f5",
  selectionIconColor: "#03A9F4"
};



export default class NavSide extends Component {

  render() {
    return (
      <fieldset id="wrapperfsside">


        <div id="textareaside"


                  type="text"
                  spellCheck="false"
                  />
      </fieldset>

    )
  }
}
