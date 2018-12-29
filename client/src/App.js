import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

import NavMain from './Components/NavMain';

// import Convert from './Components/Convert';
import Main from './Components/Main';

import { BrowserRouter } from 'react-router-dom'

class App extends Component {
  state = {
    data: null
  };


/*
  authenticate(){
    document.getElementById("loading").style.display = "block";
    document.getElementById("root").style.display = "none";
    return new Promise(resolve => setTimeout(resolve, 3)) //real: 3000
  }
  componentDidMount() {
    this.authenticate().then(()=>{
          document.getElementById("loading").style.display = "none";
          document.getElementById("root").style.display = "block";
    })
  }
  */

  render() {
    return (
        <BrowserRouter>
        <div>
          <NavMain/>
          <Main/>
          <p className="App-intro">{this.state.data}</p>
          </div>
        </BrowserRouter>
    );
  }
}

export default App;
