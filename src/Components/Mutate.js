

import React, { Component } from "react";
import ContainerM from './ContainerM';
import {geneticCode} from './GeneticCode';
import {DNAsequence, RNAsequence, AAsequence} from './Convert';


export default class Mutate extends Component {

  render() {
    console.log(RNAsequence);


    return (
      <div>
      <ContainerM
        legendName="DNA"
        sidenote="Only A, T, C or G will be inputted"
        sequence={DNAsequence}
        />
      <ContainerM
        legendName="RNA"
        sidenote="Only U, A, G or C will be inputted"
        sequence={RNAsequence}
        />
      <ContainerM
        legendName="AMINO ACID"
        sidenote="Only the valid three-letters Amino Acids or Stop will be inputted"
        sequence={AAsequence}
        />
    </div>
    )
  }
}
