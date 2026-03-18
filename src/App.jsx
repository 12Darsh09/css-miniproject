import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { useState } from 'react';
import './index.css';
import Dashboard from './pages/Dashboard';
import DebrisList from './pages/DebrisList';
import AddEditDebris from './pages/AddEditDebris';
import RiskAnalyzer from './pages/RiskAnalyzer';
import LaunchTracker from './pages/LaunchTracker';
import OrbitalMap from './pages/OrbitalMap';
import Analytics from './pages/Analytics';

const NAV_ITEMS = [
  { path: '/', label: 'Home' },
  { path: '/map', label: 'Orbital Map' },
  { path: '/analytics', label: 'Analytics' },
  { path: '/debris-list', label: 'Debris List' },
  { path: '/risk-analyzer', label: 'Risk Analyzer' },
  { path: '/launch-tracker', label: 'Launch Tracker' },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">🌌</span>
        <span className="navbar-title">Space Debris Monitor</span>
      </div>
      <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
        <span className={`ham-line ${menuOpen ? 'open' : ''}`} />
        <span className={`ham-line ${menuOpen ? 'open' : ''}`} />
        <span className={`ham-line ${menuOpen ? 'open' : ''}`} />
      </button>
      <nav className={`navbar-nav ${menuOpen ? 'open' : ''}`}>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            end={item.path === '/'}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <main className="page-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/debris-list" element={<DebrisList />} />
            <Route path="/add-debris" element={<AddEditDebris />} />
            <Route path="/edit-debris/:id" element={<AddEditDebris />} />
            <Route path="/risk-analyzer" element={<RiskAnalyzer />} />
            <Route path="/launch-tracker" element={<LaunchTracker />} />
            <Route path="/map" element={<OrbitalMap />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
