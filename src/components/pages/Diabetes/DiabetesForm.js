import React, { Component } from 'react'
import '../../pages/Register/style.css'
import { Doughnut } from '@reactchartjs/react-chart.js'

import { Button, Modal, ModalHeader, ModalBody, ModalFooter  } from 'reactstrap';

export class DiabetesForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: '',
            modal: false,
            graphdata: {}
        };
    
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRecomSubmit = this.handleRecomSubmit.bind(this);
      }

      toggle() {
        this.setState({ modal: !this.state.modal });
      }

      handleRecomSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        const value = Object.fromEntries(data.entries());
        console.log( JSON.stringify(value) )
        console.log("making request", data)        
        console.log(this.state.result)        
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
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 255, 255, 0.2)',
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
            <div className='root-container' >
                <div className='header'>
                Diabetes Predictor
                </div>    
                <div className='box-container' >
                    <form onSubmit={this.handleSubmit}>
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
            </div>

            { this.state.result !== '' && 
                <div style={{maxWidth:'98.0vw', maxHeight:'70vh', width:'98.0vw', height:'70vh'}}>
                    <Doughnut width={100} height={60} options={{ maintainAspectRatio: false }} data={this.state.graphdata} />
                    
                    <br></br>
                    <h1 className='pt-3' style={{color:'blue'}}>{  Math.ceil(this.state.result.res*100) } %</h1>
                    
                    {/* UNCOMMENT BELOW PART LATER */}
                    <button className='login-btn' style={{marginBottom:'2%'}} onClick={this.toggle}>Get Recommendations</button>
                    <br></br>
                    
                    <Modal isOpen={this.state.modal} modalTransition={{ timeout: 700 }} backdropTransition={{ timeout: 1300 }}
                        toggle={this.toggle}>
                        <ModalHeader toggle={this.toggle}>Questionnaire</ModalHeader>
                        <ModalBody>
                            Please fill out this Questionnaire to get Personalised Recommendations.
                            <form onSubmit={this.handleRecomSubmit}>
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
                                </div>
                                <button className='login-btn' type='submit'>Get Recommendations</button>
                            </form>
                        </ModalBody>
                        <ModalFooter>
                        </ModalFooter>
                    </Modal>
                </div> 
            }

        </>               
           
        )
    }
}

export default DiabetesForm
