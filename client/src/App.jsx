import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import NotFound from './pages/NotFound';
import Motto from './pages/Motto/Motto';

function App() {
  return (
    <Router>
      <title>DataTalk - Democratizing Data Accessibility</title>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/motto" element={<Motto />} />
      </Routes>
    </Router>
  );
}

export default App;