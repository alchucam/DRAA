//oninput instead of onchange

import React, { Component } from "react";
import './ContainerBottom.css';
import {ButtonToolbar, Button} from "react-bootstrap"
//import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from "react-bootstrap";
import { DSDiff, ASDiff, countSub, countNon, countMis, countSil, countIns, countDel } from './Counter.js'








export default class ContainerBottom extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      isMutating: false,
    };
  }

  handleChange(event) {
      this.props.onButtonChange(event.target.value);
      // console.log(event.target.value);
  }



  render() {

      const Dsequence = this.props.Dsequence;
      const Asequence = this.props.Asequence;
      const isMutating = this.props.isMutating;
      const counter = this.props.counter;
      const name1 = this.props.name1;
      const name2 = this.props.name2;
      const DNAoriginal = this.props.DNAoriginal;
      const AAoriginal = this.props.AAoriginal;



      return (
        <fieldset id="wrapperfsB">

          <div id="textareaB"
                    spellCheck="false"
                    readOnly = {true}
                    >

                    Original DNA Sequence: {DNAoriginal} <br/>
                    Mutated DNA Sequence: &nbsp;{Dsequence} <br/>
                    Original AA Sequence: &nbsp;{AAoriginal} <br/>
                    Mutated AA Sequence:  &nbsp; {Asequence} <br/>
                    Generation: {counter} &nbsp; DNA Sequence Difference: {DSDiff}% &nbsp; AA Sequence Difference: {ASDiff}% <br/>
                    # of Mutation -> Substitution: {countSub}  Insertion: {countIns} Deletion: {countDel} &nbsp; <br/>
                    Missense: {countMis} Silent: {countSil} Nonsense: {countNon} <br/>


            </div>
        </fieldset>
      );
  }
}
