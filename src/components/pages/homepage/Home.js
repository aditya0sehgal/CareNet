import Dashboard from '../../Dashboard'
import React,{useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import { Button  } from 'reactstrap';
import PersonalHome from '../homepage/PersonalHome'
import {homeObjFour, homeObjOne, homeObjThree, homeObjTwo} from './Data'

function Home() {

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

    if(user.user  === ''){
        return (
                <div>
                <Dashboard {...homeObjOne}/>   
                <Dashboard {...homeObjTwo}/>
                <Dashboard {...homeObjFour}/>
                </div>
            )   
    }
    else{
        return(
            <PersonalHome></PersonalHome>
        )
    }
}

export default Home


