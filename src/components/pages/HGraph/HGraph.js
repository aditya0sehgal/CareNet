import React from 'react';
import HGraph, {
  hGraphConvert,
  calculateHealthScore
} from '../../../../node_modules/hgraph-react'; // symlinked with 'yarn link' from project root.

import data2017 from "../../data.json";
import '../../HGraph.css';
import { Button, UncontrolledPopover, PopoverHeader, PopoverBody, Table  } from 'reactstrap';

class Hgraph extends React.Component {
  constructor(props) {
    super(props);

    const converted2017 = this.convertDataSet(data2017);
    console.log(data2017);
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
      yearData: [],
      data: [],
      historyOpen: false,
      historyData: [],
      formsubmit: false,
      datavalue:[]
    }

    console.log(this.state.data);
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
      // console.log(converted);
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

  handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const value = Object.fromEntries(data.entries());
    console.log( JSON.stringify(value) );  // View entered values from the form.
    console.log( value );  // View entered values from the form.
    this.setState({datavalue: value})
    // To generate a json file having data from the form to use on the HGraph component.
    let healthdataarray = []
    for (var key in value) {
    if (value.hasOwnProperty(key)) {
      var val = value[key];

      let current_obj = {
        "metric": key,
        "value": val,
      }
      healthdataarray.push(current_obj)
      // console.log(current_obj ,key, val);
    }
  }
    healthdataarray.push({
      "metric": "painLevel",
      "value": "2"})
    healthdataarray.push({
      "metric": "happiness",
      "value": "8"})
    healthdataarray.push({
      "metric": "other",
      "value" : "0.5"})
    console.log(healthdataarray);  // replacement for data.json
      
    // Checking if our data from the form is converted to the correct data object.
    
    const convertedata = this.convertDataSet(healthdataarray);
    console.log(healthdataarray);
    console.log(convertedata); 

    const yearData = [
      {
        label: '2017',
        data: convertedata,
        score: parseInt(calculateHealthScore(convertedata), 10)
      },
    ];

    console.log(yearData);
    value.score=yearData[0].score;
    console.log(value);
    // Change the form submitted value to true to display the HGraph.
    // Setting other state values.
    this.setState({
      yearData: yearData,
      data: yearData[0],
      historyData: yearData[0].data[0],
      formsubmit: true
    })
    // this.state = {
    //   yearData: yearData,
    //   data: yearData[0],
    //   historyData: yearData[0].data[0],
    //   formsubmit: true
    // }

    // this.setState({formsubmit: true}) 
    console.log(this.state);

    // Send the health graph form data to the server.
    fetch('/healthscore', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(value),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  }

