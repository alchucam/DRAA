

import React, { Component } from "react";
import ContainerM from './ContainerM';
import ContainerBottom from './ContainerBottom';
import {geneticCode} from './GeneticCode';
import {DNAsequence, RNAsequence, AAsequence} from './Convert';

var gDNAsequence = DNAsequence;
var gRNAsequence = RNAsequence;
var gAAsequence = AAsequence;


var dna = ["A","T","C","G"];

var counter = 0;
export var DSDiff = 0;
export var ASDiff = 0;
export var countSub = 0;
export var countNon = 0;
export var countMis = 0;
export var countSil = 0;

var capital = {
  color: "red",
};


function replaceAt(string, index, replace) {
  return string.substring(0, index) + replace + string.substring(index + 1);
}


//one in 30 million nucleotides each generation
//= 3.33e-8
function mutation(sequence){
  for (var i = 0; i < sequence.length; i++){
    var random = Math.random();
    //0.0333% for 1,000,000 generation
    // if (random < 0.0333){
    if (random < 0.0333){
      var leafRandom = Math.floor(Math.random()*4);
      while (dna[leafRandom] === sequence[i]){
        leafRandom = Math.floor(Math.random()*4);
      }
      //now Mutate
      sequence = replaceAt(sequence, i, dna[leafRandom]);
    }
  }
  return sequence;
}



function getDsDiff(original, sequence){
    var count = 0;
    for (var i = 0; i < original.length; i++){
      if (original[i] !== sequence[i]){
        count++;
      }
    }
    countSub = count;
    DSDiff = (count/(original.length)*100).toFixed(2);
}

function getAsDiff(original, sequence, DNAoriginal, DNAsequence){
    var count = 0;
    var numAA = 0;
    var startO = 0;
    var endO = startO+3;
    var startS = 0;
    var endS = startS+3;
    countNon = 0;
    countSil = 0;

    while (endO <= original.length){
      console.log(original.substring(startO,endO));
      console.log(sequence.substring(startO,endO));
      if (original.substring(startO,endO+1) === 'Stop'){
        if (sequence.substring(startS, endS+1) === 'Stop'){
          startS += 4;
          endS = startS + 3;
          //check if AA is ok but DNA ok?
          if (DNAoriginal.substring(startO,endO) !== DNAsequence.substring(startO,endO)){
            countSil++;
          }
        }
        else {
          count++;
          startS += 3;
          endS = startS +3;

        }
        startO += 4;
        endO = startO+3;
      }
      else{
        if (original.substring(startO, endO) === sequence.substring(startS, endS)){
          startS += 3;
          endS = startS+3;
          if (DNAoriginal.substring(startO,endO) !== DNAsequence.substring(startO,endO)){
            countSil++;
          }
        }
        else{
          if (sequence.substring(startS, endS+1) === 'Stop'){
            startS += 4;
            endS = startS +3;
            countNon++;
          }
          else{
            startS += 3;
            endS = startS +3;
          }
          count++;
        }
        startO += 3;
        endO = startO +3;
      }
      numAA++;
    }
    countMis = count;
    ASDiff = ((count/numAA)*100).toFixed(2);
}


class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {number: 0, cDNAsequence: DNAsequence, cAAsequence:AAsequence};
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.state.cDNAsequence = mutation(this.state.cDNAsequence);
      var tempRNA = fromDNA(this.state.cDNAsequence);
      this.state.cAAsequence = fromRNA(tempRNA);
      getDsDiff(DNAsequence, this.state.cDNAsequence);
      getAsDiff(AAsequence, this.state.cAAsequence, DNAsequence, this.state.cDNAsequence);
      this.setState({number: this.state.number + 1, counter:this.state.number+1, cDNAsequence: this.state.cDNAsequence, cAAsequence: this.state.cAAsequence});
    }, 1000);
  }


  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidUpdate(prevProps) {

    // Typical usage (don't forget to compare props):
    if (this.state.cDNAsequence !== prevProps.mDNAsequence) {
      gDNAsequence = this.state.cDNAsequence;

      this.props.onCounter();
      // console.log(this.state.number);
     }
  }

  render() {
    const isMutating = this.props.isMutating;
    var cDNAsequence = this.props.mDNAsequence;
    var cAAsequence = this.props.mAAsequence;
    // counter = this.state.number;
    return (
        <div>
      <ContainerBottom
        legendName="Mutate"
        isMutating={isMutating}
        Dsequence={cDNAsequence}
        Asequence={cAAsequence}
        counter={this.state.number}
        onButtonChange={this.props.onExit}
        name="Stop"
        DNAoriginal={DNAsequence}
        AAoriginal={AAsequence}

      />
      </div>
    )
  }
}





function fromDNA(sequence){
  for (var i = 0; i < sequence.length; i++){
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
  return sequence;
}

function fromRNA(sequence){
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
  return sequence;
}



export default class Mutate extends Component {
  constructor(props){
    super(props);
    this.handleMutate = this.handleMutate.bind(this);
    this.state = {legendName:'',mDNAsequence:DNAsequence, mRNAsequence:RNAsequence, mAAsequence:AAsequence, isMutating:false};
  }

  //makes the parameter as a string. convert manually to boolean!!
  handleMutate(isMutating){
      //technically, it will always be false when handled. but for safe-box purpose.
      if (isMutating === "false"){
        isMutating = true;
        this.setState({isMutating});
      }
      else{
        isMutating = false;
          this.setState({isMutating});
      }
  }




  render() {
    const legendName = this.state.legendName;
    var mDNAsequence = this.state.mDNAsequence;
    var mRNAsequence = this.state.mRNAsequence;
    var mAAsequence =  this.state.mAAsequence;
    const isMutating = this.state.isMutating;

    mRNAsequence = fromDNA(mDNAsequence);
    mAAsequence = fromRNA(mRNAsequence);


    if (isMutating){
      return (
        <div>
      <ContainerM
        legendName="DNA"
        sidenote="Only A, T, C or G will be inputted"
        sequence={mDNAsequence}
        />
      <ContainerM
        legendName="RNA"
        sidenote="Only U, A, G or C will be inputted"
        sequence={mRNAsequence}
        />
      <ContainerM
        legendName="AMINO ACID"
        sidenote="Only the valid three-letters Amino Acids or Stop will be inputted"
        sequence={mAAsequence}
        />

      <Counter
        onExit={() => this.setState({isMutating:false})}
        onCounter={()=> this.setState({mDNAsequence:gDNAsequence})}
        // onCounter={()=> console.log(Dsequence)}
        mDNAsequence={mDNAsequence}
        mAAsequence={mAAsequence}
        />
      </div>
    )
    }
    else{
      return (
        <div>
        <ContainerM
          legendName="DNA"
          sidenote="Only A, T, C or G will be inputted"
          sequence={mDNAsequence}
          />
        <ContainerM
          legendName="RNA"
          sidenote="Only U, A, G or C will be inputted"
          sequence={mRNAsequence}
          />
        <ContainerM
          legendName="AMINO ACID"
          sidenote="Only the valid three-letters Amino Acids or Stop will be inputted"
          sequence={mAAsequence}
          />
        <ContainerBottom
          legendName="Mutate"
          Dsequence={mDNAsequence}
          Asequence={mAAsequence}
          isMutating={isMutating}
          onButtonChange={this.handleMutate}
          counter = {counter}
          name="Mutate"
          DNAoriginal = {DNAsequence}
          AAoriginal = {AAsequence}
        />
      </div>
      )
    }

  }
}
