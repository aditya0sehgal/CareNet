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
      handleSubmit(event) {
        console.log("making request")
        // fetch('/pneumonia-predict', {
        //     method: 'POST',
        //     body: data,
        //   }).then((response) => {
        //       response.json().then((body) => {
        //       console.log(this.state);
        //       console.log(body);
        //       this.setState({ imageURL: body.file, submitted: true, result: body.result });
        //       console.log(this.state);
        //     });
        //   });
    //     fetch("/register", {
    //         method:"POST",
    //         cache: "no-cache",
    //         body: data,
    //         headers:{
    //             "content_type":"application/json",
    //         }
    //         }
    //     ).then(response => {
    //     return response.json()
    //   })
    //   .then(json => {
    //   this.setState({result: json[0]})
    //   console.log(this.state.result)
    //   })
      }
    render() {
        return (
            <div className='inner-container'>
                <div className='header'>
                    Register
                </div>
                <form action='/register' method='POST' onSubmit={this.handleSubmit}>
                <div className='box'>
                        
                        <div className='input-group'>
                            <label htmlFor='name'>
                                    Username
                            </label>
                            <input type='text' name='name' className='login-input' />
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
                            <button type='submit' className='login-btn' >Register</button>
                      
                </div>
                </form>
            </div>
        )
    }
}

export default Signup
