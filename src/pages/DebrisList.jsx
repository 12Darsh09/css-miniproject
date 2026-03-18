import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { initialDebrisData } from '../data/debrisData';

const ORBIT_TYPES = ['All', 'LEO', 'MEO', 'GEO'];
const RISK_LEVELS = ['All', 'High', 'Medium', 'Low'];
const STATUSES    = ['All', 'Active', 'Debris', 'Inactive'];

const riskClass   = { High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low' };
const orbitClass  = { LEO: 'badge-leo',   MEO: 'badge-meo',      GEO: 'badge-geo'  };
const statusClass = { Active: 'badge-active', Inactive: 'badge-inactive', Debris: 'badge-debris' };

export default function DebrisList() {
  const [debris,   setDebris]   = useState([]);
  const [search,   setSearch]   = useState('');
  const [orbit,    setOrbit]    = useState('All');
  const [risk,     setRisk]     = useState('All');
  const [status,   setStatus]   = useState('All');
  const [yearFrom, setYearFrom] = useState('');
  const [yearTo,   setYearTo]   = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const s = localStorage.getItem('debrisData');
    setDebris(s ? JSON.parse(s) : initialDebrisData);
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Delete this object?')) return;
    const updated = debris.filter(d => d.id !== id);
    setDebris(updated);
    localStorage.setItem('debrisData', JSON.stringify(updated));
  };

  const filtered = debris
    .filter(d => search ? (d.objectName.toLowerCase().includes(search.toLowerCase()) || d.objectId.toLowerCase().includes(search.toLowerCase())) : true)
    .filter(d => orbit  !== 'All' ? d.orbitType  === orbit  : true)
    .filter(d => risk   !== 'All' ? d.riskLevel  === risk   : true)
    .filter(d => status !== 'All' ? d.status      === status : true)
    .filter(d => yearFrom ? d.launchYear >= Number(yearFrom) : true)
    .filter(d => yearTo   ? d.launchYear <= Number(yearTo)   : true);

  const hasFilters = search || orbit !== 'All' || risk !== 'All' || status !== 'All' || yearFrom || yearTo;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Debris List</div>
        <div className="page-subtitle">Showing {filtered.length} of {debris.length} objects</div>
      </div>

      {/* Page Explainer */}
      <div className="explainer">
        <div className="explainer-text" style={{ marginBottom: 0 }}>
          This page shows all tracked space objects in the catalog. You can search or filter any entry.
          Each object has details about its <strong>Orbit</strong> (region of space), <strong>Velocity</strong> (speed in km/s), <strong>Altitude</strong> (height in km), and <strong>Risk Level</strong> (likelihood of collision).
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by name or ID…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: '1 1 200px', maxWidth: 280 }}
        />
        <select value={orbit}  onChange={e => setOrbit(e.target.value)}  style={{ flex: '1 1 120px', maxWidth: 150 }}>
          {ORBIT_TYPES.map(o => <option key={o}>{o}</option>)}
        </select>
        <select value={risk}   onChange={e => setRisk(e.target.value)}   style={{ flex: '1 1 120px', maxWidth: 150 }}>
          {RISK_LEVELS.map(r => <option key={r}>{r}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)} style={{ flex: '1 1 120px', maxWidth: 150 }}>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <input type="number" placeholder="Year from" value={yearFrom} onChange={e => setYearFrom(e.target.value)} style={{ flex: '1 1 100px', maxWidth: 120 }} />
        <input type="number" placeholder="Year to"   value={yearTo}   onChange={e => setYearTo(e.target.value)}   style={{ flex: '1 1 100px', maxWidth: 120 }} />
        {hasFilters && (
          <button className="btn btn-secondary btn-sm" onClick={() => { setSearch(''); setOrbit('All'); setRisk('All'); setStatus('All'); setYearFrom(''); setYearTo(''); }}>
            ✕ Reset
          </button>
        )}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="empty-state">No objects match your filters.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Object ID</th>
                <th>Name</th>
                <th>Country</th>
                <th>Year</th>
                <th>Orbit</th>
                <th>Velocity</th>
                <th>Altitude</th>
                <th>Risk</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <tr key={d.id}>
                  <td style={{ color: 'var(--text-3)', fontSize: '0.75rem' }}>{i + 1}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--accent)' }}>{d.objectId}</td>
                  <td style={{ fontWeight: 500, color: 'var(--text)', maxWidth: 170, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.objectName}</td>
                  <td>{d.country}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem' }}>{d.launchYear}</td>
                  <td><span className={`badge ${orbitClass[d.orbitType] || ''}`}>{d.orbitType}</span></td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem' }}>{d.velocity} <span style={{ color: 'var(--text-3)', fontSize: '0.62rem' }}>km/s</span></td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem' }}>{d.altitude} <span style={{ color: 'var(--text-3)', fontSize: '0.62rem' }}>km</span></td>
                  <td><span className={`badge ${riskClass[d.riskLevel] || ''}`}>{d.riskLevel}</span></td>
                  <td><span className={`badge ${statusClass[d.status] || ''}`}>{d.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
