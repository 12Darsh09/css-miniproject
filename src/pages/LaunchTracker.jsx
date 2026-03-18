import { useState, useEffect } from 'react';
import { initialDebrisData } from '../data/debrisData';

const LAUNCH_HISTORY = [
  { year: 1957, launches: 1,   rockets: 1,   estimatedDebris: 1    },
  { year: 1960, launches: 3,   rockets: 2,   estimatedDebris: 4    },
  { year: 1965, launches: 5,   rockets: 4,   estimatedDebris: 8    },
  { year: 1969, launches: 6,   rockets: 5,   estimatedDebris: 10   },
  { year: 1971, launches: 7,   rockets: 5,   estimatedDebris: 12   },
  { year: 1977, launches: 8,   rockets: 6,   estimatedDebris: 14   },
  { year: 1980, launches: 10,  rockets: 8,   estimatedDebris: 18   },
  { year: 1982, launches: 12,  rockets: 9,   estimatedDebris: 20   },
  { year: 1984, launches: 14,  rockets: 10,  estimatedDebris: 22   },
  { year: 1985, launches: 15,  rockets: 11,  estimatedDebris: 24   },
  { year: 1986, launches: 13,  rockets: 10,  estimatedDebris: 21   },
  { year: 1988, launches: 10,  rockets: 8,   estimatedDebris: 16   },
  { year: 1991, launches: 9,   rockets: 7,   estimatedDebris: 14   },
  { year: 1993, launches: 11,  rockets: 8,   estimatedDebris: 18   },
  { year: 1994, launches: 12,  rockets: 9,   estimatedDebris: 20   },
  { year: 1996, launches: 14,  rockets: 10,  estimatedDebris: 22   },
  { year: 1997, launches: 18,  rockets: 14,  estimatedDebris: 32   },
  { year: 1999, launches: 20,  rockets: 15,  estimatedDebris: 38   },
  { year: 2000, launches: 22,  rockets: 17,  estimatedDebris: 42   },
  { year: 2002, launches: 24,  rockets: 18,  estimatedDebris: 46   },
  { year: 2005, launches: 28,  rockets: 21,  estimatedDebris: 52   },
  { year: 2006, launches: 30,  rockets: 22,  estimatedDebris: 58   },
  { year: 2007, launches: 32,  rockets: 24,  estimatedDebris: 240  },
  { year: 2008, launches: 35,  rockets: 26,  estimatedDebris: 70   },
  { year: 2009, launches: 36,  rockets: 27,  estimatedDebris: 2300 },
  { year: 2010, launches: 38,  rockets: 28,  estimatedDebris: 78   },
  { year: 2011, launches: 42,  rockets: 31,  estimatedDebris: 85   },
  { year: 2013, launches: 45,  rockets: 34,  estimatedDebris: 90   },
  { year: 2014, launches: 50,  rockets: 37,  estimatedDebris: 98   },
  { year: 2017, launches: 58,  rockets: 42,  estimatedDebris: 110  },
  { year: 2021, launches: 120, rockets: 90,  estimatedDebris: 180  },
  { year: 2022, launches: 180, rockets: 135, estimatedDebris: 250  },
  { year: 2023, launches: 220, rockets: 160, estimatedDebris: 300  },
  { year: 2024, launches: 260, rockets: 190, estimatedDebris: 350  },
];

