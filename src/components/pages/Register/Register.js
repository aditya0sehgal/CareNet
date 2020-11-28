import React, { Component } from 'react';
import Login from './Login';
import Signup from './Signup';
import './style.css'

class Register extends Component {
    constructor(props){
        super(props);
        this.state={isloginopen:true,isregisopen:false };
    }
    showlogin(){
        this.setState({
            isloginopen:true,isregisopen:false
        })
    }
    showregister(){
       this.setState({
        isloginopen:false,isregisopen:true
       }) ;
    }
    render() {
        return (
            <div className='root-container'>
             <div className='box-controller'>
                 <div className={'controller ' + (this.state.isloginopen ?"selected-controller":"")}  onClick={this.showlogin.bind(this)}>
                     Login
                 </div>
                 <div className={'controller ' + (this.state.isregisopen ?"selected-controller":"")} onClick={this.showregister.bind(this)}>
                     Register
                 </div>
                 </div>
                 <div className="box-container">
                     {this.state.isloginopen && <Login/>}
                     {this.state.isregisopen && <Signup/>}
                     </div>                
            </div>
        )
    }
}

export default Register
