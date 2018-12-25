//oninput instead of onchange

import React, { Component } from "react";
import './ContainerBottom.css';
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
      const counter = this.props.counter;
      const DNAoriginal = this.props.DNAoriginal;
      const AAoriginal = this.props.AAoriginal;

      const generationRepair = this.props.generationRepair;
      const targetSequenceRepair = this.props.targetSequenceRepair;


      return (
        <fieldset id="wrapperfsB">

          <div id="textareaB"
                    spellCheck="false"
                    readOnly = {true}
                    >
                    <b>Mutate</b> <br/>
                    Original DNA Sequence: {DNAoriginal} <br/>
                    Mutated DNA Sequence: &nbsp;{Dsequence} <br/>
                    Original AA Sequence: &nbsp;{AAoriginal} <br/>
                    Mutated AA Sequence:  &nbsp; {Asequence} <br/>
                    Generation: {counter} &nbsp; DNA Sequence Difference: {DSDiff}% &nbsp; AA Sequence Difference: {ASDiff}% <br/>
                    # of Mutation -> Substitution: {countSub}  Insertion: {countIns} Deletion: {countDel} &nbsp; <br/>
                    Missense: {countMis} Silent: {countSil} Nonsense: {countNon} <br/>
                    <b>Repair</b> <br />
                    Target DNA Sequence to fix: {targetSequenceRepair} <br/>
                    Repair Generation: {generationRepair} <br/>

            </div>
        </fieldset>
      );
  }
}
