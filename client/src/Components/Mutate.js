

import React, { Component } from "react";
import ContainerBottom from './ContainerBottom';
import Counter, {gDNAsequence, counter, fromRNA, fromDNA} from './Counter';
import {DNAsequence, RNAsequence, AAsequence} from './Convert';
import Buttonn from './Buttonn';
import { ButtonGroup} from "react-bootstrap";
import Chart from './Chart';
import {generationR} from './Repair';





export default class Mutate extends Component {
  constructor(props){
    super(props);
    this.handleMutate = this.handleMutate.bind(this);
    this.handleRepair = this.handleRepair.bind(this);
    this.state = {legendName:'',
                  mDNAsequence:DNAsequence,
                  mRNAsequence:RNAsequence,
                  mAAsequence:AAsequence,
                  isMutating:false,
                  isRepairing:false,
                  nameM: "Mutate",
                  nameR: "Repair",
                  scrollStart: 0, scrollEnd: 20,
                  number: 0,
                };
  }

  //makes the parameter as a string. convert manually to boolean!!
  handleMutate(isMutating, nameM){
      //technically, it will always be false when handled. but for safe-box purpose.

      if (isMutating === "false"){
        isMutating = true;
        nameM = "Stop";
        this.setState({isMutating, nameM});
      }
      else{
        isMutating = false;

          this.setState({isMutating, nameM});
      }
  }

  handleRepair(isRepairing, nameR){
    //technically, it will always be false when handled. but for safe-box purpose.
    if (isRepairing === "false"){
      isRepairing = true;
      nameR = "Stop";
      this.setState({isRepairing, nameR});
    }
    else{
      isRepairing = false;
        this.setState({isRepairing, nameR});
    }
  }




  render() {
    var mDNAsequence = this.state.mDNAsequence;
    var mRNAsequence = this.state.mRNAsequence;
    var mAAsequence =  this.state.mAAsequence;
    const isMutating = this.state.isMutating;
    const isRepairing = this.state.isRepairing;
    var nameM = this.state.nameM;
    var nameR = this.state.nameR;
    mRNAsequence = fromDNA(mDNAsequence);
    mAAsequence = fromRNA(mRNAsequence);
    // listSub, listIns, listDel, listMis, listSil, listNon,

    if (isMutating || isRepairing){

      return (
        <div>

      <Counter
        onMExit={() => this.setState({isMutating:false, nameM:"Mutate"})}
        onRExit={() => this.setState({isRepairing:false, nameR:"Repair"})}
        onMEnter={() => this.setState({isMutating:true, nameM:"Stop"})}
        onREnter={() => this.setState({isRepairing:true, nameR:"Stop"})}
        onCounter={()=> this.setState({mDNAsequence:gDNAsequence})}

        isMutating={isMutating}
        isRepairing={isRepairing}
        mDNAsequence={mDNAsequence}
        mAAsequence={mAAsequence}
        nameM = {nameM}
        nameR = {nameR}
        />
      </div>
    )
  }
    else if (!isMutating && !isRepairing){ //base

      return (
        <div>
        <span>
          <legend> Mutate && Repair </legend>
          <ButtonGroup>
            <Buttonn
                  pressed={isMutating}
                  name = {nameM}
                  onButtonChange={this.handleMutate}
                  />
            <Buttonn
                  pressed={isRepairing}
                  name = {nameR}
                  onButtonChange={this.handleRepair}
                  />
          </ButtonGroup>
          <br/>
          <Chart/>
          <br/>
          <ContainerBottom
            DsequencePrint={[DNAsequence]}
            RsequencePrint={[RNAsequence]}
            AsequencePrint={[AAsequence]}
            isMutating={isMutating}
            isRepairing={isRepairing}
            counter = {counter}
            DNAoriginal = {DNAsequence}
            RNAoriginal = {RNAsequence}
            AAoriginal = {AAsequence}
            generationRepair = {generationR}
            targetSequenceRepair = {DNAsequence}
          />
        </span>
      </div>
    )
    }

  }
}
