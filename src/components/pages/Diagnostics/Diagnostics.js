import React from 'react';
import Dashboard from '../../Dashboard';
import Diagnostic from '../../Diagnostic';
import { homeObjTwo } from '../homepage/Data';

function Diagnostics() {
  return (
    <>
    <Dashboard {...homeObjTwo}/>
      <Diagnostic />
     
    </>
  );
}

export default Diagnostics;