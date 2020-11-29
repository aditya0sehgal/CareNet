import React, { Component } from 'react'
import '../../pages/Register/style.css'

export class DiabetesForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: ''
        };
    
        this.handleSubmit = this.handleSubmit.bind(this);
      }
      handleSubmit(event) {
        console.log("making request")
        fetch("/predict", {
            method:"POST",
            cache: "no-cache",
            headers:{
                "content_type":"application/json",
            }
            // ,
            // body:JSON.stringify(this.state.result)
            }
        ).then(response => {
        return response.json()
      })
      .then(json => {
    
      this.setState({result: json[0]})
      console.log(this.state.result)
      })
      }
    render() {
        return (
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
                                 
           
        )
    }
}

export default DiabetesForm
