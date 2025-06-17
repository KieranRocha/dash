// src/renderer/src/App.tsx
import React from 'react';
// 1. Mude a importação para HashRouter
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { BOMViewer } from './pages/BOMViewer';
import DashboardLayout from './components/layout/DashboardLayout';

function App() {
  return (
    // 2. O resto do código permanece o mesmo
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<DashboardLayout />} />  {/* ← MUDANÇA */}
          <Route path="/project/:projectId/machine/:machineId/bom" element={<BOMViewer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;