export default function LaunchTracker() {
  const [debris,      setDebris]      = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [animated,    setAnimated]    = useState(false);
  const [filterFrom,  setFilterFrom]  = useState('');
  const [filterTo,    setFilterTo]    = useState('');

  useEffect(() => {
    const s = localStorage.getItem('debrisData');
    setDebris(s ? JSON.parse(s) : initialDebrisData);
    setTimeout(() => setAnimated(true), 120);
  }, []);

  const debrisByYear = {};
  debris.forEach(d => {
    if (!debrisByYear[d.launchYear]) debrisByYear[d.launchYear] = [];
    debrisByYear[d.launchYear].push(d);
  });

  const filtered = LAUNCH_HISTORY.filter(h => {
    if (filterFrom && h.year < Number(filterFrom)) return false;
    if (filterTo   && h.year > Number(filterTo))   return false;
    return true;
  });

  const maxLaunches = Math.max(...filtered.map(h => h.launches), 1);
  const totalLaunches    = filtered.reduce((s, h) => s + h.launches,         0);
  const totalEstDebris   = filtered.reduce((s, h) => s + h.estimatedDebris, 0);
  const highImpactYears  = filtered.filter(h => h.estimatedDebris > 100).length;

  const selected      = selectedYear ? LAUNCH_HISTORY.find(h => h.year === selectedYear) : null;
  const selectedDebris = selectedYear ? (debrisByYear[selectedYear] || []) : [];

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Launch Impact Tracker</div>
        <div className="page-subtitle">Year-by-year history of rocket launches and the debris they left behind</div>
      </div>

      {/* Explainer */}
      <div className="explainer">
        <div className="explainer-text" style={{ marginBottom: 0 }}>
          Every rocket launch has a cost — not just fuel, but space debris. When rockets reach orbit,
          they leave behind empty stages (rocket bodies), broken parts, and discarded hardware. This page shows how
          much estimated debris was created each year and which years had the biggest impact on orbit safety (like collisions or ASAT tests).
        </div>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-value">{totalLaunches.toLocaleString()}</div>
          <div className="stat-label">Total Launches</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalEstDebris.toLocaleString()}</div>
          <div className="stat-label">Est. Debris Objects</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{highImpactYears}</div>
          <div className="stat-label">High Impact Years</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{filtered.length}</div>
          <div className="stat-label">Years on Record</div>
        </div>
      </div>

      {/* Filter */}
      <div className="filter-bar" style={{ marginBottom: 20 }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-3)', fontWeight: 600 }}>Filter years:</span>
        <input type="number" placeholder="From" value={filterFrom} onChange={e => setFilterFrom(e.target.value)} style={{ maxWidth: 100 }} />
        <span style={{ color: 'var(--text-3)' }}>–</span>
        <input type="number" placeholder="To"   value={filterTo}   onChange={e => setFilterTo(e.target.value)}   style={{ maxWidth: 100 }} />
        {(filterFrom || filterTo) && (
          <button className="btn btn-secondary btn-sm" onClick={() => { setFilterFrom(''); setFilterTo(''); }}>✕ Reset</button>
        )}
        <span style={{ marginLeft: 'auto', fontSize: '0.74rem', color: 'var(--text-3)' }}>Click a card to see details</span>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Year Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
          {filtered.map(h => (
            <div
              key={h.year}
              className={`year-card${selectedYear === h.year ? ' selected' : ''}`}
              onClick={() => setSelectedYear(selectedYear === h.year ? null : h.year)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div className="year-num">{h.year}</div>
                <span className={`badge ${h.estimatedDebris > 200 ? 'badge-high' : h.estimatedDebris > 80 ? 'badge-medium' : 'badge-low'}`}>
                  {h.estimatedDebris > 200 ? 'Critical' : h.estimatedDebris > 80 ? 'Medium' : 'Low'}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: '0.78rem', color: 'var(--text-2)', marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Est. Debris</span>
                  <span style={{ color: h.estimatedDebris > 200 ? 'var(--red)' : 'var(--orange)', fontWeight: 700, fontSize: '1.1rem', fontFamily: 'var(--mono)' }}>
                    {h.estimatedDebris.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="mini-bar" style={{ marginTop: 10 }}>
                <div className="mini-bar-fill" style={{ width: animated ? `${(h.launches / maxLaunches) * 100}%` : '0%' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        <div style={{ position: 'sticky', top: 16 }}>
          {!selectedYear ? (
            <div className="card" style={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="empty-state">Select a year card to see details.</div>
            </div>
          ) : (
            <div className="card">
              <div className="section-title">{selectedYear} — Detail</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
                {[
                  ['Launches', selected.launches, 'var(--accent)'],
                  ['Rocket Bodies', selected.rockets, 'var(--purple)'],
                ].map(([label, val, color]) => (
                  <div key={label} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '1.5rem', fontWeight: 700, color }}>{val}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{label}</div>
                  </div>
                ))}
                <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: '14px', textAlign: 'center', gridColumn: '1/-1' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '1.8rem', fontWeight: 700, color: selected.estimatedDebris > 200 ? 'var(--red)' : 'var(--orange)' }}>
                    {selected.estimatedDebris.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>Estimated Debris Objects</div>
                </div>
              </div>

              {selected.estimatedDebris > 200 && (
                <div className="alert-box alert-error" style={{ marginBottom: 14 }}>
                  ⚠ Major debris event in {selectedYear} — likely a catastrophic collision or anti-satellite missile test.
                </div>
              )}

              {selectedDebris.length > 0 && (
                <>
                  <div className="section-title">Catalog entries from {selectedYear}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {selectedDebris.map(d => (
                      <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'var(--bg-elevated)', borderRadius: 6, fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--text)' }}>{d.objectName}</span>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <span className={`badge badge-${d.orbitType.toLowerCase()}`}>{d.orbitType}</span>
                          <span className={`badge badge-${d.riskLevel.toLowerCase()}`}>{d.riskLevel}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {selectedDebris.length === 0 && (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', marginTop: 8 }}>No catalog entries for {selectedYear}.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