  render() {
    const sizeBasedOnWindow = this.state.windowWidth / 2;
    const size = sizeBasedOnWindow > 450 ? 450 : sizeBasedOnWindow;
    // const historySize = this.card.current ? this.card.current.clientWidth - 20 : 0;

    // backgroundImage:"url('healthgraph.jpg')
    return (
      <div className="App">
      <div className="root-container" style={{ height: this.state.formsubmit ? '270vh' :'150vh' }} >
                       
          <h1>
            Health Score 
          </h1>
            
          {/* <UncontrolledPopover trigger="focus" placement="right" target="PopoverFocus">
            <PopoverHeader>Healthy range values for each parameter.</PopoverHeader>
            <PopoverBody>
              <Table bordered>
                <thead>
                  <tr>
                    
                    <th>Parameter</th>
                    <th>Healthy Range</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    
                    <td>Total Cholesterol</td>
                    <td>0.25-0.75</td>
                  </tr>
                  <tr>
                    
                    <td>Glucose</td>
                    <td>61-100</td>
                  </tr>
                  <tr>
                    
                    <td>Systolic Blood Pressure</td>
                    <td>99-148</td>
                  </tr>
                  <tr>
                 
                    <td>Diastolic Blood Pressure</td>
                    <td>65-95</td>
                  </tr>
                  <tr>
                    
                    <td>Alcohol Use</td>
                    <td>0-1</td>
                  </tr>
                  <tr>
                    
                    <td>Nicotine Use</td>
                    <td>0-1</td>
                  </tr>
                  <tr>
                    
                    <td>Waist Circumference</td>
                    <td>30.0-34.5</td>
                  </tr>
                  <tr>
                    
                    <td>Exercise</td>
                    <td>3-12</td>
                  </tr>
                  <tr>
                    
                    <td>Sleep</td>
                    <td>7.1-8.0</td>
                  </tr>
                  <tr>
                    
                    <td>Weight</td>
                    <td>170-205</td>
                  </tr>
                </tbody>
              </Table>
            </PopoverBody>
          </UncontrolledPopover> */}
          {/* <Button color="primary">hello</Button> */}
          <div className='box-container' >
            {/* <form action='/healthscore' method='POST' onSubmit={this.handleClick}> */}
            <form onSubmit={this.handleSubmit}>
  
                <div className='box'>
                  <div className='input-group'>
                      <label htmlFor='totalCholesterol'>
                      Total Cholesterol
                          </label>
                      <input type='text' name='totalCholesterol' className='login-input' placeholder='Enter the value in mg/dl.'/>
                  </div>
                   
                  <div className='input-group'>
                    <label htmlFor='glucose'>
                            Glucose
                        </label>
                    <input type='text' name='glucose' className='login-input' placeholder='Enter the value in mg/dl.'/>
                  </div>

                  <div className='input-group'>
                    <label htmlFor='bloodPressureSystolic'>
                        Systolic Blood Pressure
                        </label>
                    <input type='text' name='bloodPressureSystolic' className='login-input' placeholder='Enter the value in mm/Hg.'/>
                  </div>
                  
                  <div className='input-group'>
                    <label htmlFor='bloodPressureDiastolic'>
                    Diastolic Blood Pressure
                        </label>
                    <input type='text' name='bloodPressureDiastolic' className='login-input' placeholder='Enter the value in mm/Hg.' />
                  </div>
                    
                  <div className='input-group'>
                    <label htmlFor='alcoholUse'>
                    Alcohol Use
                        </label>
                    <input type='text' name='alcoholUse' className='login-input' placeholder='Enter the number of drinks/week.'/>
                  </div>

                  <div className='input-group'>
                    <label htmlFor='nicotineUse'>
                    Nicotine Use
                        </label>
                    <input type='text' name='nicotineUse' className='login-input' placeholder='Enter the number of nicotine/day.'/>
                  </div>
                  
                  <div className='input-group'>
                    <label htmlFor='waistCircumference'>
                    Waist Circumference
                        </label>
                    <input type='text' name='waistCircumference' className='login-input' placeholder='Enter the value in inches.'/>
                  </div>
        
                  <div className='input-group'>
                    <label htmlFor='exercise'>
                      Exercise
                        </label>
                    <input type='text' name='exercise' className='login-input' placeholder='Enter the value in hours/week.'/>
                  </div>

                  <div className='input-group'>
                    <label htmlFor='sleep'>
                      Sleep
                        </label>
                    <input type='text' name='sleep' className='login-input' placeholder='Enter the value in hours/night.'/>
                  </div>

                  <div className='input-group'>
                    <label htmlFor='weight'>
                      Weight
                        </label>
                    <input type='text' name='weight' className='login-input' placeholder='Enter the value in lbs.'/>
                  </div>

                  <button className='login-btn'>Get Health Score</button>
                </div>
            </form>
        </div>
        <h3>
        {/* <Button id="PopoverFocus" color='primary' style={{borderRadius:'30px'}} type="button">
          Healthy Range Values
        </Button>  */}
        {/* <i style={{color:'whitesmoke'}} class="fa fa-info"></i>  */}
        </h3> 
        {this.state.formsubmit === true && 
        <div>
        <div className="card" 
        style={{ top: this.state.historyOpen ? '80vh' : '100vh' }} 
        ref={this.card}>
              <div>
                  <p>{ this.state.historyData.label }</p>
                  <p>{ this.state.historyData.value } { this.state.historyData.unitLabel }</p>
              </div>
        </div>

        <div className="vis-container" style={{ height: this.state.historyOpen ? '50vh' : '100vh' }}>
          <HGraph
            data={ this.state.data.data }
            score={ this.state.data.score }
            width={ size }
            height={ size }
            fontColor={'rgb(0, 0, 0)'}
            scoreFontColor={'rgb(255, 255, 255)'}
            fontSize={ size < 300 ? 16 : 19 }
            pointRadius={ size < 300 ? 5 : 10 }
            scoreFontSize={ size < 300 ? 50 : 120 }
            // onPointClick={false}
            // zoomOnPointClick={false}
            onPointClick={this.handlePointClick}
            zoomOnPointClick={true}
          />
        </div>
       <br></br>
       <br></br>
        <Table style={{fontWeight: 'bold'}} bordered>
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Values Entered</th>
                    <th>Healthy Range</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Total Cholesterol</td>
                    <td style={{color: (0.25 <= this.state.datavalue['totalCholesterol'] &&  this.state.datavalue['totalCholesterol'] <= 0.75) ? "green":"red"}}>{this.state.datavalue['totalCholesterol']}</td>
                    <td>0.25-0.75</td>
                  </tr>
                  <tr>
                    
                    <td>Glucose</td>
                    <td  style={{color: (61 <= this.state.datavalue['glucose'] &&  this.state.datavalue['glucose'] <= 100) ? "green" : "red"}}>{this.state.datavalue['glucose']}</td>
                    <td>61-100</td>
                  </tr>
                  <tr>
                    
                    <td>Systolic Blood Pressure</td>
                    <td style={{color: 99 <= this.state.datavalue['bloodPressureSystolic'] && this.state.datavalue['bloodPressureSystolic'] <= 148 ? "green" : "red"}}>{this.state.datavalue['bloodPressureSystolic']}</td>
                    <td>99-148</td>
                  </tr>
                  <tr>
                 
                    <td>Diastolic Blood Pressure</td>
                    <td style={{color: 65 <= this.state.datavalue['bloodPressureDiastolic'] && this.state.datavalue['bloodPressureDiastolic'] <= 95 ? "green" : "red"}}>{this.state.datavalue['bloodPressureDiastolic']}</td>
                    <td>65-95</td>
                  </tr>
                  <tr>
                    
                    <td>Alcohol Use</td>
                    <td style={{color: 0 <= this.state.datavalue['alcoholUse'] && this.state.datavalue['alcoholUse'] <= 1 ? "green" : "red"}}>{this.state.datavalue['alcoholUse']}</td>
                    <td>0-1</td>
                  </tr>
                  <tr>
                    
                    <td>Nicotine Use</td>
                    <td style={{color: 0 <= this.state.datavalue['nicotineUse'] && this.state.datavalue['nicotineUse'] <= 1 ? "green" : "red"}}>{this.state.datavalue['nicotineUse']}</td>
                    <td>0-1</td>
                  </tr>
                  <tr>
                    
                    <td>Waist Circumference</td>
                    <td style={{color: 30 <= this.state.datavalue['waistCircumference'] && this.state.datavalue['waistCircumference'] <= 34.5 ? "green" : "red"}}>{this.state.datavalue['waistCircumference']}</td>
                    <td>30.0-34.5</td>
                  </tr>
                  <tr>
                    
                    <td>Exercise</td>
                    <td style={{color: 3 <= this.state.datavalue['exercise'] && this.state.datavalue['exercise'] <= 12 ? "green" : "red"}}>{this.state.datavalue['exercise']}</td>
                    <td>3-12</td>
                  </tr>
                  <tr>
                    
                    <td>Sleep</td>
                    <td style={{color: 7.1 <= this.state.datavalue['sleep'] && this.state.datavalue['sleep'] <= 8.0 ? "green" : "red"}}>{this.state.datavalue['sleep']}</td>
                    <td>7.1-8.0</td>
                  </tr>
                  <tr>
                    
                    <td>Weight</td>
                    <td style={{color: 170 <= this.state.datavalue['weight'] && this.state.datavalue['weight'] <= 205 ? "green" : "red"}}>{this.state.datavalue['weight']}</td>
                    <td>170-205</td>
                  </tr>
                </tbody>
              </Table>
        
        </div>
        
        }
        </div>
      </div>


    );
  }
}

export default Hgraph;


