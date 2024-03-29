import React, { Component } from 'react'
import { Line } from '@reactchartjs/react-chart.js';
 
import { Table  } from 'reactstrap';

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
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            diabetes : {},
            hgraph: {},
            pneumonia: {},
            dGData : {},
            hGData: {},
            pGData: {},
            hlen: 0,
            dlen: 0,
            plen: 0,
            dataishere : false
        };

      }
    
    componentDidMount(){
        this._isMounted = true;
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
              dataishere : true, 
              hgraph: json['hgraphdata'],
              hlen: json['hgraphdata'].length,
              dlen: json['diabetesdata'].length,
              plen: json['pneumoniadata'].length,
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
                d_y_values.push(element.prediction)
                let loopvar = element.date.split(" ")
                d_x_values.push([loopvar[0]+'\n'+loopvar[1]])
            });
            console.log( p_x_values , p_y_values );
            this.setState({
              pGData: {
                labels: p_x_values.length<5 ? p_x_values : p_x_values.slice(-5,),
                datasets: [
                  {
                    label: 'Your prediction history data',
                    data: p_y_values.length<5 ? p_y_values : p_y_values.slice(-5,),
                    fill: false,
                    backgroundColor: 'rgb( 0,0,255 )',
                    borderColor: 'rgba( 0,0,255 , 0.5)',
                  },
                ],
              },
              hGData: {
                labels: h_x_values.length<5 ? h_x_values : h_x_values.slice(-5,),
                datasets: [
                  {
                    label: 'Your prediction history data',
                    data: h_y_values.length<5 ? h_y_values : h_y_values.slice(-5,),
                    fill: false,
                    backgroundColor: 'rgb( 0,0,255 )',
                    borderColor: 'rgba( 0,0,255 , 0.5)',
                  },
                ],
              },
              dGData: {
                labels: d_x_values.length<5 ? d_x_values : d_x_values.slice(-5,),
                datasets: [
                  {
                    label: 'Your prediction history data',
                    data: d_y_values.length<5 ? d_y_values : d_y_values.slice(-5,),
                    fill: false,
                    backgroundColor: 'rgb( 0,0,255 )',
                    borderColor: 'rgba( 0,0,255 , 0.5)',
                  },
                ],
              }
            })
            console.log(this.state);
          })
      }

      render() {
        if(this.state.dataishere  === true){
          return (
              <div style={{width:'100vw', maxWidth:'100vw'}}>
                { this.state.hlen > 0 ? 
                <> 
                  <br></br>
                  <h2 className='pt-3 pb-3'>H-Graph Data</h2>                  
                  <div style={{maxHeight:'50vh', display:'flex', height:'50vh'}}>
                    <div style={{maxWidth:'48vw',display:'flex', width:'48vw'}}>
                      <Line 
                          data={this.state.hGData} 
                          options={{ maintainAspectRatio: false }}
                          width={50}
                          height={50}
                          style={{ float:'left'}} 
                      />
                    </div>
                    { this.state.hlen >= 5 ? 
                    <Table style={{fontWeight: 'bold', float:'right',width:'48vw', height:'50vh'}} striped hover>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Health Score</th>
                        </tr>
                      </thead>
                
                      {/* { console.log( this.state.hgraph ) }
                      { console.log( this.state.hGData.labels ) } */}
                     {/* { Object.keys(githubData).map(key => ( <Issue key={key} details={githubData[key]} />)) } */}
                      {/* { console.log( this.state.pGData.datasets.data ) } */}
                      <tbody>
                        <tr>
                          <td style={{color:'red'}}>{this.state.hgraph.slice(-5,)[0].date}</td>
                          <td style={{color:'green'}}>{this.state.hgraph.slice(-5,)[0].score}</td>
                        </tr>
                        <tr>
                          <td style={{color:'red'}}>{this.state.hgraph.slice(-5,)[1].date}</td>
                          <td style={{color:'green'}}>{this.state.hgraph.slice(-5,)[1].score}</td>
                        </tr>
                        <tr>
                          <td style={{color:'red'}}>{this.state.hgraph.slice(-5,)[2].date}</td>
                          <td style={{color:'green'}}>{this.state.hgraph.slice(-5,)[2].score}</td>
                        </tr>
                        <tr>
                          <td style={{color:'red'}}>{this.state.hgraph.slice(-5,)[3].date}</td>
                          <td style={{color:'green'}}>{this.state.hgraph.slice(-5,)[3].score}</td>
                        </tr>
                        <tr>
                          <td style={{color:'red'}}>{this.state.hgraph.slice(-5,)[4].date}</td>
                          <td style={{color:'green'}}>{this.state.hgraph.slice(-5,)[4].score}</td>
                        </tr>
                        
                      </tbody>

                    </Table> : <> </> }
                  </div>
                </> : <> </> }
                { this.state.dlen > 0 ? 
                <>
                  <br></br>
                  <br></br>
                  <h2 className='pt-3 pd-3'>Diabetes Data</h2>
                  <br></br>
                  <div style={{ maxHeight:'50vh',  display:'flex', height:'50vh'}}>
                  { this.state.dlen >= 5 ? 
                    <Table style={{fontWeight: 'bold', float:'left',width:'48vw', height:'50vh'}} striped hover>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Diabetes Prediction</th>
                        </tr>
                      </thead>
                
                      <tbody>
                        <tr>
                          <td style={{color:'red'}}>{this.state.diabetes.slice(-5,)[0].date}</td>
                          <td style={{color:'green'}}>{this.state.diabetes.slice(-5,)[0].prediction}</td>
                        </tr>
                        <tr>
                          <td style={{color:'red'}}>{this.state.diabetes.slice(-5,)[1].date}</td>
                          <td style={{color:'green'}}>{this.state.diabetes.slice(-5,)[1].prediction}</td>
                        </tr>
                        <tr>
                          <td style={{color:'red'}}>{this.state.diabetes.slice(-5,)[2].date}</td>
                          <td style={{color:'green'}}>{this.state.diabetes.slice(-5,)[2].prediction}</td>
                        </tr>
                        <tr>
                          <td style={{color:'red'}}>{this.state.diabetes.slice(-5,)[3].date}</td>
                          <td style={{color:'green'}}>{this.state.diabetes.slice(-5,)[3].prediction }</td>
                        </tr>
                        <tr>
                          <td style={{color:'red'}}>{this.state.diabetes.slice(-5,)[4].date}</td>
                          <td style={{color:'green'}}>{this.state.diabetes.slice(-5,)[4].prediction }</td>
                        </tr>
                        
                      </tbody>

                    </Table>  : <> </> }
                    <div style={{maxWidth:'48vw',display:'flex', width:'48vw'}}>
                      <Line 
                          data={this.state.dGData} 
                          options={{ maintainAspectRatio: false }}
                          width={50}
                          height={50}
                          style={{ float:'right'}} 
                      />
                    </div>
                  </div>
                  </> : <> </> }
                  <br></br>
                  { this.state.plen > 0 ? 
                  <>
                  <br></br>
                  <h2 className='pt-3 pd-3'>Pneumonia Data</h2>
                  <br></br>
                  <div style={{ maxHeight:'50vh',display:'flex' , height:'50vh'}}>
                    <div style={{maxWidth:'48vw',display:'flex', width:'48vw'}}>
                      <Line 
                          data={this.state.pGData} 
                          options={{ maintainAspectRatio: false }}
                          width={50}
                          height={50}
                          style={{ float:'left'}} 
                      />
                    </div>
                    { this.state.plen >= 5 ? 
                    <Table style={{fontWeight: 'bold', float:'right',width:'48vw', height:'50vh'}} striped hover>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Pneumonia Prediction</th>
                        </tr>
                      </thead>
              
                      <tbody>
                      <tr>
                          <td style={{color:'red'}}>{this.state.pneumonia.slice(-5,)[0].date}</td>
                          <td style={{color:'green'}}>{this.state.pneumonia.slice(-5,)[0].prediction}</td>
                        </tr>
                        <tr>
                          <td style={{color:'red'}}>{this.state.pneumonia.slice(-5,)[1].date}</td>
                          <td style={{color:'green'}}>{this.state.pneumonia.slice(-5,)[1].prediction}</td>
                        </tr>
                        <tr>
                          <td style={{color:'red'}}>{this.state.pneumonia.slice(-5,)[2].date}</td>
                          <td style={{color:'green'}}>{this.state.pneumonia.slice(-5,)[2].prediction}</td>
                        </tr>
                        <tr>
                          <td style={{color:'red'}}>{this.state.pneumonia.slice(-5,)[3].date}</td>
                          <td style={{color:'green'}}>{this.state.pneumonia.slice(-5,)[3].prediction}</td>
                        </tr>
                        <tr>
                          <td style={{color:'red'}}>{this.state.pneumonia.slice(-5,)[4].date}</td>
                          <td style={{color:'green'}}>{this.state.pneumonia.slice(-5,)[4].prediction}</td>
                        </tr>
                        
                      </tbody>

                    </Table>  : <> </> }
                  </div>
                </> : <> </> }
              </div>
          );
        }
        else{
          return <></>
        }
      }
    }

    export default PersonalHome;


