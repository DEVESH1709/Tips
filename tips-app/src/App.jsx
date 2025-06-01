import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TipForm from './components/TipForm';
import Archive from './components/Archive';

function App() {
  return (
    <Router>
      <div className="nav">
        <Link to="/">Submit Tip</Link> | <Link to="/archive">Tip Archive</Link>
      </div>
      <Routes>
        <Route path="/" element={<TipForm />} />
        <Route path="/archive" element={<Archive />} />
      </Routes>
    </Router>
  );
}

export default App;


