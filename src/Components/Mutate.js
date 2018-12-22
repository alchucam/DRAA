

import React, { Component } from "react";
import ContainerM from './ContainerM';
import ContainerBottom from './ContainerBottom';
import Counter, {gDNAsequence, counter, fromRNA, fromDNA} from './Counter';
import {DNAsequence, RNAsequence, AAsequence} from './Convert';









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
    // const legendName = this.state.legendName;
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
