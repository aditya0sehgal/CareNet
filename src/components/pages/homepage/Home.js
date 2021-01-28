import React from 'react'
import Dashboard from '../../Dashboard'
import {homeObjFour, homeObjOne, homeObjThree, homeObjTwo} from './Data'
function Home() {
    return (
        <div>
        <Dashboard {...homeObjOne}/>   
        <Dashboard {...homeObjTwo}/>
        {/* <Dashboard {...homeObjThree}/> */}
        <Dashboard {...homeObjFour}/>
        </div>
    )
}

export default Home
