import { Link } from 'react-router-dom';
import { initialDebrisData } from '../data/debrisData';
import { useState, useEffect } from 'react';

function getDebris() {
  const s = localStorage.getItem('debrisData');
  return s ? JSON.parse(s) : initialDebrisData;
}

// Quick visual snapshot for each section
function OrbitalMapPreview() {
  return (
    <div style={{ position: 'relative', width: '100%', height: 220, borderRadius: 10, background: '#000', overflow: 'hidden', border: '1px solid var(--border)' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 45% 45%, #0d2a4d 0%, #000 70%)', borderRadius: 10 }} />
      {/* Simulated globe */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 130, height: 130, borderRadius: '50%', background: 'radial-gradient(circle at 38% 35%, #1a6b8a, #0b3d55 50%, #041520)', border: '1px solid rgba(59,130,246,0.3)', boxShadow: '0 0 30px rgba(59,130,246,0.15)' }} />
      {/* Orbit rings */}
      {[150, 175, 200].map((sz, i) => (
        <div key={i} style={{ position: 'absolute', top: '50%', left: '50%', width: sz, height: sz * 0.35, borderRadius: '50%', border: `1px solid rgba(${i === 0 ? '59,130,246' : i === 1 ? '168,85,247' : '234,179,8'},0.25)`, transform: `translate(-50%, -50%) rotateX(70deg) rotateZ(${i * 30}deg)` }} />
      ))}
      {/* Dots */}
      {[['#ef4444', 28, 38], ['#f97316', 65, 20], ['#22c55e', 75, 55], ['#ef4444', 15, 65], ['#22c55e', 45, 75], ['#f97316', 80, 75], ['#22c55e', 90, 30]].map(([c, l, t], i) => (
        <div key={i} style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: c, left: `${l}%`, top: `${t}%`, boxShadow: `0 0 6px ${c}` }} />
      ))}
      <div style={{ position: 'absolute', bottom: 12, left: 12, fontSize: '0.7rem', color: 'rgba(148,163,184,0.7)', fontFamily: 'monospace' }}>WebGL · 3D · Interactive</div>
    </div>
  );
}

function DebrisListPreview({ debris }) {
  const sample = debris.slice(0, 4);
  return (
    <div style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: 'var(--bg-card)' }}>
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)', display: 'flex', gap: 8 }}>
        {['Name', 'Orbit', 'Risk'].map(h => <span key={h} style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)', flex: h === 'Name' ? 2 : 1 }}>{h}</span>)}
      </div>
      {sample.map(d => {
        const rc = d.riskLevel === 'High' ? '#ef4444' : d.riskLevel === 'Medium' ? '#f97316' : '#22c55e';
        return (
          <div key={d.id} style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ flex: 2, fontSize: '0.78rem', color: 'var(--text)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.objectName}</span>
            <span style={{ flex: 1, fontSize: '0.72rem', color: 'var(--accent)' }}>{d.orbitType}</span>
            <span style={{ flex: 1, fontSize: '0.68rem', color: rc, fontWeight: 700 }}>{d.riskLevel}</span>
          </div>
        );
      })}
    </div>
  );
}

