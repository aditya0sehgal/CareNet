import React, { Component } from 'react'
import '../../pages/Register/style.css'


class Pneumonia extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageURL: '',
    };

    this.handleUploadImage = this.handleUploadImage.bind(this);
  }

  handleUploadImage(ev) {
    ev.preventDefault();

    const data = new FormData();
    data.append('file', this.uploadInput.files[0]);
    // data.append('filename', this.fileName.value);

    fetch('/pneumonia-predict', {
      method: 'POST',
      body: data,
    }).then((response) => {
      response.json().then((body) => {
        this.setState({ imageURL: `http://localhost:8000/${body.file}` });
      });
    });
  }

  render() {
    return (
    <div className='root-container' style={{height:'150vh' , backgroundImage:"url('healthgraph.jpg')"}} >
        <div className='header'>
        Pneumonia Predictor{this.state.result}
        </div>    
        <div className='box-container' >
      <form onSubmit={this.handleUploadImage}>
        <div>
          <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
        </div>
        {/* <div>
          <input ref={(ref) => { this.fileName = ref; }} type="text" placeholder="Enter the desired name of file" />
        </div> */}
        <br />
        <div>
          <button type="submit" className='login-btn'>Predict</button>
        </div>
        {/* <img src={this.state.imageURL} alt="img" /> */}
      </form>
      </div>
    </div>
    );
  }
}

export default Pneumonia;