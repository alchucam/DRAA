import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

import NavMain from './Components/NavMain';
import Convert from './Components/Convert';

class App extends Component {



  render() {


    return (
        <div>
        <NavMain/>
        <Convert/>
        </div>
    );
  }
}

export default App;