function RiskPreview() {
  const bars = [
    { label: 'High', pct: 38, color: '#ef4444' },
    { label: 'Medium', pct: 55, color: '#f97316' },
    { label: 'Low', pct: 82, color: '#22c55e' },
  ];
  return (
    <div style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '20px 18px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {bars.map(b => (
          <div key={b.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.75rem', color: 'var(--text-2)' }}>
              <span>{b.label} Risk</span><span style={{ color: b.color, fontWeight: 700 }}>{b.pct}%</span>
            </div>
            <div style={{ height: 8, background: 'var(--bg-elevated)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${b.pct}%`, height: '100%', background: b.color, borderRadius: 4, opacity: 0.85 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsPreview() {
  const pts = [8, 14, 22, 28, 31, 37, 44];
  const max = Math.max(...pts);
  const w = 100 / (pts.length - 1);
  const path = pts.map((v, i) => `${i === 0 ? 'M' : 'L'}${i * w},${100 - (v / max) * 85}`).join(' ');
  return (
    <div style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 20 }}>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Cumulative Debris Growth</div>
      <div style={{ position: 'relative', width: '100%', height: 120 }}>
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', overflow: 'visible', position: 'absolute', inset: 0 }} preserveAspectRatio="none">
          <defs>
            <linearGradient id="linegrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${path}L${100},100 L0,100 Z`} fill="url(#linegrad)" />
          <path d={path} fill="none" stroke="#3b82f6" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
        {pts.map((v, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${i * w}%`,
            top: `${100 - (v / max) * 85}%`,
            width: 8,
            height: 8,
            backgroundColor: '#3b82f6',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 5px rgba(59,130,246,0.6)'
          }} />
        ))}
      </div>
    </div>
  );
}

function LaunchPreview() {
  const launches = [
    { name: 'Artemis III', date: '2026', status: 'Upcoming', color: '#3b82f6' },
    { name: 'Starship OFT-5', date: '2025', status: 'Success', color: '#22c55e' },
    { name: 'Chang\'e 6', date: '2024', status: 'Success', color: '#22c55e' },
  ];
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {launches.map(l => (
        <div key={l.name} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text)', fontWeight: 600 }}>🚀 {l.name}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', marginTop: 2 }}>{l.date}</div>
          </div>
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: l.color, background: `${l.color}18`, padding: '3px 8px', borderRadius: 20, border: `1px solid ${l.color}40` }}>{l.status}</span>
        </div>
      ))}
    </div>
  );
}

const SECTIONS = [
  {
    path: '/map',
    icon: '🌍',
    label: 'Orbital Map',
    color: '#3b82f6',
    heading: 'Visualize Every Object in 3D Space',
    body: 'Explore an interactive WebGL globe with all tracked debris and satellites plotted in real-time. Color-coded by risk level — red, orange and green dots let you instantly identify the most dangerous objects. Hover over any point to get full details.',
    cta: 'Open Orbital Map',
    Visual: OrbitalMapPreview,
    flip: false,
  },
  {
    path: '/debris-list',
    icon: '🛰️',
    label: 'Debris List',
    color: '#22c55e',
    heading: 'Browse and Manage All Tracked Objects',
    body: 'A filterable, searchable table of every tracked object — from spent rocket stages to defunct satellites. Add new entries, edit existing ones or remove decommissioned objects. Filter by orbit type, risk level, country and status.',
    cta: 'View Debris List',
    Visual: DebrisListPreview,
    flip: true,
  },
  {
    path: '/risk-analyzer',
    icon: '⚠️',
    label: 'Risk Analyzer',
    color: '#f97316',
    heading: 'Calculate Collision Risk in Real Time',
    body: 'Input orbital parameters and get an instant risk assessment. The analyzer evaluates altitude, velocity, and orbital type to classify collision probability as Low, Medium or High — helping mission planners make safer decisions.',
    cta: 'Analyze Risk',
    Visual: RiskPreview,
    flip: false,
  },
  {
    path: '/analytics',
    icon: '📊',
    label: 'Analytics',
    color: '#a855f7',
    heading: 'Historical Trends and Global Breakdown',
    body: 'Track how orbital debris has accumulated since the first satellite launches. The Historical Timeline shows cumulative growth while the Global Agency Leaderboard ranks countries by their total contribution to the debris environment.',
    cta: 'Explore Analytics',
    Visual: AnalyticsPreview,
    flip: true,
  },
  {
    path: '/launch-tracker',
    icon: '🚀',
    label: 'Launch Tracker',
    color: '#eab308',
    heading: 'Track Every Launch — Past and Future',
    body: 'Follow historical and upcoming space launches from agencies around the world. Detailed mission cards include launch vehicle, agency, payload details and current mission status — keeping you informed on humanity\'s continued push into orbit.',
    cta: 'View Launches',
    Visual: LaunchPreview,
    flip: false,
  },
];

export default function Dashboard() {
  const [debris, setDebris] = useState([]);
  useEffect(() => setDebris(getDebris()), []);

  const total = debris.length;
  const high = debris.filter(d => d.riskLevel === 'High').length;
  const countries = [...new Set(debris.map(d => d.country))].length;

  return (
    <div className="home-page">
      {/* ── Hero banner ── */}
      <div className="home-hero-banner">
        <div className="home-banner-bg" />
        <div className="home-banner-content">
          <div className="home-banner-eyebrow">🌌 Space Debris Monitor</div>
          <h1 className="home-banner-title">Earth's Orbit is Getting<br /><span className="home-banner-accent">Crowded.</span></h1>
          <p className="home-banner-desc">
            An open monitoring platform for tracking, analyzing and visualizing space debris and inactive satellites in Earth's orbit. Protecting future missions starts with understanding the problem.
          </p>
          <div className="home-banner-stats">
            <div className="home-banner-stat">{total}<span>Tracked Objects</span></div>
            <div className="home-banner-stat-div" />
            <div className="home-banner-stat" style={{ color: '#ef4444' }}>{high}<span style={{ color: 'var(--text-3)' }}>High Risk</span></div>
            <div className="home-banner-stat-div" />
            <div className="home-banner-stat" style={{ color: '#a855f7' }}>{countries}<span style={{ color: 'var(--text-3)' }}>Countries</span></div>
          </div>
        </div>
      </div>

      {/* ── Editorial sections ── */}
      <div className="home-sections">
        {SECTIONS.map((sec) => {
          const Visual = sec.Visual;
          return (
            <div key={sec.path} className={`home-section ${sec.flip ? 'home-section-flip' : ''}`}>
              {/* Text side */}
              <div className="home-section-text">
                <div className="home-section-eyebrow" style={{ color: sec.color }}>
                  {sec.icon} {sec.label}
                </div>
                <h2 className="home-section-heading">{sec.heading}</h2>
                <p className="home-section-body">{sec.body}</p>
                <Link to={sec.path} className="home-section-link" style={{ color: sec.color, borderColor: `${sec.color}40` }}>
                  {sec.cta} →
                </Link>
              </div>

              {/* Visual side */}
              <div className="home-section-visual">
                <Visual debris={debris} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
