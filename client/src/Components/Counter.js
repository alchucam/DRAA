import React, { Component } from "react";
import {DNAsequence, RNAsequence, AAsequence} from './Convert';
import {geneticCode} from './GeneticCode';
import ContainerBottom from './ContainerBottom';
import Buttonn from './Buttonn';
import {ButtonGroup} from "react-bootstrap";
import {repair, generationR, targetSequence} from './Repair'
import Chart from './Chart';
export var gDNAsequence = DNAsequence;

var dna = ["A","T","C","G"];
var type = ["Sub", "Ins", "Del"];

var tempcAAsequence = '';
var tempcDNAsequence = '';
var tempcRNAsequence = '';

//variable information for ContainerBottom
export var counter = 0;
export var DSDiff = 0; export var ASDiff = 0; //display difference
export var countSub = 0; export var countIns = 0; export var countDel = 0;
export var countMis = 0; export var countSil = 0; export var countNon = 0;

var DSDIFFpos = [];
var RSDIFFpos = [];
var ASDIFFposS = [];
var ASDIFFposE = [];

var capital = {
  color: "red",
};

//generic function to replace a character at the index of the string
export function replaceAt(string, index, replace) {
  return string.substring(0, index) + replace + string.substring(index + 1);
}

//generic function to insert a character in the string
function insertion(string, index, insert){
  return string.substring(0, index) + insert + string.substring(index);
}

//one in 30 million nucleotides each generation
//= 3.33e-8
//Currently, it is set to 1 generation has 0.03% chance of mutate rate per DNA sequence character
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

//obtain the number and position of difference between original and mutated DNA sequence
export function getDsDiff(original, sequence){
    var count = 0;
    DSDIFFpos = [];
    RSDIFFpos = [];
    for (var i = 0; i < original.length; i++){
      if (original[i] !== sequence[i]){
        DSDIFFpos.push(i);
        RSDIFFpos.push(i);
        count++;
      }
    }
    countSub = count;
    return (count/(original.length)*100);
}

//obtain the number and position of difference between original and mutated AA sequence
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

//obtain count of Insertion and Deletion in the mutation
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

//find the corresponding RNA<->AA codon from genetic Code.
function reduceGenCode(sequence, start, end){
  return geneticCode.reduce(function (codon, geneticCode){ return (codon.RNA === sequence.substring(start, end)) ? codon : geneticCode;},{});
}

//convert sequence from DNA to RNA
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

