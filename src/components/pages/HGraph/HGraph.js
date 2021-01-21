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
      yearData,
      data: yearData[0],
      historyOpen: false,
      historyData: yearData[0].data[0],
      formsubmit: false
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
      console.log(current_obj ,key, val);
    }
  }
    console.log(healthdataarray);  // replacement for data.json
  
    // Change the form submitted value to true to display the HGraph.
    this.setState({formsubmit: true}) 
    console.log(this.state);

    // Send the health graph form data to the server.
    fetch('healthscore', {
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


    return (
      <div className="App">
      <div className="root-container" style={{ height: this.state.formsubmit ? '270vh' :'150vh' , backgroundImage:"url('healthgraph.jpg')"}} >
                       
          <h1 style={{color:'white'}}>
            Health Score 
          </h1>
            
          <UncontrolledPopover trigger="focus" placement="right" target="PopoverFocus">
            <PopoverHeader>Healthy range values for each parameter.</PopoverHeader>
            <PopoverBody>
              <Table bordered>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                  </tr>
                  <tr>
                    <th scope="row">2</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                  </tr>
                  <tr>
                    <th scope="row">3</th>
                    <td>Larry</td>
                    <td>the Bird</td>
                  </tr>
                </tbody>
              </Table>
            </PopoverBody>
          </UncontrolledPopover>
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
        <Button id="PopoverFocus" color='primary' style={{borderRadius:'30px'}} type="button">
          Healthy Range Values
        {/* <i style={{color:'whitesmoke'}} class="fa fa-info"></i>  */}
        </Button> 
        </h3> 
        {this.state.formsubmit === true && 
        <div>
        <div className="card" 
        style={{ top: this.state.historyOpen ? '210vh' : '250vh' }} 
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
            fontColor={'rgb(255, 255, 255)'}
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
        </div>
        }
        </div>
      </div>


    );
  }
}

export default Hgraph;


