import React, { Component } from 'react';
import NavMain from './Components/NavMain';
import Main from './Components/Main';

import { BrowserRouter } from 'react-router-dom'

class App extends Component {
  //provide 3 seconds loading screen
  authenticate(){
    document.getElementById("loading").style.display = "block";
    document.getElementById("root").style.display = "none";
    return new Promise(resolve => setTimeout(resolve, 3000))
  }
  componentDidMount() {
    this.authenticate().then(()=>{
          document.getElementById("loading").style.display = "none";
          document.getElementById("root").style.display = "block";
          document.documentElement.style.setProperty('overflow-y', 'scroll');
    })
  }

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
