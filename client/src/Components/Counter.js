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
//for setState

var tempcAAsequence = '';
var tempcDNAsequence = '';
var tempcRNAsequence = '';

export var counter = 0;
export var DSDiff = 0; export var ASDiff = 0;
export var countSub = 0; export var countIns = 0; export var countDel = 0;
export var countMis = 0; export var countSil = 0; export var countNon = 0;

export var listSub = [], listIns = [], listDel = [];
export var listMis = [], listSil = [], listNon = [];

export var sStart = 0, sEnd = 20;


var DSDIFFpos = [];
var RSDIFFpos = [];
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

function reduceGenCode(sequence, start, end){
  return geneticCode.reduce(function (codon, geneticCode){ return (codon.RNA === sequence.substring(start, end)) ? codon : geneticCode;},{});
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
      var sub = reduceGenCode(sequence, start, end);
      // var sub = geneticCode.reduce(function (codon, geneticCode){
      //   return (codon.RNA === sequence.substring(start, end)) ? codon : geneticCode;},{});
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
                  numberList: [0],
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
    listSub = []; listIns = []; listDel = [];
    listMis = []; listSil = []; listNon = [];
    sStart = 0; sEnd = 0;
    this.interval = setInterval(() => {

      if (this.props.isMutating && !this.props.isRepairing){
        // var tempList = [];
        tempcDNAsequence = mutation(this.state.cDNAsequence);
        tempcRNAsequence = fromDNA(tempcDNAsequence);
        tempcAAsequence = fromRNA(tempcRNAsequence);
        DSDiff = getDsDiff(DNAsequence, tempcDNAsequence);
        DSDiff = DSDiff.toFixed(2);
        getInsDel(DNAsequence, tempcDNAsequence);
        getAsDiff(AAsequence, tempcAAsequence, DNAsequence, tempcDNAsequence);
        listSub.push(countSub); listIns.push(countIns); listDel.push(countDel);
        listMis.push(countMis); listSil.push(countSil); listNon.push(countNon);
        sStart = this.state.number < 20 ? 0 : this.state.scrollStart +1;
        sEnd = this.state.number < 20 ? 20 : this.state.scrollEnd +1;
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
      else if (this.props.isRepairing && !this.props.isMutating){
        // repair(DNAsequence, this.state.cDNAsequence);
        repair(DNAsequence, this.state.cDNAsequence);
        this.props.onRExit();
        sStart = this.state.number < 20 ? 0 : this.state.scrollStart;
        sEnd = this.state.number < 20 ? 20 : this.state.scrollEnd ;
        this.setState({
                        scrollStart: this.state.number < 20 ? 0 : this.state.scrollStart + 1,
                        scrollEnd: this.state.number < 20 ? 20 : this.state.scrollEnd + 1,
                        sub: this.state.sub.concat(countSub), ins: this.state.ins.concat(countIns), del: this.state.del.concat(countDel),
                        mis: this.state.mis.concat(countMis), sil: this.state.sil.concat(countSil), non: this.state.non.concat(countNon),
                      });
      }
      else if (this.props.isMutating && this.props.isRepairing){
        // repair(DNAsequence, this.state.cDNAsequence);
        repair(DNAsequence, this.state.cDNAsequence);
        tempcDNAsequence = mutation(this.state.cDNAsequence);
        tempcRNAsequence = fromDNA(tempcDNAsequence);
        // this.state.cAAsequence
        tempcAAsequence  = fromRNA(tempcRNAsequence);
        DSDiff = getDsDiff(DNAsequence, tempcDNAsequence);
        DSDiff = DSDiff.toFixed(2);
        RSDIFFpos = DSDIFFpos;
        getInsDel(DNAsequence, tempcDNAsequence);
        getAsDiff(AAsequence, tempcAAsequence, DNAsequence, tempcDNAsequence);
        listSub.push(countSub); listIns.push(countIns); listDel.push(countDel);
        listMis.push(countMis); listSil.push(countSil); listNon.push(countNon);
        this.props.onRExit();
        sStart = this.state.number < 20 ? 0 : this.state.scrollStart;
        sEnd = this.state.number < 20 ? 20 : this.state.scrollEnd;
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

  componentDidUpdate(prevProps) {

    // Typical usage (don't forget to compare props):
    if (this.state.cDNAsequence !== prevProps.mDNAsequence) {
      gDNAsequence = this.state.cDNAsequence;
      this.props.onCounter();
      // console.log(this.state.number);
     }
  }

  pickError = (sequence, originalSequence, pos) =>{
    var errorLine = [];
    var keyN = 0;
    console.log(pos);
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
    // console.log(errorLine);
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



    if (isMutating && !isRepairing){
      return (
          <span>
            <legend> Mutate && Repair </legend>
            <ButtonGroup>
              <Buttonn
                    pressed={isMutating}
                    onButtonChange={this.props.onMExit}
                    name = {nameM}/>
              <Buttonn
                    pressed={isRepairing}
                    onButtonChange={this.props.onREnter}
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
    else if (isRepairing && !isMutating){
      return (
          <span>
            <legend> Mutate && Repair </legend>
            <ButtonGroup>
              <Buttonn
                    pressed={isMutating}
                    onButtonChange={this.props.onMEnter}
                    name = {nameM}/>
              <Buttonn
                    pressed={isRepairing}
                    onButtonChange={this.props.onRExit}
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
    else {
      return (
          <span>
            <legend> Mutate && Repair </legend>
            <ButtonGroup>
              <Buttonn
                    pressed={isMutating}
                    onButtonChange={this.props.onMExit}
                    name = {nameM}/>
              <Buttonn
                    pressed={isRepairing}
                    onButtonChange={this.props.onRExit}
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
}
