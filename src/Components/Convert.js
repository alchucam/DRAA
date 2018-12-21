//oninput instead of onchange

import React, { Component } from "react";
import Container from './Container';
import NavSide from './NavSide';
import {geneticCode} from './GeneticCode';
import './Convert.css'

var aa = ["Ala", "Arg", "Asn", "Asp", "Cys", "Glu", "Gln", "Gly", "His", "Ile", "Leu", "Lys", "Met", "Phe", "Pro", "Ser", "Thr", "Trp", "Tyr", "Val"];

// var pause = false;

export var DNAsequence = '';
export var RNAsequence = '';
export var AAsequence = '';


function replaceAt(string, index, replace) {
  return string.substring(0, index) + replace + string.substring(index + 1);
}

function capitalize(sequence){
    return sequence.toUpperCase();
}

function capitalizeFirstPre(string){
  if (string.length < 3){
    return string;
  }
  return capitalizeFirst(string,0,3);
}

function capitalizeFirst(string, indexFrom, indexTo){
  if (indexFrom > string.length){
    return "";
  }
  if (indexTo > string.length){
    return string.substring(indexFrom, string.length);
  }
  //check for Stop (4 characters)
  if (string.substring(indexFrom, indexTo+1).toUpperCase().includes("STOP")){
    return string.substring(indexFrom, indexFrom+1).toUpperCase() + string.substring(indexFrom+1, indexTo+1).toLowerCase() + capitalizeFirst(string, indexFrom+4, indexTo+4);
  }
  else{
    return string.substring(indexFrom, indexFrom+1).toUpperCase() + string.substring(indexFrom+1, indexTo).toLowerCase() + capitalizeFirst(string, indexFrom+3, indexTo+3);
  }
}

function breakDownAA(sequence){
  var start = 0;
  var end = 3;
  var check = false;
  var twoCheck = false;
  while (end <= sequence.length){
    if (sequence.substring(start, end+1) === 'Stop'){
      check = true;
      start = start +4;
      end = start + 3;
    }
    /*
    else if (sequence.substring(start, end) === 'Sto'){
      check = true;
      start = start +3;
      end = start + 3;
    }
    */
    else {
      for (var key in aa){
        // console.log("inside");
        // console.log(aa[key]);
        // if (sequence.substring(start, end+1) === 'Stop'){
        //   check = true;
        //   start = start +4;
        //   end = start + 3;
        //   break;
        // }
        if (sequence.substring(start,end) === aa[key]){
          check = true;
          start = start +3;
          end = start + 3;
          break;
        }

      }
    }

    if (check){
      check = false;
    }
    else if (twoCheck && !check){
      return false;
    }
    else if (!check){
      // console.log(sequence);
      // console.log(sequence.substring(start,end));
      twoCheck = true;
      start = start +3;
      end = start+3;
    }

  }
  return true;
}