//convert sequence from RNA to AA.
export function fromRNA(sequence){
    var start = 0;
    var end = start+3;
    while (end <= sequence.length){
      var sub = reduceGenCode(sequence, start, end);
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
                  cRNAsequence: RNAsequence,
                  cAAsequence:AAsequence,
                  DsequencePrint: [DNAsequence],
                  RsequencePrint: [RNAsequence],
                  AsequencePrint: [AAsequence],
                  generationRepair: 0,
                  targetSequenceRepair: DNAsequence,
                  scrollStart: 0, scrollEnd: 20,
                  sub: [0], ins: [0], del: [0], mis: [0], sil: [0], non: [0],
                  };
    }

  componentDidMount() {
    //for every 1 second, if mutate button is pressed, mutate the sequence based on the chance by mutation function,
    //update the sequences accordingly, and update the chart as well.
    //if repair button is pressed additionally, call repair function to perform genetic algorithm
    //to figure out how many generation it takes to repair the mutated sequence to original sequence.
    this.interval = setInterval(() => {
      if (this.props.isRepairing){
        repair(DNAsequence, this.state.cDNAsequence);
        this.props.onRExit();
      }
      if (this.props.isMutating){
        tempcDNAsequence = mutation(this.state.cDNAsequence);
        tempcRNAsequence = fromDNA(tempcDNAsequence);
        tempcAAsequence = fromRNA(tempcRNAsequence);
        DSDiff = getDsDiff(DNAsequence, tempcDNAsequence);
        DSDiff = DSDiff.toFixed(2);
        getInsDel(DNAsequence, tempcDNAsequence);
        getAsDiff(AAsequence, tempcAAsequence, DNAsequence, tempcDNAsequence);
        this.setState({ number: this.state.number + 1,
                        cDNAsequence: tempcDNAsequence,
                        cRNAsequence: tempcRNAsequence,
                        cAAsequence: tempcAAsequence,
                        DsequencePrint: this.pickError(tempcDNAsequence, DNAsequence, DSDIFFpos),
                        RsequencePrint: this.pickError(tempcRNAsequence, RNAsequence, RSDIFFpos),
                        AsequencePrint: this.pickErrorAA(tempcAAsequence),
                        generationRepair: generationR,
                        targetSequenceRepair: targetSequence,
                        scrollStart: this.state.number < 20 ? 0 : this.state.scrollStart + 1,
                        scrollEnd: this.state.number < 20 ? 20 : this.state.scrollEnd + 1,
                        sub: this.state.sub.concat(countSub), ins: this.state.ins.concat(countIns), del: this.state.del.concat(countDel),
                        mis: this.state.mis.concat(countMis), sil: this.state.sil.concat(countSil), non: this.state.non.concat(countNon),
                      });
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  //used to update state of upper layer (Mutate.js) when state of lower layer (Counter.js) has been updated.
  componentDidUpdate(prevProps) {
    if (this.state.cDNAsequence !== prevProps.mDNAsequence) {
      gDNAsequence = this.state.cDNAsequence;
      this.props.onCounter();
     }
  }

  //pick out the difference in the mutated sequence from the DNA or RNA originalSequence, add red color to those characters.
  pickError = (sequence, originalSequence, pos) =>{
    var errorLine = [];
    var keyN = 0;
    for (var i = 0; i < sequence.length; i++){
      if (pos !== undefined && pos.length !== 0){
        if (pos[0] === i){
          errorLine.push(<span key={keyN} style={capital}>{sequence[i]}</span>);
          pos.shift();
          keyN++;
        }
        else{
          errorLine.push(sequence[i]);
        }
      }
      else {
        if (sequence.length <= originalSequence.length){
          errorLine.push(sequence.substring(i));
        }
        else if (i <= originalSequence.length){
          errorLine.push(sequence.substring(i,originalSequence.length));
          errorLine.push(<span key={keyN} style={capital}>{sequence.substring(originalSequence.length)}</span>);
          keyN++;
        }
        else {
          errorLine.push(<span key={keyN} style={capital}>{sequence.substring(originalSequence.length)}</span>);
          keyN++;
        }
        break;
      }
    }
    return errorLine
  }

  //pick out the difference in the mutated sequence from the AA originalSequence, add red color to those characters.
  pickErrorAA = (Asequence) =>{
    var errorLine = [];
    var i = 0;
    var keyN = 0;
    while (i <= Asequence.length){

      if (ASDIFFposS !== undefined && ASDIFFposS.length !== 0){
        if (ASDIFFposS[0] === i){
          errorLine.push(<span key={keyN} style={capital}>{Asequence.substring(ASDIFFposS[0],ASDIFFposE[0])}</span>);
          keyN++;
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
            errorLine.push(<span key={keyN} style={capital}>{Asequence.substring(AAsequence.length)}</span>);
            keyN++;
          }
          else {
            errorLine.push(<span key={keyN} style={capital}>{Asequence.substring(AAsequence.length)}</span>);
            keyN++;
          }
        }
        break;
      }
    }
    return errorLine;
  }

  render() {
    const isMutating = this.props.isMutating;
    const isRepairing = this.props.isRepairing;
    var nameM = this.props.nameM;
    var nameR = this.props.nameR;
    var DsequencePrint = this.state.DsequencePrint;
    var RsequencePrint = this.state.RsequencePrint;
    var AsequencePrint = this.state.AsequencePrint;

    //button state depends on the pressed.
    var mButtonChangeState;
    var rButtonChangeState;

    //if only mutate button is pressed
    if (isMutating && !isRepairing){
      mButtonChangeState = this.props.onMExit;
      rButtonChangeState = this.props.onREnter;
    }
    //if only repair button is pressed
    else if (isRepairing && !isMutating){
      mButtonChangeState = this.props.onMEnter;
      rButtonChangeState = this.props.onRExit;
    }
    //if both mutate and repair button is pressed
    else {
      mButtonChangeState = this.props.onMExit;
      rButtonChangeState = this.props.onRExit;
    }

      return (
          <span>
            <legend> Mutate && Repair </legend>
            <ButtonGroup>
              <Buttonn
                    pressed={isMutating}
                    onButtonChange={mButtonChangeState}
                    name = {nameM}/>
              <Buttonn
                    pressed={isRepairing}
                    onButtonChange={rButtonChangeState}
                    name = {nameR}/>
            </ButtonGroup>
            <br/>
            <Chart
              number = {this.state.number}
              scrollStart = {this.state.scrollStart}
              scrollEnd = {this.state.scrollEnd}
              sub = {this.state.sub} ins = {this.state.ins} del = {this.state.del}
              mis = {this.state.mis} sil = {this.state.sil} non = {this.state.non}
              />
            <ContainerBottom
              DsequencePrint={DsequencePrint}
              RsequencePrint={RsequencePrint}
              AsequencePrint={AsequencePrint}
              isMutating={isMutating}
              isRepairing={isRepairing}
              counter={this.state.number}
              DNAoriginal={DNAsequence}
              RNAoriginal={RNAsequence}
              AAoriginal={AAsequence}
              generationRepair = {generationR}
              targetSequenceRepair = {targetSequence}
            />
          </span>
      )

  }
}
