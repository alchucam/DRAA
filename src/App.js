import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom'
// import { render } from 'react-dom'
//import logo from './logo.svg';
import './App.css';

import NavMain from './Components/NavMain';
// import Convert from './Components/Convert';
import Main from './Components/Main';

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
