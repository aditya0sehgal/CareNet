import React, { Component } from 'react'
import './style.css'
class Signup extends Component {
    constructor(props){
        super(props);
      }
    
    submitsignup(e){
                }
    render() {
        return (
            <div className='inner-container'>
                <div className='header'>
                    Register
                </div>
                <div className='box'>
                <div className='input-group'>
                    <label htmlFor='username'>
                            Username
                        </label>
                    <input type='text' name='username' className='login-input' />
                    </div>
                    <div className='input-group'>
                    <label htmlFor='email'>
                            Email-id
                        </label>
                    <input type='text' name='email' className='login-input' />
                    </div>
                    <div className='input-group'>
                    <label htmlFor='mobile'>
                            Mobile No.
                        </label>
                    <input type='number' name='mobile' className='login-input' />
                    </div>
                    <div className='input-group'>
                    <label htmlFor='password'>
                            Password
                        </label>
                    <input type='password' name='password' className='login-input' />
                    </div>
<button type='button' className='login-btn' onClick={this.submitsignup.bind(this)}>Register</button>
                </div>
            </div>
        )
    }
}

export default Signup
