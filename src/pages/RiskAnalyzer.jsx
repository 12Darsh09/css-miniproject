import { useState } from 'react';

function calcRisk(velocity, orbitType, altitude) {
  let score = 0;
  if (velocity >= 8) score += 40;
  else if (velocity >= 6) score += 25;
  else if (velocity >= 4) score += 15;
  else score += 5;

  if (orbitType === 'LEO') score += 35;
  else if (orbitType === 'MEO') score += 15;
  else if (orbitType === 'GEO') score += 8;

  const alt = Number(altitude);
  if (orbitType === 'LEO') {
    if (alt < 500) score += 25;
    else if (alt < 800) score += 15;
    else score += 8;
  } else if (orbitType === 'MEO') {
    score += 5;
  } else {
    score += 3;
  }

  if (score >= 75) return 'High';
  if (score >= 45) return 'Medium';
  return 'Low';
}

const riskDetails = {
  High: {
    className: 'high',
    title: 'HIGH RISK',
    icon: '🔴',
    color: 'var(--red)',
    desc: 'This object poses a significant collision threat. Its high velocity combined with a dense orbit zone and low altitude greatly increases the probability of an impact with active satellites.',
    actions: [
      'Continuous radar tracking required',
      'Notify nearby active satellite operators',
      'Evaluate emergency avoidance manoeuvres',
      'Consider coordinated debris removal',
    ],
  },
  Medium: {
    className: 'medium',
    title: 'MEDIUM RISK',
    icon: '🟠',
    color: 'var(--orange)',
    desc: 'This object presents a moderate risk. Regular monitoring is advised. The risk may increase if the orbit decays due to atmospheric drag over time.',
    actions: [
      'Schedule periodic radar checks',
      'Notify potential conjunction partners 72 h ahead',
      'Monitor for orbital decay',
    ],
  },
  Low: {
    className: 'low',
    title: 'LOW RISK',
    icon: '🟢',
    color: 'var(--green)',
    desc: 'Minimal immediate risk. Standard catalog tracking protocols are sufficient for this object given its current orbit parameters.',
    actions: [
      'Regular catalog checks sufficient',
      'Periodic review every 30 days',
    ],
  },
};

