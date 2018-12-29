//oninput instead of onchange

import React, { Component } from "react";
import './ContainerBottom.css';
import { DSDiff, ASDiff, countSub, countNon, countMis, countSil, countIns, countDel } from './Counter.js'







export default class ContainerBottom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMutating: false,
    };
  }

  render() {

      const counter = this.props.counter;
      const DNAoriginal = this.props.DNAoriginal;
      const RNAoriginal = this.props.RNAoriginal;
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
                    Original DNA Sequence:{DNAoriginal} <br/>
                    Mutated DNA Sequence: {this.props.DsequencePrint.map((data, index) => {return data})} <br/>
                    Original RNA Sequence: {RNAoriginal} <br/>
                    Mutated RNA Sequence: {this.props.RsequencePrint.map((data, index) => {return data})} <br/>
                    Original AA Sequence: {AAoriginal} <br/>
                    Mutated &nbsp;AA Sequence: {this.props.AsequencePrint.map((data, index) => {return data})} <br/>
                    Generation: {counter} &nbsp; DNA Sequence Difference: {DSDiff}% &nbsp; AA Sequence Difference: {ASDiff}% <br/>
                    # of Mutation -> Substitution: {countSub}  Insertion: {countIns} Deletion: {countDel} &nbsp; <br/>
                    Missense: {countMis} Silent: {countSil} Nonsense: {countNon} <br/>
                    <b>Repair (Genetic Algorithm)</b> <br />
                    Target DNA Sequence to fix: {targetSequenceRepair} <br/>
                    Repair Generation: {generationRepair} <br/>

            </div>
        </fieldset>
      );
  }
}
