

import React, { Component } from "react";
import ContainerM from './ContainerM';
import ContainerBottom from './ContainerBottom';
import Counter, {gDNAsequence, counter, fromRNA, fromDNA} from './Counter';
import {DNAsequence, RNAsequence, AAsequence} from './Convert';
import Buttonn from './Buttonn';
import {ButtonToolbar} from "react-bootstrap"







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


    if (isMutating || isRepairing){

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
        <span>
          <legend> Mutate && Repair </legend>
          <ButtonToolbar>
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
          </ButtonToolbar>
          <br/>
          <ContainerBottom

            Dsequence={DNAsequence}
            Asequence={AAsequence}
            isMutating={isMutating}
            isRepairing={isRepairing}
            counter = {counter}
            DNAoriginal = {DNAsequence}
            AAoriginal = {AAsequence}
          />
        </span>
      </div>
    )
    }




    else if (!isMutating && isRepairing){
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
          isRepairing={isRepairing}
          onButtonChange={this.handleRepair}
          counter = {counter}
          name1="Mutate"
          name2="Repair"
          DNAoriginal = {DNAsequence}
          AAoriginal = {AAsequence}
        />
          testasdasda
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
          isRepairing={isRepairing}
          onButtonChange={this.handleMutate}
          counter = {counter}
          name1="Mutate"
          name2="Repair"
          DNAoriginal = {DNAsequence}
          AAoriginal = {AAsequence}
        />
      </div>
      )
    }

  }
}
