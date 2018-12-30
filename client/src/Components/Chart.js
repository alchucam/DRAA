import React, { Component } from "react";
import Plot from 'react-plotly.js';

//chart class for display plotly charts in mutate page.
export default class Chart extends Component {
  constructor(props){
      super(props);
      this.state = {width: window.innerWidth, height: window.innerHeight };
      this.getWindowDimensions = this.getWindowDimensions.bind(this);
    }

  //below functions are implemented to maintain the size of chart based on the window size in real time.
  getWindowDimensions(){
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  componentDidMount(){
    window.addEventListener('resize', this.getWindowDimensions);
  }

  componentWillUnmount(){
    window.addEventListener('resize', this.getWindowDimensions);
  }

  render(){
      var chartWidth = this.state.width < 450 ? this.state.width - 10 : this.state.width - 50;
      var layout = {
      title: "Mutations in Generation",
      xaxis: {title: "Generation",
              range: [this.props.scrollStart, this.props.scrollEnd+1]},
      yaxis: {title: "Number"},
      barmode: "stack",
      width:chartWidth,
      autosize:true,
      };
    return(
      <span>
        <Plot
          data={[
            {
              x: this.props.number,
              y: this.props.sub, name: "Substitution",
              marker: {color: "rgb(153, 230, 255)"},
              opacity: 0.60,
              type: "bar"
            },
            {
              x: this.props.number,
              y: this.props.ins, name: "Insertion",
              marker: {color: "rgb(255, 217, 102)"},
              opacity: 0.60,
              type: "bar"
            },
            {
              x: this.props.number,
              y: this.props.del, name: "Deletion",
              marker: {color: "rgb(179, 179, 255)"},
              opacity: 0.60,
              type: "bar"
            },
            {
              x: this.props.number,
              y: this.props.mis, name: "Missense",
              marker: {color: "rgb(204, 255, 204)"},
              opacity: 0.60,
              type: "bar"
            },
            {
              x: this.props.number,
              y: this.props.sil, name: "Silent",
              marker: {color: "rgb(255, 179, 255)"},
              opacity: 0.60,
              type: "bar"
            },
            {
              x: this.props.number,
              y: this.props.non, name: "Nonsense",
              marker: {color: "rgb(255, 92, 51)"},
              opacity: 0.60,
              type: "bar"
            },
          ]}
          layout= {layout}
        />
      </span>
    )
  }
}
