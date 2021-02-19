import React, { Component } from 'react'

class PersonalHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            diabetes : '',
            hgraph: '',
            pneumonia: ''
        };
      }
    
    componentDidMount(){
        fetch("/userdata", {
            method:"GET",
            cache: "no-cache",
            }
            ).then(response => {
            return response.json()
        })
        .then(json => {
            // this.setState({result: json[0]})
            console.log(json)
        })
    }

      render() {
          return (
              <div>
                  <h2 className='p-3'>Personal Home Page</h2>
                  <h2 className='p-3'>Chart 1</h2>
                  <h2 className='p-3'>Chart 1</h2>
                  <h2 className='p-3'>Chart 1</h2>
              </div>
          );
      }
    }

    export default PersonalHome;


