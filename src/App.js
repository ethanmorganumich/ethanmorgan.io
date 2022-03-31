import logo from './logo.svg';
// import './App.css';
import Header from './Header.js';
import Home from './Home.js';
import { Button, Alert } from 'react-bootstrap/';
import { BrowserRouter as Router, Routes, Route, Redirect } from "react-router-dom";
import Resume from './Resume.js';

function App() {
  return (
    <Router>
      <div className='App'>
        <Header />
        <div>
          <Routes>
            <Route exact path="/" element={
              <Home />
            } />
            {/* <Route path="/resume">
              <Redirect to="/resume.pdf" />
            </Route> */}
          </Routes>
        </div>


      </div>
    </Router>
  );
}

export default App;
