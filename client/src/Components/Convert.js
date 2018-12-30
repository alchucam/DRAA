import React, { Component } from "react";
import Container from './Container';
import {Button, ButtonGroup, DropdownButton, MenuItem} from "react-bootstrap"
import {geneticCode} from './GeneticCode';


var aa = ["Ala", "Arg", "Asn", "Asp", "Cys", "Glu", "Gln", "Gly", "His", "Ile", "Leu", "Lys", "Met", "Phe", "Pro", "Ser", "Thr", "Trp", "Tyr", "Val"];

export var DNAsequence = '';
export var RNAsequence = '';
export var AAsequence = '';

//generic function to replace a character in a string
function replaceAt(string, index, replace) {
  return string.substring(0, index) + replace + string.substring(index + 1);
}

//capitalize letters for DNA and RNA
function capitalize(sequence){
    return sequence.toUpperCase();
}

//below two functions: capitalize first letter for amino acid
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

//return true if user is typing a valid AA characters; otherwise false.
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
    else {
      for (var key in aa){
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
      twoCheck = true;
      start = start +3;
      end = start+3;
    }

  }
  return true;
}

//below two functions retrieve the corresponding conversion between RNA and AA.
function reduceGenCodeRNA(sequence, start, end){
  return geneticCode.reduce(function (codon, geneticCode){ return (codon.RNA === sequence.substring(start, end)) ? codon : geneticCode;},{});
}

function reduceGenCodeAA(sequence, start, end){
   return geneticCode.reduce(function (codon, geneticCode){ return (codon.AA === sequence.substring(start, end)) ? codon : geneticCode;},{});
}

//below functions details conversion between types of sequence
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
      var sub = reduceGenCodeRNA(sequence, start, end);
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
        var sub = reduceGenCodeAA(sequence, start, end);
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
      sequence = replaceAt(sequence, start, 'X');
      start++;
    }
  }
  return sequence;
}

//conversion between types of sequence
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
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLoad = this.handleLoad.bind(this);
    this.handleExchange = this.handleExchange.bind(this);
    this.state = {legendName:'',sequence:'', loadData: [],
                  DNAsequence: '', RNAsequence:'', AAsequence:''};
  }

  //handle event when user types DNA: capitalize and only takes A,T,C,G
  handleDNAChange(sequence){
    if (sequence === ''){
      this.setState({legendName:'DNA',sequence});
    }
    sequence = capitalize(sequence);

    if (/^[ATCG]+$/.test(sequence)){
      this.setState({legendName:'DNA', sequence});
    }
  }

  //handle event when user types RNA: capitalize and only takes U,A,G,C
  handleRNAChange(sequence){
    if (sequence === ''){
      this.setState({legendName:'RNA',sequence});
    }
    sequence = capitalize(sequence);
    if (/^[UAGC]+$/.test(sequence)){
      this.setState({legendName:'RNA', sequence});
    }
  }

  //handle event when user types AA: capitalize only the first character of amino acid letters,
  //and checks if user is typing valid amino acid letters
  handleAAChange(sequence){
    if (sequence === ''){
      this.setState({legendName:'AMINO ACID',sequence});
    }
    sequence = capitalizeFirstPre(sequence);
    if (breakDownAA(sequence)){
        this.setState({legendName:'AMINO ACID', sequence});
    }
  }

  //handle event to send post method to save data
  handleSubmit(){
    var payload = [{
      DNAsequence:DNAsequence,
      RNAsequence:RNAsequence,
      AAsequence:AAsequence
    }];

    fetch('/', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(function(response){
      return response;
    });
  }

  //handle event to send get method to load data.
  handleLoad(){
    fetch('/get',{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      mode: "cors"
    }).then(function(response){
      if (response.status >= 400){
        throw new Error("Bad");
      }
      return response.json();
    }).then((body)=>{
      var data = [];
      for (var i = 0; i < body.length; i++){
        data.push(body[i].DNAsequence);
      }
      this.setState({loadData: data});
    }).catch(err=>{
      console.log("caught error", err);
    });

  }

  //handle event when user loads sequence from database into all the sequences variables
 handleExchange(data){
   var tempRNAsequence = tryConvert('DNA', 'RNA', data);
   var tempAAsequence = tryConvert('RNA', 'AMINO ACID', tempRNAsequence)
   this.setState({legendName: 'DNA', sequence: data, DNAsequence: data, RNAsequence: tempRNAsequence, AAsequence: tempAAsequence});
 }


  render() {
    const legendName = this.state.legendName; //current type of sequence user is typing
    const sequence = this.state.sequence;
    const bottomBuffer = {height:'200px'};
    DNAsequence = this.state.DNAsequence;
    RNAsequence = this.state.RNAsequence;
    AAsequence = this.state.AAsequence;

    //conversion of sequence between DNA, RNA, AMINO ACID, depends on where the user is typing the sequence.
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

    }

      return (
        <div id="containerwrapper">
          <Container
            legendName="DNA"
            sidenote="Only A, T, C or G"
            sequence={DNAsequence}
            onSequenceChange={this.handleDNAChange}/>
          <Container
            legendName="RNA"
            sidenote="Only U, A, G or C"
            sequence={RNAsequence}
            onSequenceChange={this.handleRNAChange}/>
          <Container
            legendName="AMINO ACID"
            sidenote="Only the valid three-letters Amino Acids or Stop"
            sequence={AAsequence}
            onSequenceChange={this.handleAAChange}/>
          <span>
            <legend> Database </legend>
            <ButtonGroup>
              <Button
                    onClick={this.handleSubmit}
                    >
                    {"Save"}
              </Button>
              <DropdownButton id="dropdown" title="Load"  onClick={this.handleLoad}>
                {this.state.loadData.map((data, index) => (
                  <MenuItem key={index} onClick={() => this.handleExchange(data)}>{index}:  {data ? (data.length > 20 ? data.substring(0, 20)+'...' : data) : data }</MenuItem>
                ))}
              </DropdownButton>
            </ButtonGroup>
            <br/>
          </span>
          <div style={bottomBuffer}></div>
        </div>

      );
  }
}
