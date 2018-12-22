import React, { Component } from "react";
import {DNAsequence, AAsequence} from './Convert';
import {geneticCode} from './GeneticCode';
import ContainerBottom from './ContainerBottom';

export var gDNAsequence = DNAsequence;



var dna = ["A","T","C","G"];
var type = ["Sub", "Ins", "Del"];

export var counter = 0;


export var DSDiff = 0;
export var ASDiff = 0;
export var countSub = 0;
export var countNon = 0;
export var countMis = 0;
export var countSil = 0;
export var countIns = 0;
export var countDel = 0;

var DSDIFFpos = [];
var ASDIFFposS = [];
var ASDIFFposE = [];

var capital = {
  color: "red",
};


export function replaceAt(string, index, replace) {
  return string.substring(0, index) + replace + string.substring(index + 1);
}

function insertion(string, index, insert){
  return string.substring(0, index) + insert + string.substring(index);
}



//one in 30 million nucleotides each generation
//= 3.33e-8
function mutation(sequence){
  for (var i = 0; i < sequence.length; i++){
    var random = Math.random();
    //0.0333% for 1,000,000 generation
    // if (random < 0.0333){
    if (random < 0.0333){
      var mutType = Math.floor(Math.random()*3);
      var leafRandom = Math.floor(Math.random()*4);

      if (type[mutType] === "Sub"){
        while (dna[leafRandom] === sequence[i]){
          leafRandom = Math.floor(Math.random()*4);
        }
        //now Mutate
        sequence = replaceAt(sequence, i, dna[leafRandom]);
      }
      else if (type[mutType] === "Ins"){
        sequence = insertion(sequence, i, dna[leafRandom]);
      }
      else if (type[mutType] === "Del"){
        sequence = replaceAt(sequence, i, '');
      }
    }
  }
  return sequence;
}



function getDsDiff(original, sequence){
    var count = 0;
    DSDIFFpos = [];
    for (var i = 0; i < original.length; i++){
      if (original[i] !== sequence[i]){
        DSDIFFpos.push(i);
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
    ASDIFFposS = [];
    ASDIFFposE = [];
    while (endO <= original.length){

      if (original.substring(startO,endO+1) === 'Stop'){
        if (sequence.substring(startS, endS+1) === 'Stop'){
          startS += 4;
          endS = startS + 3;
          //check if AA is ok but DNA ok?
          if (DNAoriginal.substring(startO,endO) !== DNAsequence.substring(startO,endO)){
            countSil++;
          }
        }
        else { //difference!
          count++;
          ASDIFFposS.push(startS);
          ASDIFFposE.push(endS);
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
        else{ //difference!
          if (sequence.substring(startS, endS+1) === 'Stop'){
            ASDIFFposS.push(startS);
            ASDIFFposE.push(endS+1);
            startS += 4;
            endS = startS +3;
            countNon++;
          }
          else{
            ASDIFFposS.push(startS);
            ASDIFFposE.push(endS);
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

function getInsDel(original, sequence){
  countIns = 0;
  countDel = 0;
  if (original.length > sequence.length){
    countDel = original.length - sequence.length;
  }
  else if (original.length < sequence.length){
    countIns = sequence.length - original.length;
  }
}

export function fromDNA(sequence){
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

export function fromRNA(sequence){
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

export default class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {number: 0,
                  cDNAsequence: DNAsequence,
                  cAAsequence:AAsequence,
                  DsequencePrint: DNAsequence,
                  AsequencePrint: AAsequence};
                  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.state.cDNAsequence = mutation(this.state.cDNAsequence);
      var tempRNA = fromDNA(this.state.cDNAsequence);
      this.state.cAAsequence = fromRNA(tempRNA);
      getDsDiff(DNAsequence, this.state.cDNAsequence);
      getInsDel(DNAsequence, this.state.cDNAsequence);
      getAsDiff(AAsequence, this.state.cAAsequence, DNAsequence, this.state.cDNAsequence);
      this.setState({ number: this.state.number + 1,
                      counter:this.state.number+1,
                      cDNAsequence: this.state.cDNAsequence,
                      cAAsequence: this.state.cAAsequence,
                      DsequencePrint: this.pickErrorDNA(this.state.cDNAsequence),
                      AsequencePrint: this.pickErrorAA(this.state.cAAsequence),
                    });
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

  pickErrorDNA = (Dsequence) =>{
    var errorLine = [];
    for (var i = 0; i < Dsequence.length; i++){
      if (DSDIFFpos !== undefined && DSDIFFpos.length !== 0){
        if (DSDIFFpos[0] === i){
          errorLine.push(<span style={capital}>{Dsequence[i]}</span>);
          DSDIFFpos.shift();
        }
        else{
          errorLine.push(Dsequence[i]);
        }
      }
      else {
        if (Dsequence.length <= DNAsequence.length){
          errorLine.push(Dsequence.substring(i));
        }
        else if (i <= DNAsequence.length){
          errorLine.push(Dsequence.substring(i,DNAsequence.length));
          errorLine.push(<span style={capital}>{Dsequence.substring(DNAsequence.length)}</span>);
        }
        else {
          errorLine.push(<span style={capital}>{Dsequence.substring(DNAsequence.length)}</span>);
        }
        break;
      }
    }
    return errorLine
  }

  pickErrorAA = (Asequence) =>{
    var errorLine = [];
    var i = 0;

    while (i <= Asequence.length){

      if (ASDIFFposS !== undefined && ASDIFFposS.length !== 0){
        if (ASDIFFposS[0] === i){
          errorLine.push(<span style={capital}>{Asequence.substring(ASDIFFposS[0],ASDIFFposE[0])}</span>);
          i += (ASDIFFposE[0] - ASDIFFposS[0]);
          ASDIFFposS.shift();
          ASDIFFposE.shift();
        }
        else{
          errorLine.push(Asequence[i]);
          i++;
        }
      }
      else {
        if (Asequence.length <= AAsequence.length){
          errorLine.push(Asequence.substring(i));
        }
        else {
          if (i <= AAsequence.length){
            errorLine.push(Asequence.substring(i,AAsequence.length));
            errorLine.push(<span style={capital}>{Asequence.substring(AAsequence.length)}</span>);
          }
          else {
            errorLine.push(<span style={capital}>{Asequence.substring(AAsequence.length)}</span>);
          }
        }
        break;
      }
    }
    // console.log(errorLine);
    return errorLine;
  }

  render() {
    const isMutating = this.props.isMutating;
    // var cDNAsequence = this.props.mDNAsequence;

    var DsequencePrint = this.state.DsequencePrint;
    var AsequencePrint = this.state.AsequencePrint;

    // var cAAsequence = this.props.mAAsequence;

    return (
        <div>
      <ContainerBottom
        legendName="Mutate"
        isMutating={isMutating}
        // Dsequence={cDNAsequence}
        Dsequence={DsequencePrint}
        Asequence={AsequencePrint}
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
