import React, { Component } from "react";
import './Container.css';

export default class Container extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleLegend = this.handleLegend.bind(this);
    this.state = {legendClick:false, visibility: "visible", height: "100%"};
  }

  //handle event when a sequence in the text area has been modified, calling onSequenceChange in Convert.js
  //additionally, maintains the caret position.
  handleChange(event, legendName) {
    //to preserve the caret position
    const caret = event.target.selectionStart
    const element = event.target
    window.requestAnimationFrame(() => {
      element.selectionStart = caret
      element.selectionEnd = caret
    })
    this.props.onSequenceChange(event.target.value);
  }

  //handle event when user clicks the legend, which hides or show the textarea below the legend.
  handleLegend(){
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
                    onChange={this.handleChange}
                    type="text"
                    spellCheck="false"
                    />
        </fieldset>
      );
  }
}
