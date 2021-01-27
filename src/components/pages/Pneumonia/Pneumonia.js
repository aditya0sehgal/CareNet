import React from 'react'
import '../../pages/Register/style.css'


class Pneumonia extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageURL: '',
      file: null,
      submitted : false,
      result : ''
    };

    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.handleChange = this.handleChange.bind(this)
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
    <div className='root-container' style={{height:'150vh' , backgroundImage:"url('healthgraph.jpg')"}} >
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
                </h4>
            }
      </div>
    </div>
    );
  }
}

export default Pneumonia;