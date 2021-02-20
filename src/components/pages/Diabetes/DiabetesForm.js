import React, { Component } from 'react'
import '../../pages/Register/style.css'
import { Doughnut } from '@reactchartjs/react-chart.js'

const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

export class DiabetesForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: ''
        };
    
        this.handleSubmit = this.handleSubmit.bind(this);
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
              this.setState({ 'result': body })
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
                    <h3 className='pt-1' style={{color:'red'}}>{this.state.result.res*100} %</h3>
                    <h6>Idhar chart ayega doughnut wala</h6>
                    <Doughnut width={100} height={60} options={{ maintainAspectRatio: false }} data={data} />
                </div> 
            }

        </>               
           
        )
    }
}

export default DiabetesForm
