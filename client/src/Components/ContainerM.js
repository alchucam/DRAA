//oninput instead of onchange

import React, { Component } from "react";
import './ContainerM.css';




export default class Container extends Component {
  constructor(props) {
    super(props);
    this.handleLegend = this.handleLegend.bind(this);
    this.state = {legendClick:true, visibility: "hidden", height: "40px"};
  }


  handleLegend(){
    console.log("haha");
    if (this.state.legendClick){
      this.setState({legendClick:false, visibility:"visible", height: "100%"})
    }
    else if (!this.state.legendClick){
      this.setState({legendClick:true, visibility:"hidden", height: "40px"})
    }
  }


  render() {
      const legendName = this.props.legendName;
      const sequence = this.props.sequence;
      const sidenote = this.props.sidenote;

      //css for toggle height of fieldset (container of legend and textarea) when legend is clicked
      const fieldsetCSS = {
        height: this.state.height
      }
      //css for toggle visibility of textarea when legend is clicked
      const textareaCSS = {
        visibility: this.state.visibility
      }

      return (
        <fieldset style={fieldsetCSS}>
          <legend id="Container-legend" onClick={this.handleLegend}> {legendName} </legend>
          <textarea style={textareaCSS}
                    placeholder={sidenote}
                    value={sequence}
                    spellCheck="false"
                    readOnly={true}
                    />
        </fieldset>
      );
  }
}
