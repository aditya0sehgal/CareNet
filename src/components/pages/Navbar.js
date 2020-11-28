import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import {Button} from '../Button'
import {MdFingerprint} from 'react-icons/md';
import {FaBars,FaTimes} from 'react-icons/fa';
import {IconContext} from 'react-icons';
import './navbar.css'
function Navbar() {
    const [click,setClick]=useState(false);
    const [button,setButton]=useState(true)
    const handleclick =() =>setClick(!click);
    const closedMenu=() =>setClick(false)
const showButton=()=>{
    if(window.innerWidth<=960){
        setButton(false);
    }
        else{
        setButton(true)
    }
    };
    window.addEventListener('resize',showButton);

    
    return (
        <>
        <IconContext.Provider value={{color:'#fff'}}>
      <div className='navbar'>
          <div className='navbar-container container'>
              <Link to='/' className='navbar-logo' onClick={closedMenu}>
                 <MdFingerprint className='navbar-icon'/>
                  CareNet
              </Link>
              <div className='menu-icon' onClick={handleclick}>
                {click ?<FaTimes/> :<FaBars/>}
              </div>
              <ul className={click ? 'nav-menu active' : 'nav-menu'}
>
   <li className='nav-item'>
       <Link to='/' className='nav-links'>
           Home
       </Link>
       </li>
       <li className='nav-item'>
       <Link to='/Diagnostics' className='nav-links'>
           Diagnostics
       </Link>
       </li> 
       <li className='nav-item'>
       
       </li>  
       <li className='nav-btn'>
           {button ?(
               <Link to='/signup' className='btn-link'>
                   <Button buttonStyle='btn--outline' buttonSize='btn--medium'>SIGN UP</Button>
               </Link>
           ):(
            <Link className='btn-link'>
            <Button buttonStyle='btn--outline'>SIGN UP
            </Button>
        </Link> 
           )}
       </li>
    </ul>          
    </div>
      </div>
      </IconContext.Provider>
</>        
    )
}

export default Navbar
