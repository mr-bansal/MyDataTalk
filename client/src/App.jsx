import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import SharedQuery from './pages/SharedQuery/SharedQuery';
import NotFound from './pages/NotFound'; // Optional

function App() {
  return (
    <Router>
      <title>DataTalk - Democratizing Database Accessibility</title>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shared/:shareId" element={<SharedQuery />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;