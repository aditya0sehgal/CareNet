import React, { Component } from 'react'

class PersonalHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result : ''
        };
      }

      render() {
          return (
              <div>
                  <h2 className='p-3'>Personal Home Page</h2>
              </div>
          );
      }
    }

    export default PersonalHome;


