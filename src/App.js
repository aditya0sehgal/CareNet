import React, {useState, useEffect} from "react"; 
import './App.css';
import logo from './logo.svg';

import Navbar from './components/pages/Navbar'
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom'
import Home from './components/pages/homepage/Home'
import Diagonstics from './components/pages/Diagnostics/Diagnostics';
import Hgraph from './components/pages/HGraph/HGraph';
import Register from './components/pages/Register/Register'
import DiabetesForm from "./components/pages/Diabetes/DiabetesForm";

function App() {
  const [initialData, setInitialData] = useState([{}])

  useEffect(()=> {
    fetch('/api').then(response => response.json()
    ).then(data => setInitialData(data))
  },[]);

  return (
    <div className="App">
      {/* <h1> Hello - {initialData.title}</h1> */}
      
      <Router>
      <Navbar></Navbar>
      <Switch>
        <Route path='/' exact component={Home}/>
        <Route path='/Diagnostics' component={Diagonstics} />
        <Route path='/diabetes' component={DiabetesForm}/> 
        <Route path='/HGraph' component={Hgraph} />
        <Route path='/signup' component={Register}/>
      </Switch>
       </Router>
      {/* <h1>
        {initialData.res}
      </h1> */}
</div>
  );
}

export default App;