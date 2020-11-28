import React, { Component } from 'react'
import './style.css'
class Login extends Component {
    constructor(props){
        super(props);
        this.state={ };
    }
    submitlogin(e){

    }
    render() {
        return (
            <div className='inner-container'>
               <div className='header'>
                    Login
                </div>
                <div className='box'>
                <div className='input-group'>
                    <label htmlFor='username'>
                            Username
                        </label>
                    <input type='text' name='username' className='login-input' />
                    </div>
                    <div className='input-group'>
                    <label htmlFor='password'>
                            Password
                        </label>
                    <input type='password' name='password' className='login-input' />
                    </div>
<button type='button' className='login-btn' onClick={this.submitlogin.bind(this)}>Login</button>
                </div>
            </div>
        )
    }
}

export default Login
