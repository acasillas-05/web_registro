import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Capabilities from './pages/Capabilities';
import Industries from './pages/Industries';
import Insights from './pages/Insights';
import Careers from './pages/Careers';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/capabilities" element={<Capabilities />} />
        <Route path="/industries" element={<Industries />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/careers" element={<Careers />} />
      </Routes>
    </Router>
  );
}

export default App;
