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
        
        <div className='root-container' style={{}} >
                       
          <div className='header'>
                    Diabetes Predictor{this.state.result}
          </div>    
          <div className='box-container' >
            <form action='/predict' method='POST' onSubmit={this.handleSubmit}>
  
                <div className='box'>
                
                  <div className='input-group'>
                      <label htmlFor='Pregnancies'>
                              Pregnancies
                          </label>
                      <input type='text' name='pregnancies' className='login-input' />
                  </div>
                   
                  <div className='input-group'>
                    <label htmlFor='glucose'>
                            Glucose
                        </label>
                    <input type='text' name='glucose' className='login-input' />
                  </div>

                  <div className='input-group'>
                    <label htmlFor='bloodpressure'>
                            Blood Pressure
                        </label>
                    <input type='text' name='bloodpressure' className='login-input' />
                  </div>
                  
                  <div className='input-group'>
                    <label htmlFor='skinthickness'>
                            Skin Thickness
                        </label>
                    <input type='text' name='skinthickness' className='login-input' />
                  </div>
                    
                  <div className='input-group'>
                    <label htmlFor='insulin'>
                            Insulin Level
                        </label>
                    <input type='text' name='insulin' className='login-input' />
                  </div>

                  <div className='input-group'>
                    <label htmlFor='bmi'>
                            Body Mass Index
                        </label>
                    <input type='text' name='bmi' className='login-input' />
                  </div>
                  
                  <div className='input-group'>
                    <label htmlFor='dpf'>
                            Diabetes Pedigree Function
                        </label>
                    <input type='text' name='dpf' className='login-input' />
                  </div>
                  
                  <div className='input-group'>
                    <label htmlFor='age'>
                            Age
                        </label>
                    <input type='text' name='age' className='login-input' />
                  </div>

                  <input type='submit' value ='Predict' className='login-btn'></input>
                </div>


            </form>
        </div>
        
      </div>
                                 
           

      </div>


    );
  }
}

export default Hgraph;


