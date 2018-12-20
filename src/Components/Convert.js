//oninput instead of onchange

import React, { Component } from "react";
import Container from './Container';

var capital = {
  color: "red",
};


function replaceAt(string, index, replace) {
  return string.substring(0, index) + replace + string.substring(index + 1);
}

function capitalize(sequence){
    return sequence.toUpperCase();
}

function fromRNA(toName, sequence){
  for (var i = 0; i < sequence.length; i++){
    if (toName === 'DNA'){
      if (sequence.charAt(i) === 'U'){
        sequence = replaceAt(sequence, i, 'A');
      }
      else if (sequence.charAt(i) === 'A'){
        sequence = replaceAt(sequence, i, 'T');
      }
      else if (sequence.charAt(i) === 'G'){
        sequence = replaceAt(sequence, i, 'C');
      }
      else if (sequence.charAt(i) === 'C'){
        sequence = replaceAt(sequence, i, 'G');
      }
    }
  }
  return sequence;
}

function fromDNA(toName, sequence){
  for (var i = 0; i < sequence.length; i++){
    if (toName === 'RNA'){
      if (sequence.charAt(i) === 'A'){
        sequence = replaceAt(sequence, i, 'U');
      }
      else if (sequence.charAt(i) === 'T'){
        sequence = replaceAt(sequence, i, 'A');
      }
      else if (sequence.charAt(i) === 'C'){
        sequence = replaceAt(sequence, i, 'G');
      }
      else if (sequence.charAt(i) === 'G'){
        sequence = replaceAt(sequence, i, 'C');
      }
    }
  }
  return sequence;
}

function tryConvert(fromName, toName, sequence){
  if (sequence === ''){
    return '';
  }
  var output = '';
  if (fromName === 'RNA' && toName === 'DNA'){
      output = fromRNA(toName, sequence);
  }
  if (fromName === 'DNA' && toName === 'RNA'){
    output = fromDNA(toName, sequence);
  }
  return output;
}

export default class Convert extends Component {
  constructor(props){
    super(props);
    this.handleDNAChange = this.handleDNAChange.bind(this);
    this.handleRNAChange = this.handleRNAChange.bind(this);
    this.state = {legendName:'',sequence:''};
  }

  handleDNAChange(sequence){
    if (sequence === ''){
      this.setState({legendName:'DNA',sequence});
    }

    sequence = capitalize(sequence);
    // const start = this.refs.input.target.selectionStart;
    // const caretEnd = e.target.selectionEnd;
    if (/^[ATCG]+$/.test(sequence)){
      this.setState({legendName:'DNA', sequence});
                  //  () => this.refs.input.selectionStart = this.refs.input.selectionEnd = start + 1);
    }
  }

  handleRNAChange(sequence){
    if (sequence === ''){
      this.setState({legendName:'DNA',sequence});
    }
    
    sequence = capitalize(sequence);
    if (/^[UAGC]+$/.test(sequence)){
      this.setState({legendName:'RNA', sequence});
    }
  }

  render() {
    const legendName = this.state.legendName;
    const sequence = this.state.sequence;
    var DNAsequence = '';
    var RNAsequence = '';
    if (legendName === 'DNA'){
      DNAsequence = sequence;
      RNAsequence = tryConvert('DNA', 'RNA', sequence);
    }
    else if (legendName === 'RNA'){
      DNAsequence = tryConvert('RNA', 'DNA', sequence);
      RNAsequence = sequence;
    }


    const sidenote = this.state.sidenote;


      return (
        <div>
        <Container
          legendName="DNA"
          sidenote="Please enter only A, T, C or G"
          sequence={DNAsequence}
          onSequenceChange={this.handleDNAChange}/>
        <Container
          legendName="RNA"
          sidenote="Please enter only U, A, G or C"
          sequence={RNAsequence}
          onSequenceChange={this.handleRNAChange}/>
        <Container
          legendName="AMINO ACID"
          sidenote="Please ..."
          sequence={sequence}
          onSequenceChange={this.handleDNAChange}/>
      </div>
      );
  }
}
