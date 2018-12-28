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
  componentDidMount() {
    this.callBackendAPI()
      .then(res => this.setState({ data: res.express }))
      .catch(err => console.log(err));
  }

  callBackendAPI = async () => {
    const response = await fetch('/test');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message)
    }
    return body;
  };
  */

  authenticate(){
    document.getElementById("loading").style.display = "block";
    document.getElementById("root").style.display = "none";
    return new Promise(resolve => setTimeout(resolve, 3000))
  }
  componentDidMount() {
    this.authenticate().then(()=>{
          document.getElementById("loading").style.display = "none";
          document.getElementById("root").style.display = "block";
    })
  }

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
