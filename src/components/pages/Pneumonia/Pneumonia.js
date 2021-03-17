import React from 'react'
import '../../pages/Register/style.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter  } from 'reactstrap';


class Pneumonia extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageURL: '',
      file: null,
      submitted : false,
      result : ''
    };
    this.toggle = this.toggle.bind(this);
    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.handleChange = this.handleChange.bind(this)
  }

  toggle() {
    this.setState({ modal: !this.state.modal });
  }

  handleUploadImage(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.append('file', this.uploadInput.files[0]);

    fetch('/pneumonia-predict', {
      method: 'POST',
      body: data,
    }).then((response) => {
        response.json().then((body) => {
        console.log(this.state);
        console.log(body);
        this.setState({ imageURL: body.file, submitted: true, result: body.result });
        console.log(this.state);
      });
    });
  }

  handleChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0]),
      submitted: false
    })
    console.log(this.state);
  }

  render() {
    return (
    <div className='root-container' style={{height:'150vh' , backgroundColor: '#9c9ce7'}} >
        <div className='header' style={{'color': 'white'}} >
          Pneumonia Predictor
        </div>    
        <div className='box-container' >
            <form onSubmit={this.handleUploadImage}>
                <div>
                  <input ref={(ref) => { this.uploadInput = ref; }} onChange={ this.handleChange } type="file" />
                </div>
                <br />
                <img 
                width='250'
                height='250'
                style={{ 'margin':'1%' }} 
                src={this.state.file} alt=' '/>
                <br></br>
                <div>
                  <button type="submit" className='login-btn'>Predict</button>
                </div>
            </form>
            {this.state.submitted === true &&
                <h4 class='mt-3' style={{color:'blue'}}>
                  You {this.state.result==='Pneumonia'? 'Have Pneumonia': 'Don\'t Have Pneumonia'}
              <br></br>
              { this.state.result ==='Pneumonia'? 
                 <button className='login-btn' style={{marginBottom:'2%'}} onClick={this.toggle}>Get Recommendations</button>
                 : ''
               }
                </h4>
                
                
            }
             
            
              <Modal isOpen={this.state.modal} modalTransition={{ timeout: 300 }} backdropTransition={{ timeout: 700 }}
                        toggle={this.toggle}>
                        <ModalHeader toggle={this.toggle}>Some Precautions to be taken:</ModalHeader>
                        <ModalBody>
                        <ul>
                          <li>Avoid smoking.</li>
                          <li>Wash your hands often in warm, soapy water.</li>
                          <li>Use an alcohol-based hand sanitizer when you can’t wash your hands.</li>
                          <li>Get enough rest.</li>
                          <li>Eat a healthy diet that includes lots of fruits, vegetables, fiber, and lean protein.</li>
                          <li>Make sure to get enough rest while recovering from a cold or other illness.</li>
                          <li>Drink lots of fluid to help eliminate congestion.</li>
                          <li>Take supplements, such as Vitamin C and Zinc, to help bolster your immune system.</li>
                        </ul>
                          </ModalBody>
                        <ModalFooter>
                        Note: These are some suggestions given based only on the Input parameters that you provide. It is always advisable to see a Doctor for better medication and health check-up. 
                        </ModalFooter>
                        </Modal>
      </div>
    </div>
    );
  }
}

export default Pneumonia;