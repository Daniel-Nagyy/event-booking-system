import React from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPage from './pages/adminPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/adminPage/*" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
