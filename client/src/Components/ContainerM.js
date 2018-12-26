//oninput instead of onchange

import React, { Component } from "react";
import './ContainerM.css';




export default class Container extends Component {
  render() {
      const legendName = this.props.legendName;
      const sequence = this.props.sequence;
      const sidenote = this.props.sidenote;
      return (
        <fieldset id="wrapperfs2">
          <legend> {legendName} : {sidenote}</legend>

          <textarea id="textarea2"
                    value={sequence}
                    spellCheck="false"
                    readOnly={true}
                    />
        </fieldset>
      );
  }
}
