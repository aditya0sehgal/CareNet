import React, { Component } from 'react'
import { Line } from '@reactchartjs/react-chart.js';
 
const data = {
    labels: ['1', '2', '3', '4', '5', '6'],
    datasets: [
      {
        label: 'Your prediction history',
        data: [12, 19, 3, 5, 2, 3],
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  }

class PersonalHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            diabetes : '',
            hgraph: '',
            pneumonia: '',
            dGData : '',
            hGData: '',
            pGData: ''
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
            console.log(json)
            this.setState({
              diabetes: json['diabetesdata'], 
              hgraph: json['hgraphdata'], 
              pneumonia: json['pneumoniadata'], 
            })
            console.log(this.state.diabetes);
            console.log(this.state.hgraph);
            console.log(this.state.pneumonia);
            let p_y_values = []
            let p_x_values = []
            let d_y_values = []
            let d_x_values = []
            let h_y_values = []
            let h_x_values = []
            this.state.pneumonia.forEach(element => {
                p_y_values.push(element.prediction === 'Normal'? 0:1)
                let loopvar = element.date.split(" ")
                p_x_values.push([loopvar[0]+'\n'+loopvar[1]])
            });
            this.state.hgraph.forEach(element => {
                h_y_values.push(element.score)
                let loopvar = element.date.split(" ")
                h_x_values.push([loopvar[0]+'\n'+loopvar[1]])
            });
            this.state.diabetes.forEach(element => {
                d_y_values.push(element.prediction*100)
                let loopvar = element.date.split(" ")
                d_x_values.push([loopvar[0]+'\n'+loopvar[1]])
            });
            console.log( p_x_values , p_y_values );
            this.setState({
              pGData: {
                labels: p_x_values.slice(-5,),
                datasets: [
                  {
                    label: 'Your past 5 prediction history data',
                    data: p_y_values.slice(-5,),
                    fill: false,
                    backgroundColor: 'rgb( 0,0,255 )',
                    borderColor: 'rgba( 0,0,255 , 0.5)',
                  },
                ],
              },
              hGData: {
                labels: h_x_values.slice(-5,),
                datasets: [
                  {
                    label: 'Your past 5 prediction history data',
                    data: h_y_values.slice(-5,),
                    fill: false,
                    backgroundColor: 'rgb( 0,0,255 )',
                    borderColor: 'rgba( 0,0,255 , 0.5)',
                  },
                ],
              },
              dGData: {
                labels: d_x_values.slice(-5,),
                datasets: [
                  {
                    label: 'Your past 5 prediction history data',
                    data: d_y_values.slice(-5,),
                    fill: false,
                    backgroundColor: 'rgb( 0,0,255 )',
                    borderColor: 'rgba( 0,0,255 , 0.5)',
                  },
                ],
              }
            })
        })
      }
    

      render() {
          return (
              <div>

                  <h2 className='p-3'>Hgraph Data</h2>
                  <div style={{maxWidth:'50vw', maxHeight:'50vh', width:'50vw', height:'50vh'}}>
                    <Line 
                        data={this.state.hGData} 
                        options={{ maintainAspectRatio: false }}
                        width={50}
                        height={50}
                    />
                  </div>


                  <h2 className='p-3'>Diabetes Data</h2>
                  <div style={{maxWidth:'50vw', maxHeight:'50vh', marginLeft:'48.0%' , width:'50vw', height:'50vh'}}>
                    <Line 
                        data={this.state.dGData} 
                        options={{ maintainAspectRatio: false }}
                        width={50}
                        height={50}
                    />
                  </div>


                  <h2 className='p-3'>Pneumonia Data</h2>
                  <div style={{maxWidth:'50vw', maxHeight:'50vh', width:'50vw', height:'50vh'}}>
                    <Line 
                        data={this.state.pGData} 
                        options={{ maintainAspectRatio: false }}
                        width={50}
                        height={50}
                    />
                  </div>


              </div>
          );
      }
    }

    export default PersonalHome;