export default function RiskAnalyzer() {
  const [velocity,  setVelocity]  = useState('');
  const [orbitType, setOrbitType] = useState('');
  const [altitude,  setAltitude]  = useState('');
  const [result,    setResult]    = useState(null);
  const [errors,    setErrors]    = useState({});

  const handleAnalyze = (e) => {
    e.preventDefault();
    const errs = {};
    if (!velocity || Number(velocity) <= 0 || Number(velocity) > 30)
      errs.velocity = 'Enter a velocity between 0.1 and 30 km/s';
    if (!orbitType)
      errs.orbitType = 'Select an orbit type';
    if (!altitude || Number(altitude) <= 0)
      errs.altitude = 'Enter a positive altitude in km';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const risk = calcRisk(Number(velocity), orbitType, altitude);
    setResult({ risk, velocity: Number(velocity), orbitType, altitude: Number(altitude) });
  };

  const reset = () => { setVelocity(''); setOrbitType(''); setAltitude(''); setResult(null); setErrors({}); };

  const rd = result ? riskDetails[result.risk] : null;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Risk Analyzer</div>
        <div className="page-subtitle">Estimate the collision risk of a space object from its orbital parameters</div>
      </div>

      {/* Explainer */}
      <div className="explainer">
        <div className="explainer-text" style={{ marginBottom: 0 }}>
          Enter an object's speed, orbit type, and height above Earth. The system scores these factors
          and calculates whether the object is a Low, Medium, or High collision risk. Higher speeds at lower altitudes in crowded orbits (like LEO) score the most points.
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Form */}
        <div className="card">
          <div className="section-title">Input Parameters</div>
          <form onSubmit={handleAnalyze} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div className="form-group">
                <label htmlFor="ra-vel">Velocity (km/s)</label>
                <input id="ra-vel" type="number" step="0.1" min="0.1" max="30" placeholder="e.g. 7.8"
                  value={velocity} onChange={e => { setVelocity(e.target.value); setErrors(p => ({ ...p, velocity: '' })); }}
                  className={errors.velocity ? 'error' : ''} />
                {errors.velocity && <div className="form-error">{errors.velocity}</div>}
                <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginTop: 2 }}>
                  Typical range: LEO 7–8 km/s · MEO 3–4 km/s · GEO ~3 km/s
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="ra-orbit">Orbit Type</label>
                <select id="ra-orbit" value={orbitType}
                  onChange={e => { setOrbitType(e.target.value); setErrors(p => ({ ...p, orbitType: '' })); }}
                  className={errors.orbitType ? 'error' : ''}>
                  <option value="">-- Select Orbit --</option>
                  <option value="LEO">LEO — Low Earth Orbit (200–2,000 km)</option>
                  <option value="MEO">MEO — Medium Earth Orbit (2,000–35,786 km)</option>
                  <option value="GEO">GEO — Geostationary Orbit (~35,786 km)</option>
                </select>
                {errors.orbitType && <div className="form-error">{errors.orbitType}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="ra-alt">Altitude (km)</label>
                <input id="ra-alt" type="number" step="1" min="1" placeholder="e.g. 420"
                  value={altitude} onChange={e => { setAltitude(e.target.value); setErrors(p => ({ ...p, altitude: '' })); }}
                  className={errors.altitude ? 'error' : ''} />
                {errors.altitude && <div className="form-error">{errors.altitude}</div>}
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: '12px', fontSize: '1rem' }}>Analyze Risk</button>
                <button type="button" className="btn btn-secondary" style={{ flex: 1, padding: '12px', fontSize: '0.9rem' }} onClick={reset}>Reset</button>
              </div>
            </div>
          </form>

          <div className="divider" />
          <div className="section-title">Scoring Reference</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, fontSize: '0.78rem' }}>
            {[
              ['Velocity ≥ 8 km/s', '+40 pts', 'var(--red)'],
              ['LEO orbit type',    '+35 pts', 'var(--red)'],
              ['Altitude < 500 km (LEO)', '+25 pts', 'var(--orange)'],
              ['Velocity 6–8 km/s', '+25 pts', 'var(--orange)'],
              ['MEO orbit type',    '+15 pts', 'var(--yellow)'],
            ].map(([label, pts, color]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-2)' }}>
                <span>{label}</span>
                <span style={{ color, fontWeight: 700 }}>{pts}</span>
              </div>
            ))}
            <div className="divider" style={{ margin: '6px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-2)' }}>Score ≥ 75</span>
              <span className="badge badge-high">HIGH</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-2)' }}>Score 45–74</span>
              <span className="badge badge-medium">MEDIUM</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-2)' }}>Score &lt; 45</span>
              <span className="badge badge-low">LOW</span>
            </div>
          </div>
        </div>

        {/* Result */}
        <div style={{ alignSelf: 'stretch' }}>
          {!result ? (
            <div className="card" style={{ height: '100%', minHeight: '340px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: '3rem', opacity: 0.8, marginBottom: '16px' }}>🎯</div>
              <div className="empty-state" style={{ padding: '0 20px' }}>
                <div style={{ fontSize: '1.2rem', color: 'var(--text)', marginBottom: '8px', fontWeight: 600 }}>Ready to Analyze</div>
                Enter orbital parameters and click<br /><strong style={{ color: 'var(--accent)' }}>Analyze Risk</strong> to estimate collision probability.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Big result */}
              <div className={`risk-result ${rd.className}`}>
                <div className="risk-icon">{rd.icon}</div>
                <div className="risk-level">{rd.title}</div>
                <div className="risk-desc">{rd.desc}</div>
              </div>

              {/* Summary numbers */}
              <div className="card">
                <div className="section-title">Object Summary</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, textAlign: 'center' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent)' }}>{result.velocity}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3 }}>km/s</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--purple)' }}>{result.orbitType}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3 }}>Orbit</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--green)' }}>{result.altitude}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3 }}>km alt</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="card">
                <div className="section-title">Recommended Actions</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {rd.actions.map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, fontSize: '0.84rem', color: 'var(--text-2)' }}>
                      <span style={{ color: rd.color, flexShrink: 0 }}>▸</span>
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
