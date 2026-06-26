import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import SettingsForm from './components/SettingsForm';
import ProxyDashboard from './components/ProxyDashboard';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <div className="page-content" style={{ paddingBottom: '1rem' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/proxy" element={<ProxyDashboard />} />
              <Route path="/settings" element={<SettingsForm />} />
            </Routes>
          </div>
          <footer style={{
            textAlign: 'center',
            padding: '1rem',
            fontSize: '0.84rem',
            color: 'var(--text-secondary)',
            borderTop: '1px solid var(--border-color)',
            backgroundColor: 'var(--panel-bg)',
            fontWeight: 500,
            letterSpacing: '0.015em'
          }}>
            Built By <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Pritam Rangari</strong>
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;
