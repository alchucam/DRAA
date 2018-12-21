import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

import NavMain from './Components/NavMain';

// import Convert from './Components/Convert';
import Main from './Components/Main';
import NavSide from './Components/NavSide';
import { BrowserRouter } from 'react-router-dom'

class App extends Component {



  render() {


    return (
        <BrowserRouter>
        <div>
          <NavMain/>
          <Main/>
          </div>
        </BrowserRouter>
    );
  }
}

export default App;
