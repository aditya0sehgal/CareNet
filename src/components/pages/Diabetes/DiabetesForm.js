import React from 'react'
import '../../pages/Register/style.css'

function DiabetesForm() {
    return (
    //     <div>
    //         <form action='/predict' method='POST'>
    //     <input class="form-input" type="text" name="pregnancies" placeholder="Number of Pregnancies eg. 0"></input>
    //     <br />
    //     <input class="form-input" type="text" name="glucose" placeholder="Glucose (mg/dL) eg. 80"></input>
    //     <br />
    //     <input class="form-input" type="text" name="bloodpressure" placeholder="Blood Pressure (mmHg) eg. 80"></input>
    //     <br />
    //     <input class="form-input" type="text" name="skinthickness" placeholder="Skin Thickness (mm) eg. 20"></input>
    //     <br />
    //     <input class="form-input" type="text" name="insulin" placeholder="Insulin Level (IU/mL) eg. 80"></input>
    //     <br />
    //     <input class="form-input" type="text" name="bmi" placeholder="Body Mass Index (kg/m²) eg. 23.1"></input>
    //     <br />
    //     <input class="form-input" type="text" name="dpf" placeholder="Diabetes Pedigree Function eg. 0.52"></input>
    //     <br />
    //     <input class="form-input" type="text" name="age" placeholder="Age (years) eg. 34"></input>
    //     <br />
    //     <input type="submit" class="my-cta-button" value="Predict"></input>
    //   </form>
    
            
             
               <div className='inner-container'>
<form action='/predict' method='POST'>
      
               <div className='header'>
                    Login
                </div>
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
                     
    )
}


export default DiabetesForm
