import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import ProjectListPage from './pages/ProjectListPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectListPage />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;