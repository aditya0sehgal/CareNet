import React, {useState, useEffect} from "react"; 
import './App.css';

function App() {
  const [initialData, setInitialData] = useState([{}])

  useEffect(()=> {
    fetch('/api').then(response => response.json()
    ).then(data => setInitialData(data))
  },[]);

  return (
    <h1> Hello - {initialData.title}</h1>
  );
}

export default App;