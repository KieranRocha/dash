import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { BOMViewer } from './pages/BOMViewer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/project/:projectId/machine/:machineId/bom" element={<BOMViewer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;