import React, { Component } from 'react'
import '../../pages/Register/style.css'
import { Doughnut } from '@reactchartjs/react-chart.js'
import {Link} from 'react-router-dom';


import { Button, Modal, ModalHeader, ModalBody, ModalFooter  } from 'reactstrap';

export class DiabetesForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: '',
            modal: false,
            modal1: false,
            graphdata: {},
            recomsubmitted : false,
            recom : {}
        };
    
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
        console.log(this.state.result)        
        recomvalue.age = this.state.result.age;
        recomvalue.glucose = this.state.result.glucose;
        recomvalue.bmi = this.state.result.bmi;
        console.log(recomvalue);

        fetch('/diabetes-recom', {
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
            //   alert(
            //     'Recommendations for you : \n'+
            //     Object.keys(this.state.recom).map((key, i) => (
            //     this.state.recom[key] !== '-' ?
            //     (' => '+this.state.recom[key]+'\n \n' ): ''
            //     // )
            //     ))
            //     )
            });
          });

      }

      handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        const value = Object.fromEntries(data.entries());
        console.log( JSON.stringify(value) )
        console.log("making request", data)
        
        fetch('/predict', {
            method: 'POST',
            body: data,
          }).then((response) => {
              response.json()
              .then((body) => {
              console.log(this.state);
              console.log(body);
              this.setState({ 
                  'result': body ,
                  'graphdata' : {
                    labels: ['Diabetes Prediction', ' '],
                    datasets: [
                      {
                        label: 'Prediction %',
                        data: [Math.ceil(body.res*100), (100-(Math.ceil(body.res*100)))],
                        backgroundColor: [
                            'rgba(255, 0, 0, 0.4)',
                            'rgba(255, 255, 255, 0.6)',
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)',
                            'rgba(211,211,211, 1)',
                        ],
                        borderWidth: 1,
                      },
                    ],       
                    text: Math.ceil(body.res*100)
                  }
              })
              console.log(this.state);
            });
          });
  
      }


    render() {
        return (
            <>
            <div className='root-container' style={{height:'190.0vh'}}>
                <div className='header'>
                Diabetes Predictor
                </div>    
                <div className='box-container' >
                    <form onSubmit={this.handleSubmit} autocomplete="off">
                        <div className='box'>
                        
                        <div className='input-group'>
                            <label htmlFor='pregnancies'>
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
                            <button type='submit' className='login-btn'>Predict</button>
                        </div>
                    </form>
                </div>
            { this.state.result !== '' && 
                <>
                <h2 style={{color:'red', top: 0, left: 0, margin: 0}}> There is a {  Math.ceil(this.state.result.res*100) } % chance of you being diabetic</h2>
                <div style={{maxWidth:'98.0vw', maxHeight:'50vh', width:'98.0vw', height:'50vh' }}>
                    
                    {/* UNCOMMENT BELOW PART LATER */}
                    
                    <Doughnut width={100} height={60} options={{ maintainAspectRatio: false }} data={this.state.graphdata} />
                    
                    { this.state.result.sessionuser >= 1 ? 
                        (
                        <button className='login-btn' onClick={this.toggle}>Get Recommendations</button>
                        ) :
                        (
                        <Link to='/signup' className='btn-link'>
                            <button className='login-btn' >Login to Get Recommendations</button>
                        </Link>
                        )
                    }
                    
                    <br></br>
                    {this.state.recomsubmitted === 'true' &&
                                <h4>
                                {Object.keys(this.state.recom).map((key, i) => (
                                    this.state.recom[key] !== '-' && <p key={key}>
                                        <span>{key}</span>
                                        <span>{this.state.recom[key]}</span>
                                    </p>
                                    ))
                                }
                                </h4> 
                    }
                    <Modal isOpen={this.state.modal} modalTransition={{ timeout: 700 }} backdropTransition={{ timeout: 1300 }}
                        toggle={this.toggle}>
                        <ModalHeader toggle={this.toggle}>Questionnaire</ModalHeader>
                        <ModalBody>
                            Please fill out this Questionnaire to get Personalised Recommendations.
                            <form 
                            onSubmit={this.handleRecomSubmit}
                            autocomplete="off">
                                <div className='box'>
                                    <div className='input-group'>
                                        <label htmlFor='Smoking'>
                                            Do you Smoke? (Y/N)
                                        </label>
                                        <input type='text' name='Smoking' className='login-input' />
                                    </div>
                                
                                    <div className='input-group'>
                                        <label htmlFor='Sleep'>
                                        Enter the duration of sleep in Hours/Night.
                                        </label>
                                        <input type='text' name='Sleep' className='login-input' />
                                    </div>
                                
                                    <div className='input-group'>
                                        <label htmlFor='Exercise'>
                                        Enter the duration of Exercise in Minutes/Week.
                                        </label>
                                        <input type='text' name='Exercise' className='login-input' />
                                    </div>
                                
                                    <div className='input-group'>
                                        <label htmlFor='Water'>
                                        Enter the amount of water consumed daily in Litres.
                                        </label>
                                        <input type='text' name='Water' className='login-input' />
                                    </div>
                                <button className='login-btn'onClick={this.toggle1}>Get Recommendations</button>
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
                        <div style={{ textAlign: 'center' }}>
                          <img src='https://www.patiadiabetes.com/wp-content/uploads/2016/01/howtoprevent-1.png' ></img>
                        </div>
                        </ModalBody>
                        <ModalFooter>
                        Note: These are some suggestions given based only on the Input parameters that you provide. It is always advisable to see a Doctor for better medication and health check-up.  
                        </ModalFooter>
                    </Modal>

                </div> 
                </>
            }
            </div>
        </>               
           
        )
    }
}

export default DiabetesForm
