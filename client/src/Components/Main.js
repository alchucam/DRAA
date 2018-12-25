import React, { Component } from "react";
import { Switch, Route } from 'react-router-dom'
import Convert from './Convert'
import Mutate from './Mutate'

export default class Main extends Component {

  render() {
    return (

      <Switch>
        <Route exact path='/' component={Convert}/>
        <Route path='/mutate' component={Mutate}/>
      </Switch>
    )
  }
}
