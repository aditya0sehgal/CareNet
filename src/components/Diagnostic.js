import React from 'react';
import { Button  } from 'reactstrap';
import './Diagnostic.css';
import { FaSyringe, FaXRay } from 'react-icons/fa';
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
                <Button buttonSize='btn--wide'color="secondary">
                  Check for Diabetes.
                </Button>
              </div>
            </Link>
            
            <Link to='/pneumonia' className='Diagnostic__container-card'>
              <div className='Diagnostic__container-cardInfo'>
                <div className='icon'>
                  <FaXRay />
                </div>
                <h3>Pneumonia Test</h3>
                
                <p>Requirements</p>
                <ul>
                  <li>Xray of lungs</li>
                  {/* <li>Oxygen level report</li> */}
                </ul>
              
                <Button buttonSize='btn--wide' color="primary">
              
                 Check for Pneumonia.
                </Button>
              
              </div>
            </Link>
          </div>
        </div>
      </div>
    </IconContext.Provider>
  );
}
export default Diagnostic;