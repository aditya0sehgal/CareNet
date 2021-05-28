import React, { Component } from 'react'
import './style.css'
class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result : ''
        };
    
        this.handleSubmit = this.handleSubmit.bind(this);
      }

      handleSubmit(e) {
        e.preventDefault() ;
        let formData  = new FormData();
        console.log("making request")
        formData.append('name', document.getElementById("name").value);
        formData.append('email', document.getElementById("email").value);
        formData.append('mobile', document.getElementById("mobile").value);
        formData.append('password', document.getElementById("password").value);
        console.log(formData.values);
        if(document.getElementById("name").value.length <2 || document.getElementById("name").value.length>14){
            alert("Username should be between 2 and 14 characters.");
            return;
        }
        // var phoneno = /^\d{10}$/;
        console.log(document.getElementById("mobile").value);
        if(document.getElementById("mobile").value.match(/^\d{10}$/) == null){
            alert("Phone no should be 10 digits.");
            return;
        }
        if(document.getElementById("password").value.length <5 || document.getElementById("password").value.length>10){
            alert("Password should be between 5 and 10 characters.");
            return;
        }
        else{
            fetch('/register', {
                method: 'POST',
                body: formData
            })
            .then( res => res.json())
            .then( data=>{
                console.log(data);
                if(data.state === "Approved"){
                    // Go to login.
                    window.location.replace("/signup")
                }
                else{
                    // Other cases with appr. alert mssg.
                    alert(data.state)
                }
            }).catch(err => console.log(err));  
        }
      }


    render() {
        return (
            <div className='inner-container'>
                <div className='header'>
                    Register
                </div>
                <form method='POST' >
                <div className='box'>
                        <div className='input-group'>
                            <label htmlFor='name'>
                                    Username
                            </label>
                            <input type='text' id='name' name='name' className='login-input' />
                        </div>
                        <div className='input-group'>
                            <label htmlFor='email'>
                                    Email-id
                            </label>
                            <input type='email' id='email' name='email' className='login-input' />
                        </div>
                        <div className='input-group'>
                            <label htmlFor='mobile'>
                                    Mobile No.
                            </label>
                            <input type='text' id='mobile' name='mobile' className='login-input' />
                        </div>
                        <div className='input-group'>
                            <label htmlFor='password'>
                                    Password
                            </label>
                            <input type='password' id='password' name='password' className='login-input' />
                        </div>
                            <button onClick={this.handleSubmit} className='login-btn' >Register</button>
                      
                </div>
                </form>
            </div>
        )
    }
}

export default Signup
