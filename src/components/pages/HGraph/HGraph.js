import React, { Component } from 'react';
import HGraph, {
  History,
  hGraphConvert,
  calculateHealthScore
} from '../../../../node_modules/hgraph-react'; // symlinked with 'yarn link' from project root.

import data2017 from "../../data.json";

import '../../HGraph.css';

class Hgraph extends React.Component {
  constructor(props) {
    super(props);

    const converted2017 = this.convertDataSet(data2017);

    // const converted2018 = this.convertDataSet(data2018);
    console.log(converted2017);
    const yearData = [
      {
        label: '2017',
        data: converted2017,
        score: parseInt(calculateHealthScore(converted2017), 10)
      },
    ];


    this.state = {
      windowWidth: window.innerWidth,
      yearData,
      data: yearData[0],
      historyOpen: false,
      historyData: yearData[0].data[0],
    }
    console.log(this.state.historyData);
    this.card = React.createRef();
  }

  convertDataSet = (data) => {
    return data.map(d => {
      const converted = hGraphConvert('male', d.metric, d);
      converted.id = d.metric;
      if (d.children) {
        converted.children = d.children.map(c => {
          const convertedChild = hGraphConvert('male', c.metric, c);
          convertedChild.parentKey = c.parentKey;
          convertedChild.id = c.metric;
          console.log(convertedChild);
          return convertedChild;
        })
      }
      converted.value = d.value;
      console.log(converted);
      return converted;
    });
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    document.addEventListener('mousedown', this.handleClick);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
    document.removeEventListener('mousedown', this.handleClick);
  }

  updateWindowDimensions = () => {
    this.setState({ windowWidth: window.innerWidth });
  }

  setYearData = (index) => (e) => {
    this.setState({
      data: this.state.yearData[index]
    })
  }

  handlePointClick = (data, event) => {
    this.setState({
      historyOpen: true,
      historyData: data,
    })
  }

  handleClick = (e) => {
    if (this.state.historyOpen && this.card.current && !this.card.current.contains(e.target)) {
      this.setState({ historyOpen: false })
    }
  }

  render() {
    const sizeBasedOnWindow = this.state.windowWidth / 2;
    const size = sizeBasedOnWindow > 450 ? 450 : sizeBasedOnWindow;
    const historySize = this.card.current ? this.card.current.clientWidth - 20 : 0;

    return (
      <div className="App">

        <div className="card" 
        style={{ top: this.state.historyOpen ? '55vh' : '105vh' }} 
        ref={this.card}>
              <div>
                  <p>{ this.state.historyData.label }</p>
                  <p>{ this.state.historyData.value } { this.state.historyData.unitLabel }</p>
                  {/* <History
                    width={ historySize }
                    height={ historySize > 500 ? historySize / 4 : historySize / 2 }
                    data={this.state.historyData}
                  /> */}
              </div>
        </div>

        <div className="vis-container" style={{ height: this.state.historyOpen ? '50vh' : '100vh' }}>
          <HGraph
            data={ this.state.data.data }
            score={ this.state.data.score }
            width={ size }
            height={ size }
            fontSize={ size < 300 ? 12 : 16 }
            pointRadius={ size < 300 ? 5 : 10 }
            scoreFontSize={ size < 300 ? 50 : 120 }
            onPointClick={this.handlePointClick}
            zoomOnPointClick={true}
          />
        </div>
        
      </div>
    );
  }
}

export default Hgraph;