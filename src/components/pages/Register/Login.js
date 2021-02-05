import React, { Component } from 'react'
import './style.css'
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result : '',
            email: '',
            password: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
      }

      handleSubmit(e) {
            e.preventDefault() ;
            let formData  = new FormData();
            console.log("making request")
            formData.append('email', document.getElementById("email").value);
            formData.append('password', document.getElementById("password").value);
            console.log(formData);

            fetch('/login', {
                method: 'POST',
                body: formData
            })
            .then( res => res.json())
            .then( data=>{
                console.log(data);
                if(data.state === "Approved"){
                    // Go to login.
                    window.location.replace("/")
                }
                else{
                    // Other cases with appr. alert mssg.
                    alert(data.state)
                }
            }).catch(err => console.log(err));
        }  
    
    render() {
        return (
            <div className='inner-container'>
               <div className='header'>
                    Login
                </div>
                <form method='POST'>
                <div className='box'>
                    <div className='input-group'>
                        <label htmlFor='email'>
                                Email ID
                            </label>
                        <input type='text' id='email' name='email' className='login-input' />
                    </div>
                    <div className='input-group'>
                        <label htmlFor='password'>
                                Password
                            </label>
                        <input type='password' id='password' name='password' className='login-input' />
                    </div>
                    <button onClick={this.handleSubmit} className='login-btn' >Sign In</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default Login
