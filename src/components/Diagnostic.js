import React from 'react';
import { Button } from './Button';
import './Diagnostic.css';
import { FaFire, FaSyringe, FaXRay } from 'react-icons/fa';
import { BsXDiamondFill } from 'react-icons/bs';
import { GiCrystalize } from 'react-icons/gi';
import { IconContext } from 'react-icons/lib';
import { Link } from 'react-router-dom';

function Diagnostic() {
  return (
    <IconContext.Provider value={{ color: '#fff', size: 64 }}>
      <div className='Diagnostic__section'>
        <div className='Diagnostic__wrapper'>
          <h1 className='Diagnostic__heading'>Diagnostic</h1>
          <div className='Diagnostic__container'>
            <Link to='/diabetes' className='Diagnostic__container-card'>
              <div className='Diagnostic__container-cardInfo'>
                <div className='icon'>
                  <FaSyringe />
                </div>
                <h3>Diabetes Test</h3>
                <p>Requirements</p>
                <ul >
                  <li>Bmi Report</li>
                  <li>Glucose Report</li>
                  <li>Weight</li>
                </ul>
                <Button buttonSize='btn--wide' buttonColor='primary'>
                  Check for Diabetes.
                </Button>
              </div>
            </Link>
            {/* <Link to='/' className='Diagnostic__container-card'>
              <div className='Diagnostic__container-cardInfo'>
                <div className='icon'>
                  <FaXRay />
                </div>
                <h3>Pnemonia Test</h3>
                
                <p>Requirements</p>
                <ul>
                  <li>Xray of lungs</li>
                  <li>Oxygen level report</li>
                </ul>
                <Button buttonSize='btn--wide' buttonColor='blue'>
                 Check for pnemonia.
                </Button>
              </div>
            </Link> */}
          </div>
        </div>
      </div>
    </IconContext.Provider>
  );
}
export default Diagnostic;