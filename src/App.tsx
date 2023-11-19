import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import ComicFormPage from './ComicFormPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/comic-form" element={<ComicFormPage />} />
      </Routes>
    </Router>
  );
};

export default App;
