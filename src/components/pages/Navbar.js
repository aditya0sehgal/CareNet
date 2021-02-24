import React,{useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import { Button  } from 'reactstrap';
import {BiDonateHeart} from 'react-icons/bi';
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

    const [user, setUserSession] = useState({user: ''})

    useEffect(()=> {
      fetch('/sessioninfo')
      .then(response => response.json()
      ).then(data => {
            console.log(data);
            console.log(user);

            if(data['username']){
                setUserSession({user : data['username']})
            }
            return ;
    })
    },[]);

    return (
        <>
        <IconContext.Provider value={{color:'#fff'}}>
      <div className='navbar'>
          <div className='navbar-container container'>
              <Link to='/' onClick={closedMenu}>
                <h2 style={{textDecoration: 'none', color: 'white'}}>
                CareNet &nbsp; 
                <BiDonateHeart className='navbar-icon'/>
                </h2> 
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
       <Link to='/Hgraph' className='nav-links'>
            Health Graph
       </Link>
       </li>
       <li className='nav-item'>
       <Link to='/Diagnostics' className='nav-links'>
           Diagnostics
       </Link>
       </li> 
       
       <li className='nav-btn'>
           {/* {button ?(
               <Link to='/signup' className='btn-link'>
                   <Button>SIGN UP</Button>
               </Link>
           ):( */}
           {user.user === ''  ? 
           
            <Link to='/signup' className='btn-link'>
                <Button>SIGN UP</Button>
            </Link>
           :
            <Link style={{textDecoration: 'none'}} className='btn-link'>
                
                <Button onClick={() => fetch('/logout')
                .then(response => response.json())
                .then(data => {
                    console.log(data); 
                    window.location.replace('/')
                    }
                )}> Logout - {user.user.toUpperCase()} </Button>
            </Link>
            
           }
           
       </li>
    </ul>          
    </div>
      </div>
      </IconContext.Provider>
</>        
    )
}

export default Navbar