function fromRNA(toName, sequence){
  if (toName === 'DNA'){
    for (var i = 0; i < sequence.length; i++){
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
  else if (toName === 'AMINO ACID'){
    var start = 0;
    var end = start+3;
    while (end <= sequence.length){
      var sub = geneticCode.reduce(function (codon, geneticCode){
        return (codon.RNA === sequence.substring(start, end)) ? codon : geneticCode;},{});
      sequence = sequence.replace(sequence.substring(start,end), sub.AA);
      if (sub.AA === 'Stop'){
        start = start+4;
        end = start+3;
      }
      else {
      start = start+3;
      end = start+3;
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
    else if (toName === 'AMINO ACID'){

    }
  }
  return sequence;
}

function fromAA(toName, sequence){
  if (toName === 'RNA'){
    var start = 0;
    var end = start+3;
    while (end <= sequence.length){
      //special case: Stop
      if (sequence.substring(start, end+1) === 'Stop'){
        sequence = sequence.replace(sequence.substring(start, end+1), "UAG");
      }
      else {
        var sub = geneticCode.reduce(function (codon, geneticCode){
          return (codon.AA === sequence.substring(start, end)) ? codon : geneticCode;},{});
        if (sub.RNA === 'GGG'){
          sequence = sequence.replace(sequence.substring(start,end), 'XXX');
        }
        else{
          sequence = sequence.replace(sequence.substring(start,end), sub.RNA);
        }
      }
      start = start+3;
      end = start+3;
    }
    while (end > sequence.length && start < sequence.length){
      //sequence = sequence.replace(sequence.substring(start, sequence.length), 'X');
      sequence = replaceAt(sequence, start, 'X');
      // replaceAt(sequence, i, 'G');
      start++;
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
  else if (fromName === 'DNA' && toName === 'RNA'){
    output = fromDNA(toName, sequence);
  }
  else if (fromName === 'RNA' && toName === 'AMINO ACID'){
    output = fromRNA(toName, sequence);
  }
  else if (fromName === 'AMINO ACID' && toName === 'RNA'){
    output = fromAA(toName, sequence);
  }
  return output;
}

export default class Convert extends Component {
  constructor(props){
    super(props);
    this.handleDNAChange = this.handleDNAChange.bind(this);
    this.handleRNAChange = this.handleRNAChange.bind(this);
    this.handleAAChange = this.handleAAChange.bind(this);
    this.state = {legendName:'',sequence:''};
  }

  handleDNAChange(sequence){
    if (sequence === ''){
      this.setState({legendName:'DNA',sequence});
    }
    sequence = capitalize(sequence);

    if (/^[ATCG]+$/.test(sequence)){
      this.setState({legendName:'DNA', sequence});
    }



  }

  handleRNAChange(sequence){
    if (sequence === ''){
      this.setState({legendName:'RNA',sequence});
    }
    sequence = capitalize(sequence);
    if (/^[UAGC]+$/.test(sequence)){
      this.setState({legendName:'RNA', sequence});
    }
  }





  handleAAChange(sequence){
    if (sequence === ''){
      this.setState({legendName:'AMINO ACID',sequence});
    }
    sequence = capitalizeFirstPre(sequence);

    if (breakDownAA(sequence) && /^[A-Za-z]+$/.test(sequence)){
        this.setState({legendName:'AMINO ACID', sequence});
    }


  }

  render() {
    const legendName = this.state.legendName;
    const sequence = this.state.sequence;
    // var DNAsequence = '';
    // var RNAsequence = '';
    // var AAsequence = '';
    DNAsequence = '';
    RNAsequence = '';
    AAsequence = '';
    if (legendName === 'DNA'){
      DNAsequence = sequence;
      RNAsequence = tryConvert('DNA', 'RNA', sequence);
      AAsequence = tryConvert('RNA', 'AMINO ACID', RNAsequence);
    }
    else if (legendName === 'RNA'){
      DNAsequence = tryConvert('RNA', 'DNA', sequence);
      RNAsequence = sequence;
      AAsequence = tryConvert('RNA', 'AMINO ACID', sequence);
    }
    else if (legendName === 'AMINO ACID'){
      RNAsequence = tryConvert('AMINO ACID', 'RNA', sequence);
      DNAsequence = tryConvert('RNA', 'DNA', RNAsequence);
       AAsequence = sequence;
      //AAsequence = tryConvert('RNA','AMINO ACID', RNAsequence)
    }



      return (
        <div id="containerwrapper">

        <Container
          legendName="DNA"
          sidenote="Only A, T, C or G will be inputted"
          sequence={DNAsequence}
          onSequenceChange={this.handleDNAChange}/>
        <Container
          legendName="RNA"
          sidenote="Only U, A, G or C will be inputted"
          sequence={RNAsequence}
          onSequenceChange={this.handleRNAChange}/>
        <Container
          legendName="AMINO ACID"
          sidenote="Only the valid three-letters Amino Acids or Stop will be inputted"
          sequence={AAsequence}
          onSequenceChange={this.handleAAChange}/>

      </div>
      );
  }
}
