import React, { useState, useEffect, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { initialDebrisData } from '../data/debrisData';

function getDebris() {
  const s = localStorage.getItem('debrisData');
  return s ? JSON.parse(s) : initialDebrisData;
}

// Stable pseudo-random from index
function sr(seed) {
  let x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export default function OrbitalMap() {
  const globeRef = useRef();

  const points = useMemo(() => {
    return getDebris().map((d, i) => {
      let color = '#22c55e';
      if (d.riskLevel === 'Medium') color = '#f97316';
      if (d.riskLevel === 'High')   color = '#ef4444';

      // Vary dot size by orbit type so they look different
      let radius = 0.4;
      if (d.orbitType === 'MEO') radius = 0.55;
      if (d.orbitType === 'GEO') radius = 0.65;

      return {
        ...d,
        lat: (sr(i * 7) - 0.5) * 160,
        lng: (sr(i * 11) - 0.5) * 360,
        color,
        radius,
      };
    });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      if (globeRef.current) {
        const ctrl = globeRef.current.controls();
        ctrl.autoRotate = true;
        ctrl.autoRotateSpeed = 0.6;
        ctrl.enableZoom = true;
        ctrl.minDistance = 150;
        ctrl.maxDistance = 550;
      }
    }, 500);
    return () => clearTimeout(t);
  }, []);

  const high   = points.filter(p => p.riskLevel === 'High').length;
  const medium = points.filter(p => p.riskLevel === 'Medium').length;
  const low    = points.filter(p => p.riskLevel === 'Low').length;

  return (
    <div style={{ position: 'relative', height: 'calc(100vh - 120px)', width: '100%', borderRadius: 12, overflow: 'hidden', background: '#000' }}>

      {/* Title */}
      <div style={{ position: 'absolute', top: 20, left: 24, zIndex: 10, pointerEvents: 'none' }}>
        <div className="page-title">Orbital Map</div>
        <div className="page-subtitle">Interactive 3D view of tracked space objects</div>
      </div>

      {/* Object count */}
      <div style={{ position: 'absolute', top: 20, right: 24, zIndex: 10, background: 'rgba(10,12,20,0.85)', padding: '8px 14px', borderRadius: 8, backdropFilter: 'blur(8px)', border: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '1rem', fontWeight: 700, color: 'var(--accent)' }}>{points.length}</span>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginLeft: 6 }}>objects tracked</span>
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: 24, right: 24, zIndex: 10,
        background: 'rgba(10,12,20,0.88)', padding: '14px 18px',
        borderRadius: 10, backdropFilter: 'blur(10px)',
        border: '1px solid var(--border)',
      }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-3)', marginBottom: 10 }}>Risk Level</div>
        {[
          ['#ef4444', `High`, high],
          ['#f97316', `Medium`, medium],
          ['#22c55e', `Low`, low],
        ].map(([c, label, count]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: c, boxShadow: `0 0 5px ${c}` }} />
            <span style={{ fontSize: '0.76rem', color: 'var(--text-2)', flex: 1 }}>{label}</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', color: c, fontWeight: 700 }}>{count}</span>
          </div>
        ))}
        <div style={{ borderTop: '1px solid var(--border)', margin: '10px 0' }} />
        <div style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>
          Dot size: LEO &lt; MEO &lt; GEO
        </div>
      </div>

      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"

        pointsData={points}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={0}
        pointColor="color"
        pointRadius="radius"
        pointResolution={8}
        pointsMerge={false}
        pointLabel={(d) =>
          `<div style="background:rgba(10,12,20,0.92);padding:10px 14px;border-radius:8px;border:1px solid ${d.color};font-family:inherit;min-width:170px;">
            <div style="font-weight:700;color:#f1f5f9;font-size:0.88rem;margin-bottom:4px;">${d.objectName}</div>
            <div style="color:#94a3b8;font-size:0.73rem;">${d.country} · ${d.orbitType} · ${d.launchYear}</div>
            <div style="color:${d.color};font-size:0.73rem;font-weight:600;margin-top:4px;">⚠ ${d.riskLevel} Risk</div>
            <div style="color:#64748b;font-size:0.7rem;margin-top:2px;">${d.altitude} km · ${d.velocity} km/s</div>
          </div>`
        }
      />
    </div>
  );
}
