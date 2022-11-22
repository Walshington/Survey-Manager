import { useState } from "react";
import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Login } from "./Login";
import { Register } from "./Register";


function App() {
  const [data, setData] = React.useState(null);

  const [currentForm, setCurrentForm] = useState('login');

  const toggleForm = (formName) => {

    setCurrentForm(formName);
  }

  //Calls /api endpoint upon start of react application
  //Will be easier in the future to move these routes to another folder and import them here
  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className="App">
      {
        currentForm === "login" ? <Login onFormSwitch={toggleForm} /> : <Register onFormSwitch={toggleForm} />
      }
    </div>
  );
}

export default App;