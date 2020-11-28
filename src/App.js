import React, {useState, useEffect} from "react"; 
import './App.css';

function App() {
  const [initialData, setInitialData] = useState([{}])

  useEffect(()=> {
    fetch('/api').then(response => response.json()
    ).then(data => setInitialData(data))
  },[]);

  return (
    <div className="App">
      <h1> Hello - {initialData.title}</h1>
      <form action='/predict' method='POST'>
        <input class="form-input" type="text" name="pregnancies" placeholder="Number of Pregnancies eg. 0"></input>
        <br />
        <input class="form-input" type="text" name="glucose" placeholder="Glucose (mg/dL) eg. 80"></input>
        <br />
        <input class="form-input" type="text" name="bloodpressure" placeholder="Blood Pressure (mmHg) eg. 80"></input>
        <br />
        <input class="form-input" type="text" name="skinthickness" placeholder="Skin Thickness (mm) eg. 20"></input>
        <br />
        <input class="form-input" type="text" name="insulin" placeholder="Insulin Level (IU/mL) eg. 80"></input>
        <br />
        <input class="form-input" type="text" name="bmi" placeholder="Body Mass Index (kg/m²) eg. 23.1"></input>
        <br />
        <input class="form-input" type="text" name="dpf" placeholder="Diabetes Pedigree Function eg. 0.52"></input>
        <br />
        <input class="form-input" type="text" name="age" placeholder="Age (years) eg. 34"></input>
        <br />
        <input type="submit" class="my-cta-button" value="Predict"></input>
      </form>
      {/* <h1>
        {initialData.res}
      </h1> */}
</div>
  );
}

export default App;