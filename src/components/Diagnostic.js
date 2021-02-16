import React from 'react';
// import './Diagnostic.css';
import { Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import { FaSyringe, FaXRay } from 'react-icons/fa';
import { IconContext } from 'react-icons/lib';
import { Link } from 'react-router-dom';

function Diagnostic() {
  return (
    <IconContext.Provider value={{ color: '#fff', size: 64 }}>
      {/* <div className='Diagnostic__section'>
        <div className='Diagnostic__wrapper'> */}
        <br></br>
        <h2 className='p-2'>Diagnostic Tests</h2>
        <div style={{display:'flex', paddingLeft:'20vw', marginTop:'3%' ,paddingRight:'25vw'}}>
          {/* <Row>
            <Col lg="4"> */}
            <Link to='/diabetes'>
              <Card style={{width:"25vw",height:'60vh',marginRight:'3vw'}} body inverse color="primary">
                  <CardTitle tag="h5">Diabetes Test</CardTitle>
                  <div className='icon'>
                    <FaSyringe />
                  </div>
                  <p>Requirements</p>
                  <CardText className='mt-2' style={{textAlign:'left'}}>
                    <ul >
                      <li>Bmi Report</li>
                      <li>Glucose Report</li>
                      <li>Weight</li>
                    </ul>
                  </CardText>
                  <Button color="danger">Check for Diabetes.</Button>                  
                </Card>
            </Link>
            <br></br>
            {/* </Col>
            <Col lg="4"> */}
            <Link to='/pneumonia'>
                <Card body inverse style={{ backgroundColor: '#333' ,width:"25vw" ,height:'60vh',marginLeft:'3vw' ,borderColor: '#333' }}>
                  <CardTitle tag="h5">Pneumonia Test</CardTitle>
                  <div className='icon'>
                    <FaXRay />
                  </div>
                  <p>Requirements</p>
                  <CardText className='mt-2' style={{textAlign:'left'}}>
                    <ul>
                      <li>Xray of lungs</li>
                    </ul>
                    <br/>
                    <br/>
                  </CardText>
                  <Button color="danger">Check for Pneumonia.</Button>
                </Card>
            </Link>
            {/* </Col>
          </Row> */}
          </div>
          <br></br>
        {/* </div> */}
      {/* </div> */}
    </IconContext.Provider>
  );
}
export default Diagnostic;