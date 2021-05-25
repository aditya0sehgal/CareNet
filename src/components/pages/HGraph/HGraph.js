import React from 'react';
import HGraph, {
  hGraphConvert,
  calculateHealthScore
} from '../../../../node_modules/hgraph-react'; // symlinked with 'yarn link' from project root.

import data2017 from "../../data.json";
import '../../HGraph.css';
import { Table  } from 'reactstrap';
import {Link} from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter  } from 'reactstrap';

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
      datavalue:[],
      modal: false,
      modal1: false,
      recomsubmitted : false,
      recom : {},
      logged: {}
    }

      console.log(this.state.data);
      this.card = React.createRef();
      this.toggle = this.toggle.bind(this);
      this.toggle1 = this.toggle1.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleRecomSubmit = this.handleRecomSubmit.bind(this);
    }

      toggle() {
      this.setState({ modal: !this.state.modal });
     }

      toggle1() {
      this.setState({ modal1: !this.state.modal1 });
     }

      handleRecomSubmit(event) {
        event.preventDefault();
        const recomdata = new FormData(event.target);
        const recomvalue = Object.fromEntries(recomdata.entries());
        console.log( JSON.stringify(recomvalue) )
        console.log("making request", recomvalue)        
        console.log(this.state.datavalue)     
        recomvalue.alcoholUse = this.state.datavalue.alcoholUse;
        recomvalue.bloodPressureDiastolic = this.state.datavalue.bloodPressureDiastolic;
        recomvalue.bloodPressureSystolic = this.state.datavalue.bloodPressureSystolic;
        recomvalue.exercise = this.state.datavalue.exercise;
        recomvalue.glucose = this.state.datavalue.glucose;
        recomvalue.sleep = this.state.datavalue.sleep;
        recomvalue.totalCholesterol = this.state.datavalue.totalCholesterol;
        recomvalue.waistCircumference = this.state.datavalue.waistCircumference;
        recomvalue.weight = this.state.datavalue.weight;
        recomvalue.nicotineUse = this.state.datavalue.nicotineUse;
        console.log(recomvalue);

        fetch('/hgraph-recom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(recomvalue),
          }).then((response) => {
              response.json()
              .then((body) => {
              console.log(this.state);
              console.log(body);
              this.setState({ 
                  'recom': body ,
                  'recomsubmitted' : true,
                  modal: !this.state.modal
              })
              console.log(this.state);
              console.log(Object.keys(this.state.recom));
            //   alert(JSON.stringify(this.state.recom))
              // alert(
              //   'Recommendations for you : \n'+
              //   Object.keys(this.state.recom).map((key, i) => (
              //   this.state.recom[key] !== '-' ?
              //   (' '+this.state.recom[key]+'\n \n' ): ''
              //   // )
              //   ))
              //   )
            });
          });

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
      this.setState({
        logged : data
      })
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
      <div className="root-container" style={{ height: this.state.formsubmit ? '370vh' :'170vh' }} >
                       
          <h1>
            Health Score 
          </h1>
          {/* <Button color="primary">hello</Button> */}
          <div className='box-container' >
            {/* <form action='/healthscore' method='POST' onSubmit={this.handleClick}> */}
            <form onSubmit={this.handleSubmit} autocomplete="off">
  
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
{/*         
       <br></br>
       <br></br>
       <br></br>
       <br></br>
       <br></br>
       <br></br> */}
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
              
              { this.state.logged.sessionuser >= 1 ? 
                  (
                  <button className='login-btn' style={{marginBottom:'2%'}} onClick={this.toggle}>Get Recommendations</button>
                  ) :
                  (
                  <Link to='/signup' className='btn-link'>
                      <button className='login-btn' style={{marginBottom:'2%'}}>Login to Get Recommendations</button>
                  </Link>
                  )
              }

              <br></br>
              <br></br>
              <br></br>

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

              <Modal isOpen={this.state.modal} modalTransition={{ timeout: 300 }} backdropTransition={{ timeout: 700 }}
                        toggle={this.toggle}>
                        <ModalHeader toggle={this.toggle}>Questionnaire</ModalHeader>
                        <ModalBody>
                            Please fill out this Questionnaire to get Personalised Recommendations.
                            <form onSubmit={this.handleRecomSubmit} autocomplete="off">
                                <div className='box'>
                                    <div className='input-group'>
                                        <label htmlFor='Age'>
                                            What is your Age?
                                        </label>
                                        <input type='text' name='Age' className='login-input' />
                                    </div>
                                
                                    <div className='input-group'>
                                        <label htmlFor='Gender'>
                                        Enter your Gender(M/F).
                                        </label>
                                        <input type='text' name='Gender' className='login-input' />
                                    </div>
                                
                                    <div className='input-group'>
                                        <label htmlFor='Height'>
                                        Enter your Height in inches.
                                        </label>
                                        <input type='text' name='Height' className='login-input' />
                                    </div>
                                
                                <button className='login-btn' onClick={this.toggle1}>Get Recommendations</button>
                                </div>
                            </form>
                        </ModalBody>
                        <ModalFooter>
                        Note: These are some suggestions given based only on the Input parameters that you provide. It is always advisable to see a Doctor for better medication and health check-up.  
                        </ModalFooter>
                    </Modal>

                    <Modal isOpen={this.state.modal1} modalTransition={{ timeout: 300 }} backdropTransition={{ timeout: 700 }}
                        toggle={this.toggle1}>
                        <ModalHeader> Recommendations for you : </ModalHeader>
                        <ModalBody>
                        { Object.keys(this.state.recom).map((key, i) => (
                        this.state.recom[key] !== '-' ?
                        ( <> <br></br> =&gt; {key.toUpperCase()} : {this.state.recom[key]} </> ) : ''
                        )) }
                        <div 
                        style={{ textAlign: 'center' }}
                        >
                          {/* <img src='https://i.pinimg.com/originals/d0/2a/86/d02a869cef390da6189b094ddf77d41f.jpg' ></img> */}
                          <img width='500' height='300' src='https://www.who.int/images/default-source/infographics/health-promotion/infographic-health-promotion-12-tips.jpg?sfvrsn=86e14010_2' ></img>
                        </div>
                        </ModalBody>
                        <ModalFooter>
                        Note: These are some suggestions given based only on the Input parameters that you provide. It is always advisable to see a Doctor for better medication and health check-up.  
                        </ModalFooter>
                    </Modal>
        </div>
        
        }


        </div>
      </div>


    );
  }
}

export default Hgraph;


